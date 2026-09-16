import { useMemo, useState } from "react";
import { GROUPS, STUDENTS, studentZone, type Zone } from "@/entities/group-student";
import { ZONE_DOT } from "./ZoneBadge";

const FILTERS: { id: "all" | Zone; label: string }[] = [
    { id: "all", label: "Все" },
    { id: "red", label: "🔴 Красная" },
    { id: "yellow", label: "🟡 Жёлтая" },
    { id: "green", label: "🟢 Зелёная" },
];

interface GroupViewProps {
    groupName: string;
    showBack: boolean;
    onBack: () => void;
    onSelectStudent: (id: number) => void;
}

export default function GroupView({ groupName, showBack, onBack, onSelectStudent }: GroupViewProps) {
    const [zoneFilter, setZoneFilter] = useState<"all" | Zone>("all");
    const group = GROUPS.find((g) => g.name === groupName);
    const allStudents = useMemo(() => STUDENTS.filter((s) => s.group === groupName), [groupName]);
    const students = zoneFilter === "all" ? allStudents : allStudents.filter((s) => studentZone(s) === zoneFilter);

    const red = allStudents.filter((s) => studentZone(s) === "red").length;
    const yellow = allStudents.filter((s) => studentZone(s) === "yellow").length;
    const green = allStudents.filter((s) => studentZone(s) === "green").length;

    return (
        <div>
            {showBack && (
                <button onClick={onBack} className="mb-3 text-[13px] font-semibold text-auth-primary hover:opacity-75">
                    ← Все группы
                </button>
            )}
            <div className="mb-4 flex flex-wrap items-center gap-4 rounded-[14px] bg-gray-light px-4 py-2.5 text-[12px] text-auth-gray">
                <span className="text-[14px] font-semibold text-auth-black">Группа {groupName}</span>
                <span>Куратор: <b className="text-auth-black">{group?.curator}</b></span>
                <span>Красных: <b className="text-red">{red}</b></span>
                <span>Жёлтых: <b className="text-amber">{yellow}</b></span>
                <span>Зелёных: <b className="text-green">{green}</b></span>
                <span>Всего: <b className="text-auth-black">{allStudents.length}</b></span>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setZoneFilter(f.id)}
                        className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                            zoneFilter === f.id ? "bg-auth-primary text-white" : "bg-gray-light text-gray hover:opacity-80"
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                {students.map((s) => {
                    const zone = studentZone(s);
                    return (
                        <div
                            key={s.id}
                            onClick={() => onSelectStudent(s.id)}
                            className="flex cursor-pointer flex-wrap items-center gap-3 rounded-[14px] border border-border bg-white px-3.5 py-2.5 transition-colors hover:bg-purple-light"
                        >
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ZONE_DOT[zone] }} />
                            <span className="min-w-[140px] text-[13px] font-semibold text-auth-black">{s.name}</span>
                            <div className="flex flex-1 flex-wrap gap-1.5">
                                {s.subjects.map((subj) => (
                                    <span
                                        key={subj.name}
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                            subj.zone === "red" ? "bg-red-light text-red" : subj.zone === "yellow" ? "bg-amber-light text-amber" : "bg-green-light text-green"
                                        }`}
                                    >
                                        {subj.name}: {subj.pct}%
                                    </span>
                                ))}
                            </div>
                            <span className="text-[11px] text-auth-gray">→</span>
                        </div>
                    );
                })}
                {students.length === 0 && (
                    <div className="rounded-[14px] border border-dashed border-border bg-white py-8 text-center text-[13px] text-auth-gray">
                        Нет студентов в этой зоне
                    </div>
                )}
            </div>
        </div>
    );
}
