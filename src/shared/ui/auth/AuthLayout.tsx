import {
    forwardRef,
    useState,
    type CSSProperties,
    type InputHTMLAttributes,
    type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import loginIllustration from "@/shared/assets/images/login-illustration.png";
import logo from "@/shared/assets/images/logo.png";
import userIcon from "@/shared/assets/icons/user.svg";
import emailIcon from "@/shared/assets/icons/email.svg";
import lockIcon from "@/shared/assets/icons/lock.svg";
import eyeClosedIcon from "@/shared/assets/icons/eye-closed.svg";
import infoIcon from "@/shared/assets/icons/info.svg";
import arrowLeftIcon from "@/shared/assets/icons/arrow-left.svg";

export default function AuthLayout({
    children,
    minHeight,
    footer,
}: {
    children: ReactNode;
    minHeight?: number;
    footer?: ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-auth-bg px-4 py-8">
            <div
                className="flex w-full max-w-[1159px] items-stretch overflow-hidden rounded-[20px] bg-auth-card shadow-[3px_3px_9px_0_rgba(44,44,42,0.3)]"
                style={minHeight ? { minHeight } : undefined}
            >
                <img
                    src={loginIllustration}
                    alt="IThub Тула"
                    className="hidden h-auto w-[579px] shrink-0 self-stretch object-cover lg:block"
                />
                <div className="flex w-full flex-col px-8 py-10 sm:px-14 sm:py-12 lg:w-[580px] lg:shrink-0 lg:px-0 lg:py-0 lg:pb-14 lg:pl-[38px] lg:pr-[38px] lg:pt-[124px]">
                    {children}
                </div>
            </div>
            {footer && <div className="w-full max-w-[1159px]">{footer}</div>}
        </div>
    );
}

export function AuthLogo() {
    return (
        <img
            src={logo}
            alt="IThub"
            width={209}
            height={80}
            className="mb-5 h-10 w-[104px] shrink-0 lg:h-20 lg:w-[209px] lg:ml-[-30px]"
        />
    );
}

export function AuthBackLink({
    to = "/login",
    children = "Назад ко входу",
}: {
    to?: string;
    children?: ReactNode;
}) {
    return (
        <Link
            to={to}
            className="mb-6 inline-flex items-center gap-2 font-sans text-[13px] font-medium leading-[100%] tracking-[0%] text-auth-gray transition-opacity hover:opacity-70 lg:mt-[-59px] lg:w-[400px]"
        >
            <img src={arrowLeftIcon} alt="" width={12} height={16} />
            {children}
        </Link>
    );
}

export function AuthLabel({ children }: { children: ReactNode }) {
    return (
        <span className="mb-4 font-sans text-[14px] font-medium leading-[100%] tracking-[0%] text-auth-primary lg:w-[400px]">
            {children}
        </span>
    );
}

export function AuthHeading({ children }: { children: ReactNode }) {
    return (
        <h3 className="mb-3.5 text-[28px] font-medium leading-[100%] tracking-[0%] text-auth-black lg:w-[400px]">
            {children}
        </h3>
    );
}

export function AuthSubtitle({ children }: { children: ReactNode }) {
    return (
        <p className="mb-5.5 max-w-[290px] text-sm font-medium leading-snug text-auth-gray text-[rgba(29, 29, 29, 1)]">
            {children}
        </p>
    );
}

const FIELD_ICONS = {
    user: { src: userIcon, width: 16, height: 16, left: 13 },
    email: { src: emailIcon, width: 16, height: 12, left: 13 },
    lock: { src: lockIcon, width: 14, height: 17, left: 14 },
} as const;

interface AuthFieldProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "className" | "placeholder"
    > {
    label: string;
    icon?: keyof typeof FIELD_ICONS;
    /** Field-level validation message (e.g. from react-hook-form + zod). Renders in red under the field. */
    error?: string;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
    function AuthField({ label, type = "text", icon, error, ...rest }, ref) {
        const iconData = icon ? FIELD_ICONS[icon] : null;
        const isPassword = type === "password";
        const [reveal, setReveal] = useState(false);

        return (
            <div className="w-full max-w-[500px]">
                <div className="relative">
                    {iconData && (
                        <img
                            src={iconData.src}
                            alt=""
                            width={iconData.width}
                            height={iconData.height}
                            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                            style={{ left: iconData.left }}
                        />
                    )}
                    <input
                        ref={ref}
                        type={isPassword && reveal ? "text" : type}
                        placeholder={label}
                        aria-invalid={!!error}
                        {...rest}
                        className={`h-[53px] w-full rounded-[14px] border bg-white text-sm font-medium text-auth-black outline-none transition-colors placeholder:text-auth-border focus:border-auth-primary ${
                            iconData
                                ? "pl-11 lg:pl-[49px]"
                                : "px-[20px] lg:px-[49px]"
                        } ${isPassword ? "pr-11 lg:pr-[45px]" : iconData ? "pr-5" : ""} ${
                            error ? "border-auth-error" : "border-auth-border"
                        }`}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setReveal((v) => !v)}
                            aria-label={reveal ? "Скрыть пароль" : "Показать пароль"}
                            aria-pressed={reveal}
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-100 transition-opacity hover:opacity-70 lg:right-[14px]"
                        >
                            <img
                                src={eyeClosedIcon}
                                alt=""
                                width={18}
                                height={10}
                                className={reveal ? "opacity-40" : ""}
                            />
                        </button>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-[12px] font-medium text-auth-error">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

export function AuthButton({
    children,
    disabled,
    style,
}: {
    children: ReactNode;
    disabled?: boolean;
    style?: CSSProperties;
}) {
    return (
        <button
            type="submit"
            disabled={disabled}
            style={style}
            className="h-[52px] w-full max-w-[500px] rounded-[14px] bg-auth-button text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
            {children}
        </button>
    );
}

export function AuthInfo() {
    return (
        <div className="mt-9 w-full max-w-[500px] rounded-[14px] bg-auth-bg p-4">
            <div className="flex items-start gap-4">
                <img
                    src={infoIcon}
                    alt=""
                    width={18}
                    height={18}
                    className="pointer-events-none shrink-0"
                />
                <div className="max-w-[370px]">
                    <p className="text-[14px] font-medium leading-[100%] tracking-[0%] text-auth-black">
                        Проверьте папку «Спам»
                    </p>
                    <p className="mt-1.5 text-[13px] font-medium leading-[100%] tracking-[0%] text-auth-gray">
                        Если письмо не пришло в течение нескольких минут,
                        проверьте папку «Спам» или «Нежелательная почта»
                    </p>
                </div>
            </div>
        </div>
    );
}
