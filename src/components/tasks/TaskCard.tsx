"use client";

import Link from "next/link";
import { useCategories } from "@/contexts/CategoriesContext";
import { isOverdue } from "@/lib/domain/task";
import type { Task } from "@/types/task";
import PriorityBadge from "./PriorityBadge";

type Props = {
    task: Task;
    onToggleCompleted: (task: Task) => void;
};

export default function TaskCard({ task, onToggleCompleted }: Props) {
    const { categories } = useCategories();
    const category = categories.find((c) => c.id === task.categoryId);
    const overdue = isOverdue(task);

    return (
        <div
            className={`flex items-start gap-3 p-4 border-b border-gray-100 ${
                task.completed ? "opacity-60" : ""
            }`}
        >
            <button
                onClick={() => onToggleCompleted(task)}
                className="mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                style={{
                    borderColor: task.completed ? "#3B82F6" : "#D1D5DB",
                    backgroundColor: task.completed ? "#3B82F6" : "transparent",
                }}
                aria-label={task.completed ? "未完了に戻す" : "完了にする"}
            >
                {task.completed && (
                    <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}
            </button>
            <Link
                href={`/tasks/${task.id}`}
                className="flex-1 min-w-0 block"
            >
                <p
                    className={`text-base font-medium truncate ${
                        task.completed ? "line-through text-gray-400" : "text-gray-900"
                    }`}
                >
                    {task.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
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
                        <span
                            className={`text-xs ${
                                overdue ? "text-red-500 font-medium" : "text-gray-500"
                            }`}
                        >
                            {overdue ? "⚠ " : ""}
                            {task.dueDate}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}
