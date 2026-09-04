import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/entities/session";
import {
    AuthLayout,
    AuthBackLink,
    AuthButton,
    AuthField,
    AuthHeading,
    AuthInfo,
    AuthLabel,
    AuthLogo,
    AuthPasswordStrength,
    AuthSubtitle,
} from "@/shared/ui";

const emailSchema = z.object({
    email: z.string().min(1, "Введите email").email("Введите корректный email"),
});
type EmailForm = z.infer<typeof emailSchema>;

const passwordSchema = z
    .object({
        password: z
            .string()
            .min(1, "Введите новый пароль")
            .min(4, "Пароль должен быть не короче 4 символов"),
        confirmPassword: z.string().min(1, "Подтвердите новый пароль"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ForgotPasswordPage() {
    const resetPassword = useAuth((s) => s.resetPassword);
    const navigate = useNavigate();
    const [step, setStep] = useState<"email" | "new-password" | "done">(
        "email",
    );
    const [email, setEmail] = useState("");
    const emailForm = useForm<EmailForm>({
        resolver: zodResolver(emailSchema),
    });
    const passwordForm = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
        mode: "onChange",
    });

    function handleFindAccount(data: EmailForm) {
        const exists = useAuth
            .getState()
            .users.some((u) => u.email === data.email.trim().toLowerCase());
        if (!exists) {
            emailForm.setError("root", {
                message:
                    "Аккаунт с таким логином не найден. Уточните его у администратора колледжа.",
            });
            return;
        }
        setEmail(data.email);
        setStep("new-password");
    }

    function handleSetPassword(data: PasswordForm) {
        const result = resetPassword(email, data.password);
        if (!result.ok) {
            passwordForm.setError("root", { message: result.error });
            return;
        }
        setStep("done");
    }

    if (step === "done") {
        return (
            <AuthLayout>
                <AuthLogo />
                <AuthHeading>Пароль обновлён</AuthHeading>
                <AuthSubtitle>
                    Теперь можно войти в портал с новым паролем
                </AuthSubtitle>
                <button
                    onClick={() => navigate("/login")}
                    className="h-[52px] w-full max-w-[500px] rounded-[14px] bg-auth-button text-base font-medium text-white transition-opacity hover:opacity-90"
                >
                    Перейти ко входу
                </button>
            </AuthLayout>
        );
    }

    if (step === "new-password") {
        return (
            <AuthLayout>
                <AuthBackLink />
                <AuthHeading>Новый пароль</AuthHeading>
                <AuthSubtitle>
                    Придумай надежный пароль для вашего аккаунта
                </AuthSubtitle>

                <form
                    onSubmit={passwordForm.handleSubmit(handleSetPassword)}
                    noValidate
                    className="max-w-[500px] space-y-4"
                >
                    <div>
                        <AuthField
                            label="Новый пароль"
                            type="password"
                            icon="lock"
                            error={
                                passwordForm.formState.errors.password
                                    ?.message
                            }
                            {...passwordForm.register("password")}
                        />
                        <AuthPasswordStrength
                            password={passwordForm.watch("password") ?? ""}
                        />
                    </div>
                    <AuthField
                        label="Подтвердите новый пароль"
                        type="password"
                        icon="lock"
                        error={
                            passwordForm.formState.errors.confirmPassword
                                ?.message
                        }
                        {...passwordForm.register("confirmPassword")}
                    />
                    {passwordForm.formState.errors.root && (
                        <p className="text-[13px] font-medium text-auth-error">
                            {passwordForm.formState.errors.root.message}
                        </p>
                    )}
                    <AuthButton
                        disabled={
                            !passwordForm.formState.isValid ||
                            passwordForm.formState.isSubmitting
                        }
                    >
                        Сохранить пароль
                    </AuthButton>
                </form>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <AuthBackLink />
            <AuthLabel>Восстановление пароля</AuthLabel>
            <AuthHeading>Укажите email</AuthHeading>
            <AuthSubtitle>
                Мы отправим ссылку для сброса пароля на указанный адрес
                электронной почты
            </AuthSubtitle>

            <form
                onSubmit={emailForm.handleSubmit(handleFindAccount)}
                noValidate
                className="max-w-[500px] space-y-4"
            >
                <AuthField
                    label="Введите ваш email"
                    type="email"
                    icon="email"
                    error={emailForm.formState.errors.email?.message}
                    {...emailForm.register("email")}
                />
                {emailForm.formState.errors.root && (
                    <p className="text-[13px] font-medium text-auth-error">
                        {emailForm.formState.errors.root.message}
                    </p>
                )}
                <AuthButton disabled={emailForm.formState.isSubmitting}>
                    Отправить ссылку
                </AuthButton>
            </form>

            <AuthInfo />
        </AuthLayout>
    );
}
