import type { OuFlag } from "@/entities/teacher";

const LABEL: Record<OuFlag, string> = {
    ok: "Беседа проведена",
    repeat: "Повторный ОУ",
    escalated: "Флаг директору",
};

const CLASS: Record<OuFlag, string> = {
    ok: "bg-green-light text-green",
    repeat: "bg-red-light text-red",
    escalated: "bg-amber-light text-amber",
};

export default function OuFlagBadge({ flag }: { flag: OuFlag }) {
    return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${CLASS[flag]}`}>{LABEL[flag]}</span>;
}
