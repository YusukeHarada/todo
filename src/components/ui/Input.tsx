import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export default function Input({ label, error, className = "", ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-700">{label}</label>
            )}
            <input
                {...props}
                className={`h-11 px-3 border rounded-lg text-base outline-none transition-colors ${
                    error
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                } ${className}`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
