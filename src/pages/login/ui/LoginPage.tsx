import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/entities/session";
import { ROLES, DEMO_USERS } from "@/entities/user";
import {
    AuthLayout,
    AuthButton,
    AuthCheckbox,
    AuthField,
    AuthHeading,
    AuthLogo,
    AuthSubtitle,
} from "@/shared/ui";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Введите логин или email")
        .email("Введите корректный email"),
    password: z
        .string()
        .min(1, "Введите пароль")
        .min(4, "Пароль должен быть не короче 4 символов"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const login = useAuth((s) => s.login);
    const navigate = useNavigate();
    const [showDemo, setShowDemo] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting, isValid },
    } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

    function onSubmit(data: LoginForm) {
        const result = login(data.email, data.password);
        if (!result.ok) {
            setError("root", { message: result.error });
            return;
        }
        const user = useAuth.getState().currentUser;
        navigate(user ? ROLES[user.role].dashboardPath : "/login");
    }

    function loginAs(demoEmail: string) {
        const result = login(demoEmail, "demo1234");
        if (result.ok) {
            const user = useAuth.getState().currentUser;
            navigate(user ? ROLES[user.role].dashboardPath : "/login");
        }
    }

    return (
        <AuthLayout
            minHeight={736}
            footer={
                <div className="rounded-[14px] border border-border bg-white/60 p-4">
                    <button
                        onClick={() => setShowDemo((v) => !v)}
                        className="text-[13px] font-medium text-auth-button"
                    >
                        {showDemo
                            ? "Скрыть демо-доступы ▲"
                            : "Демо-доступы для тестирования кабинетов ▼"}
                    </button>
                    {showDemo && (
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {DEMO_USERS.map((u) => (
                                <button
                                    key={u.id}
                                    onClick={() => loginAs(u.email)}
                                    className="rounded-[10px] border border-border bg-white px-3 py-2 text-left text-[12px] transition-colors hover:border-auth-primary"
                                >
                                    <div className="font-semibold text-auth-black">
                                        {ROLES[u.role].label}
                                    </div>
                                    <div className="text-auth-border">
                                        {u.email}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            }
        >
            <AuthLogo />
            <AuthHeading>Вход в портал</AuthHeading>
            <AuthSubtitle>
                Используй аккаунт IThub LXP для доступа к образовательному
                порталу
            </AuthSubtitle>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="max-w-[500px] space-y-4"
            >
                <AuthField
                    label="Логин или email"
                    type="email"
                    icon="user"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <AuthField
                    label="Пароль"
                    type="password"
                    icon="lock"
                    error={errors.password?.message}
                    {...register("password")}
                />

                {errors.root && (
                    <p className="text-[13px] font-medium text-auth-error">
                        {errors.root.message}
                    </p>
                )}

                <div className="flex items-center justify-between pb-3 pt-1">
                    <AuthCheckbox label="Запомнить меня" />
                    <Link
                        to="/forgot-password"
                        className="text-[13px] font-bold text-auth-button"
                    >
                        Забыли пароль?
                    </Link>
                </div>

                <AuthButton disabled={isSubmitting || !isValid}>
                    Войти
                </AuthButton>
            </form>
        </AuthLayout>
    );
}
