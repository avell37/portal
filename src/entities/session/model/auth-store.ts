import { useSyncExternalStore } from "react";
import type { User } from "@/entities/user";
import { DEMO_USERS } from "@/entities/user";

interface AuthState {
    users: User[];
    currentUser: User | null;
}

const STORAGE_KEY = "portal-auth-v3";

function loadInitialState(): AuthState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as AuthState;
    } catch {
        // ignore malformed/blocked storage and fall back to the seeded demo state
    }
    return { users: DEMO_USERS, currentUser: null };
}

function login(
    email: string,
    password: string,
): { ok: true } | { ok: false; error: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const user = state.users.find(
        (u) => u.email === normalizedEmail && u.password === password,
    );
    if (!user) {
        return { ok: false, error: "Неверный логин или пароль" };
    }
    setState({ currentUser: user });
    return { ok: true };
}

function resetPassword(
    email: string,
    newPassword: string,
): { ok: true } | { ok: false; error: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = state.users.some((u) => u.email === normalizedEmail);
    if (!exists) {
        return { ok: false, error: "Аккаунт с таким логином не найден" };
    }
    setState({
        users: state.users.map((u) =>
            u.email === normalizedEmail ? { ...u, password: newPassword } : u,
        ),
    });
    return { ok: true };
}

function logout() {
    setState({ currentUser: null });
}

const actions = { login, resetPassword, logout };

type FullAuthState = AuthState & typeof actions;

let state: AuthState = loadInitialState();
// Cached so `useSyncExternalStore`'s getSnapshot returns a *stable* reference
// between state changes — a fresh `{...state, ...actions}` on every call
// would make React think the store changes on every render and loop forever.
let snapshot: FullAuthState = { ...state, ...actions };
const listeners = new Set<() => void>();

function setState(partial: Partial<AuthState>) {
    state = { ...state, ...partial };
    snapshot = { ...state, ...actions };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // storage unavailable (private mode, quota) — state still works in-memory
    }
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** Minimal zustand-shaped store: `useAuth(selector)` subscribes to re-renders,
 * `useAuth()` with no selector returns the whole store, and
 * `useAuth.getState()` reads synchronously outside of render (event handlers). */
export function useAuth<T = FullAuthState>(
    selector?: (s: FullAuthState) => T,
): T {
    return useSyncExternalStore(subscribe, () =>
        selector ? selector(snapshot) : (snapshot as unknown as T),
    );
}

useAuth.getState = () => snapshot;
