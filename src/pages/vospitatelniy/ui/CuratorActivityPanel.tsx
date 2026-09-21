import { useMemo } from 'react'
import { GROUPS, STUDENTS, studentZone, useAllTalks } from '@/entities/group-student'

// Реальных метрик "среднее время беседа→закрытие долга" и "% закрывших
// долг после беседы" у нас нет — зоны в демо-данных статичны, не
// пересчитываются во времени, так что "закрытие" зафиксировать нечем.
// Вместо выдумывания процентов — то, что реально трекается через
// talks-store: сколько бесед провёл каждый куратор и кто из красных
// студентов его группы(групп) вообще ни разу не был на беседе.
export default function CuratorActivityPanel() {
  const talks = useAllTalks()

  const rows = useMemo(() => {
    const curators = new Map<string, { curator: string; groups: string[]; talksCount: number; noTalkRed: string[] }>()
    for (const g of GROUPS) {
      const cur = curators.get(g.curator) ?? { curator: g.curator, groups: [], talksCount: 0, noTalkRed: [] }
      cur.groups.push(g.name)
      curators.set(g.curator, cur)
    }
    for (const s of STUDENTS) {
      const group = GROUPS.find((g) => g.name === s.group)
      if (!group) continue
      const cur = curators.get(group.curator)
      if (!cur) continue
      const studentTalks = talks.filter((t) => t.studentId === s.id)
      cur.talksCount += studentTalks.length
      if (studentZone(s) === 'red' && studentTalks.length === 0) cur.noTalkRed.push(s.name)
    }
    return Array.from(curators.values())
  }, [talks])

  return (
    <div className="rounded-[16px] border border-border bg-white p-4">
      <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Активность кураторов</div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.curator} className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] bg-gray-light px-3 py-2">
            <div>
              <div className="text-[13px] font-semibold text-auth-black">{r.curator}</div>
              <div className="text-[11px] text-auth-gray">{r.groups.join(', ')}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-auth-gray">Бесед: <b className="text-auth-black">{r.talksCount}</b></span>
              {r.noTalkRed.length > 0 ? (
                <span className="rounded-full bg-red-light px-2.5 py-0.5 text-[11px] font-semibold text-red">
                  Не отреагировал: {r.noTalkRed.length}
                </span>
              ) : (
                <span className="rounded-full bg-green-light px-2.5 py-0.5 text-[11px] font-semibold text-green">Всё под контролем</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
