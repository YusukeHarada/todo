"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import TaskForm from "@/components/tasks/TaskForm";
import { useCategories } from "@/contexts/CategoriesContext";
import { useTasks } from "@/contexts/TasksContext";
import { deleteTask, updateTask } from "@/lib/firebase/firestore/tasks";
import type { TaskFormValues } from "@/types/task";

type Mode = "view" | "edit";

export default function TaskDetailPage() {
    const { taskId } = useParams<{ taskId: string }>();
    const { tasks, loading } = useTasks();
    const { categories } = useCategories();
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("view");
    const [deleting, setDeleting] = useState(false);

    const task = tasks.find((t) => t.id === taskId);
    const category = task
        ? categories.find((c) => c.id === task.categoryId)
        : undefined;

    async function handleUpdate(values: TaskFormValues) {
        if (!task) return;
        await updateTask(task.id, values);
        setMode("view");
    }

    async function handleDelete() {
        if (!task) return;
        if (!confirm("このタスクを削除しますか？")) return;
        setDeleting(true);
        try {
            await deleteTask(task.id);
            router.push("/");
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <p className="text-gray-500">読み込み中...</p>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <p className="text-gray-500">タスクが見つかりません</p>
                <Button variant="secondary" onClick={() => router.push("/")}>
                    一覧に戻る
                </Button>
            </div>
        );
    }

    if (mode === "edit") {
        return (
            <div className="px-4 py-6">
                <h2 className="text-lg font-bold mb-4">タスクを編集</h2>
                <TaskForm
                    initialValues={{
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                        categoryId: task.categoryId,
                        dueDate: task.dueDate,
                    }}
                    onSubmit={handleUpdate}
                    onCancel={() => setMode("view")}
                />
            </div>
        );
    }

    return (
        <div className="px-4 py-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold flex-1">{task.title}</h2>
                <button
                    onClick={() => setMode("edit")}
                    className="text-sm text-blue-600 px-2 py-1 shrink-0"
                >
                    編集
                </button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
                <PriorityBadge priority={task.priority} />
                {category && (
                    <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: category.color }}
                    >
                        {category.name}
                    </span>
                )}
                {task.dueDate && (
                    <span className="text-sm text-gray-500">
                        期日: {task.dueDate}
                    </span>
                )}
            </div>
            {task.description && (
                <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
            )}
            <p className="text-xs text-gray-400">
                作成: {new Date(task.createdAt).toLocaleString("ja-JP")}
            </p>
            <div className="pt-4">
                <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={deleting}
                    fullWidth
                >
                    {deleting ? "削除中..." : "タスクを削除"}
                </Button>
            </div>
            <Button variant="ghost" onClick={() => router.push("/")} fullWidth>
                一覧に戻る
            </Button>
        </div>
    );
}
