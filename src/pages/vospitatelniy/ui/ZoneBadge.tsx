import type { Zone } from "@/entities/group-student";

const ZONE_LABEL: Record<Zone, string> = {
    red: "Красная",
    yellow: "Жёлтая",
    green: "Зелёная",
};

const ZONE_CLASS: Record<Zone, string> = {
    red: "bg-red-light text-red",
    yellow: "bg-amber-light text-amber",
    green: "bg-green-light text-green",
};

export const ZONE_DOT: Record<Zone, string> = {
    red: "var(--color-red)",
    yellow: "var(--color-amber)",
    green: "var(--color-green)",
};

export default function ZoneBadge({ zone }: { zone: Zone }) {
    return (
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ZONE_CLASS[zone]}`}>
            {ZONE_LABEL[zone]}
        </span>
    );
}
