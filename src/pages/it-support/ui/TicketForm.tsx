import { useState } from "react";
import { Send } from "lucide-react";
import { createTicket } from "@/entities/ticket";
import type { TicketType } from "@/entities/ticket";
import { useAuth } from "@/entities/session";

// Студент подаёт только заявку на неисправность (упрощённая форма).
// У остальных ролей (в демо нет отдельной роли "преподаватель" — её играет
// любой не-студент) есть выбор типа: неисправность или установка ПО, с
// разным набором полей под каждый тип (см. portal_it_support.html, раздел 1).
export default function TicketForm({ onSubmitted }: { onSubmitted: () => void }) {
    const currentUser = useAuth((s) => s.currentUser);
    const isStudent = currentUser?.role === "student";

    const [type, setType] = useState<TicketType>("Неисправность");
    const [room, setRoom] = useState("");
    const [pc, setPc] = useState("");
    const [scope, setScope] = useState<"pc" | "room">("pc");
    const [software, setSoftware] = useState("");
    const [detail, setDetail] = useState("");

    const canSubmit = room.trim() && (type === "Неисправность" ? detail.trim() : software.trim());

    function reset() {
        setRoom("");
        setPc("");
        setSoftware("");
        setDetail("");
        setType("Неисправность");
        setScope("pc");
    }

    function submit() {
        if (!canSubmit || !currentUser) return;
        createTicket({
            type,
            room,
            pc: type === "Установка ПО" ? (scope === "room" ? "Вся аудитория" : pc || "—") : pc || "—",
            softwareName: type === "Установка ПО" ? software : undefined,
            detail: type === "Установка ПО" ? software : detail,
            authorEmail: currentUser.email,
            authorName: currentUser.fullName,
        });
        reset();
        onSubmitted();
    }

    return (
        <div className="rounded-[20px] border border-border bg-blue-light p-5">
            <div className="mb-3 text-[14px] font-semibold text-blue">{isStudent ? "Форма студента" : "Создать заявку"}</div>

            <div className="grid gap-3 sm:grid-cols-2">
                {!isStudent && (
                    <div>
                        <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Тип заявки</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as TicketType)}
                            className="w-full rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
                        >
                            <option>Неисправность</option>
                            <option>Установка ПО</option>
                        </select>
                    </div>
                )}
                <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Аудитория</label>
                    <input
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        placeholder="Например: 204"
                        className="w-full rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
                    />
                </div>

                {type === "Установка ПО" && !isStudent ? (
                    <>
                        <div>
                            <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Область установки</label>
                            <select
                                value={scope}
                                onChange={(e) => setScope(e.target.value as "pc" | "room")}
                                className="w-full rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
                            >
                                <option value="pc">Конкретный ПК</option>
                                <option value="room">Вся аудитория</option>
                            </select>
                        </div>
                        {scope === "pc" && (
                            <div>
                                <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Номер компьютера</label>
                                <input
                                    value={pc}
                                    onChange={(e) => setPc(e.target.value)}
                                    placeholder="Например: ПК-07"
                                    className="w-full rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
                                />
                            </div>
                        )}
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Название программы</label>
                            <input
                                value={software}
                                onChange={(e) => setSoftware(e.target.value)}
                                placeholder="Например: Adobe Photoshop"
                                className="w-full rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Номер компьютера</label>
                            <input
                                value={pc}
                                onChange={(e) => setPc(e.target.value)}
                                placeholder="Например: ПК-07"
                                className="w-full rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Описание проблемы</label>
                            <textarea
                                value={detail}
                                onChange={(e) => setDetail(e.target.value)}
                                placeholder="Опишите что не работает..."
                                rows={2}
                                className="w-full resize-none rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
                            />
                        </div>
                    </>
                )}
            </div>

            <button
                onClick={submit}
                disabled={!canSubmit}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] bg-auth-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Send size={16} />
                Отправить заявку
            </button>
        </div>
    );
}
