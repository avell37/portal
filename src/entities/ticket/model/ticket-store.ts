import { useSyncExternalStore } from "react";
import { INITIAL_TICKETS } from "./mock-data";
import type { Ticket, TicketStatus } from "./types";

const STORAGE_KEY = "portal-tickets-v1";

function loadInitial(): Ticket[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Ticket[];
    } catch {
        // ignore malformed/blocked storage and fall back to the seeded demo tickets
    }
    return INITIAL_TICKETS;
}

let tickets: Ticket[] = loadInitial();
const listeners = new Set<() => void>();

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {
        // storage unavailable (private mode, quota) — state still works in-memory
    }
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function createTicket(input: Omit<Ticket, "id" | "status" | "date">) {
    tickets = [
        { ...input, id: crypto.randomUUID(), status: "Новая", date: "только что" },
        ...tickets,
    ];
    persist();
}

export function setTicketStatus(id: string, status: TicketStatus) {
    tickets = tickets.map((t) => (t.id === id ? { ...t, status } : t));
    persist();
}

export function useTickets(): Ticket[] {
    return useSyncExternalStore(subscribe, () => tickets);
}
