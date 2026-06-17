"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { useTasks } from "@/contexts/TasksContext";
import { isCategoryDeletable } from "@/lib/domain/category";
import {
    createCategory,
    deleteCategory,
    updateCategory,
} from "@/lib/firebase/firestore/categories";
import type { Category, CategoryFormValues } from "@/types/category";
import CategoryForm from "./CategoryForm";

type Mode =
    | { type: "list" }
    | { type: "create" }
    | { type: "edit"; category: Category };

export default function CategoryList() {
    const { user } = useAuth();
    const { categories, loading, error } = useCategories();
    const { tasks } = useTasks();
    const [mode, setMode] = useState<Mode>({ type: "list" });
    const [deleting, setDeleting] = useState<string | null>(null);

    async function handleCreate(values: CategoryFormValues) {
        if (!user) return;
        await createCategory(user.uid, values);
        setMode({ type: "list" });
    }

    async function handleUpdate(category: Category, values: CategoryFormValues) {
        await updateCategory(category.id, values);
        setMode({ type: "list" });
    }

    async function handleDelete(category: Category) {
        if (!isCategoryDeletable(category, tasks)) {
            alert(
                `「${category.name}」は使用中のタスクがあるため削除できません。\nタスクのカテゴリを変更してから削除してください。`
            );
            return;
        }
        if (!confirm(`「${category.name}」を削除しますか？`)) return;
        setDeleting(category.id);
        try {
            await deleteCategory(category.id);
        } finally {
            setDeleting(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <p className="text-gray-500 dark:text-gray-400">読み込み中...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 py-8 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 m-4 rounded-lg">
                <p className="font-medium">データの取得に失敗しました</p>
                <p className="mt-1 text-red-500 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 py-8 text-sm text-red-600 bg-red-50 m-4 rounded-lg">
                <p className="font-medium">データの取得に失敗しました</p>
                <p className="mt-1 text-red-500">{error}</p>
            </div>
        );
    }

    if (mode.type === "create") {
        return (
            <div className="px-4 py-6">
                <h2 className="text-lg font-bold mb-4 dark:text-gray-100">カテゴリを追加</h2>
                <CategoryForm
                    onSubmit={handleCreate}
                    onCancel={() => setMode({ type: "list" })}
                    submitLabel="追加"
                />
            </div>
        );
    }

    if (mode.type === "edit") {
        const cat = mode.category;
        return (
            <div className="px-4 py-6">
                <h2 className="text-lg font-bold mb-4 dark:text-gray-100">カテゴリを編集</h2>
                <CategoryForm
                    initialValues={{ name: cat.name, color: cat.color }}
                    onSubmit={(values) => handleUpdate(cat, values)}
                    onCancel={() => setMode({ type: "list" })}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {categories.length} 件
                </span>
                <Button
                    variant="primary"
                    onClick={() => setMode({ type: "create" })}
                    className="h-9 text-sm px-3"
                >
                    + 追加
                </Button>
            </div>
            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                    <p>カテゴリがありません</p>
                </div>
            ) : (
                <ul>
                    {categories.map((cat) => (
                        <li
                            key={cat.id}
                            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800"
                        >
                            <span
                                className="w-4 h-4 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color }}
                            />
                            <span className="flex-1 text-base dark:text-gray-100">{cat.name}</span>
                            <button
                                onClick={() =>
                                    setMode({ type: "edit", category: cat })
                                }
                                className="text-sm text-blue-600 dark:text-blue-400 px-2 py-1"
                            >
                                編集
                            </button>
                            <button
                                onClick={() => handleDelete(cat)}
                                disabled={deleting === cat.id}
                                className="text-sm text-red-600 dark:text-red-400 px-2 py-1 disabled:opacity-50"
                            >
                                削除
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
