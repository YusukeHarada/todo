"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { validateCategoryForm } from "@/lib/domain/category";
import type { CategoryFormValues } from "@/types/category";

const PRESET_COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
];

type Props = {
    initialValues?: Partial<CategoryFormValues>;
    onSubmit: (values: CategoryFormValues) => Promise<void>;
    onCancel: () => void;
    submitLabel?: string;
};

const defaultValues: CategoryFormValues = {
    name: "",
    color: "#3B82F6",
};

export default function CategoryForm({
    initialValues,
    onSubmit,
    onCancel,
    submitLabel = "保存",
}: Props) {
    const [values, setValues] = useState<CategoryFormValues>({
        ...defaultValues,
        ...initialValues,
    });
    const [errors, setErrors] = useState<{ name?: string }>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validationErrors = validateCategoryForm(values);
        if (validationErrors.name) {
            setErrors(validationErrors);
            return;
        }
        setSubmitError(null);
        setSubmitting(true);
        try {
            await onSubmit(values);
        } catch (err) {
            setSubmitError(
                err instanceof Error ? err.message : "保存に失敗しました。もう一度お試しください。"
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="カテゴリ名"
                value={values.name}
                onChange={(e) => {
                    setValues((prev) => ({ ...prev, name: e.target.value }));
                    setErrors({});
                }}
                placeholder="例: 仕事、プライベート"
                error={errors.name}
                autoFocus
            />
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">カラー</label>
                <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setValues((prev) => ({ ...prev, color }))}
                            className="w-8 h-8 rounded-full transition-transform"
                            style={{
                                backgroundColor: color,
                                outline:
                                    values.color === color
                                        ? `3px solid ${color}`
                                        : "none",
                                outlineOffset: "2px",
                                transform:
                                    values.color === color ? "scale(1.15)" : "scale(1)",
                            }}
                            aria-label={color}
                        />
                    ))}
                </div>
            </div>
            {submitError && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                    {submitError}
                </p>
            )}
            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    className="flex-1"
                >
                    キャンセル
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? "保存中..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}
