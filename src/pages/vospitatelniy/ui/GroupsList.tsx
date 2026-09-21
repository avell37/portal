import { useMemo } from "react";
import { GROUPS, STUDENTS, studentZone } from "@/entities/group-student";
import CuratorActivityPanel from "./CuratorActivityPanel";

export default function GroupsList({ onSelectGroup }: { onSelectGroup: (group: string) => void }) {
    const totals = useMemo(() => {
        let red = 0, yellow = 0, green = 0;
        for (const s of STUDENTS) {
            const z = studentZone(s);
            if (z === "red") red++;
            else if (z === "yellow") yellow++;
            else green++;
        }
        return { red, yellow, green };
    }, []);

    const rows = useMemo(
        () =>
            GROUPS.map((g) => {
                const students = STUDENTS.filter((s) => s.group === g.name);
                const red = students.filter((s) => studentZone(s) === "red").length;
                const yellow = students.filter((s) => studentZone(s) === "yellow").length;
                const green = students.filter((s) => studentZone(s) === "green").length;
                return { ...g, red, yellow, green };
            }),
        [],
    );

    return (
        <div>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-[16px] bg-auth-primary p-4 text-center text-white">
                    <div className="text-2xl font-bold leading-none">{GROUPS.length}</div>
                    <div className="mt-1.5 text-[11px] opacity-80">Группы</div>
                </div>
                <div className="rounded-[16px] bg-red p-4 text-center text-white">
                    <div className="text-2xl font-bold leading-none">{totals.red}</div>
                    <div className="mt-1.5 text-[11px] opacity-80">Красная зона</div>
                </div>
                <div className="rounded-[16px] bg-amber p-4 text-center text-white">
                    <div className="text-2xl font-bold leading-none">{totals.yellow}</div>
                    <div className="mt-1.5 text-[11px] opacity-80">Жёлтая зона</div>
                </div>
                <div className="rounded-[16px] bg-green p-4 text-center text-white">
                    <div className="text-2xl font-bold leading-none">{totals.green}</div>
                    <div className="mt-1.5 text-[11px] opacity-80">Зелёная зона</div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-[16px] border border-border bg-white">
                <table className="w-full text-left text-[13px]">
                    <thead>
                        <tr className="border-b border-border text-[11px] uppercase text-auth-gray">
                            <th className="px-4 py-3 font-semibold">Группа</th>
                            <th className="px-3 py-3 font-semibold">Куратор</th>
                            <th className="px-3 py-3 font-semibold">Красных</th>
                            <th className="px-3 py-3 font-semibold">Жёлтых</th>
                            <th className="px-3 py-3 font-semibold">Зелёных</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((g) => (
                            <tr
                                key={g.name}
                                onClick={() => onSelectGroup(g.name)}
                                className="cursor-pointer border-b border-border last:border-none hover:bg-purple-light"
                            >
                                <td className="px-4 py-2.5 font-semibold text-auth-black">{g.name}</td>
                                <td className="px-3 py-2.5 text-auth-gray">{g.curator}</td>
                                <td className="px-3 py-2.5">
                                    {g.red > 0 ? <span className="rounded-full bg-red-light px-2 py-0.5 text-[11px] font-semibold text-red">{g.red}</span> : <span className="text-auth-gray">—</span>}
                                </td>
                                <td className="px-3 py-2.5">
                                    {g.yellow > 0 ? <span className="rounded-full bg-amber-light px-2 py-0.5 text-[11px] font-semibold text-amber">{g.yellow}</span> : <span className="text-auth-gray">—</span>}
                                </td>
                                <td className="px-3 py-2.5">
                                    <span className="rounded-full bg-green-light px-2 py-0.5 text-[11px] font-semibold text-green">{g.green}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <CuratorActivityPanel />
            </div>
        </div>
    );
}
