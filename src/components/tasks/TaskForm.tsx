"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useCategories } from "@/contexts/CategoriesContext";
import { validateTaskForm } from "@/lib/domain/task";
import type { Priority, Task, TaskFormValues } from "@/types/task";

type Props = {
    initialValues?: Partial<TaskFormValues>;
    onSubmit: (values: TaskFormValues) => Promise<void>;
    onCancel: () => void;
    submitLabel?: string;
};

const defaultValues: TaskFormValues = {
    title: "",
    description: "",
    priority: "medium",
    categoryId: null,
    dueDate: null,
};

export default function TaskForm({
    initialValues,
    onSubmit,
    onCancel,
    submitLabel = "保存",
}: Props) {
    const { categories } = useCategories();
    const [values, setValues] = useState<TaskFormValues>({
        ...defaultValues,
        ...initialValues,
    });
    const [errors, setErrors] = useState<{ title?: string }>({});
    const [submitting, setSubmitting] = useState(false);

    function updateField<K extends keyof TaskFormValues>(
        key: K,
        value: TaskFormValues[K]
    ) {
        setValues((prev) => ({ ...prev, [key]: value }));
        if (key === "title") setErrors((prev) => ({ ...prev, title: undefined }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validationErrors = validateTaskForm(values);
        if (validationErrors.title) {
            setErrors(validationErrors);
            return;
        }
        setSubmitting(true);
        try {
            await onSubmit(values);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="タイトル"
                value={values.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="タスクのタイトル"
                error={errors.title}
                autoFocus
            />
            <Textarea
                label="説明"
                value={values.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="詳細を入力（任意）"
                rows={3}
            />
            <Select
                label="優先度"
                value={values.priority}
                onChange={(e) =>
                    updateField("priority", e.target.value as Priority)
                }
            >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
            </Select>
            <Select
                label="カテゴリ"
                value={values.categoryId ?? ""}
                onChange={(e) =>
                    updateField(
                        "categoryId",
                        e.target.value === "" ? null : e.target.value
                    )
                }
            >
                <option value="">なし</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </Select>
            <Input
                label="期日"
                type="date"
                value={values.dueDate ?? ""}
                onChange={(e) =>
                    updateField("dueDate", e.target.value === "" ? null : e.target.value)
                }
            />
            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    className="flex-1"
                >
                    キャンセル
                </Button>
                <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                >
                    {submitting ? "保存中..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}
