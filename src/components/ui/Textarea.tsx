import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
};

export default function Textarea({ label, error, className = "", ...props }: TextareaProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            )}
            <textarea
                {...props}
                className={`px-3 py-2 border rounded-lg text-base outline-none transition-colors resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    error
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                } ${className}`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
