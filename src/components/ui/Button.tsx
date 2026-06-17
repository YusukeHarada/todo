import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    fullWidth?: boolean;
};

const variantClasses: Record<Variant, string> = {
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300",
    secondary:
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300",
    ghost: "text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50",
};

export default function Button({
    variant = "primary",
    fullWidth = false,
    className = "",
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            className={`h-11 px-4 rounded-lg text-base font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
        >
            {children}
        </button>
    );
}
