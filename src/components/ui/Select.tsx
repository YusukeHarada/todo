import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
};

export default function Select({ label, error, className = "", children, ...props }: SelectProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-700">{label}</label>
            )}
            <select
                {...props}
                className={`h-11 px-3 border rounded-lg text-base outline-none transition-colors appearance-none bg-white ${
                    error
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                } ${className}`}
            >
                {children}
            </select>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
