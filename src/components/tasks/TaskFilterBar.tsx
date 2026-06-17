"use client";

import { useCategories } from "@/contexts/CategoriesContext";
import type { TaskFilter, TaskSortKey } from "@/lib/domain/task";
import type { Priority } from "@/types/task";

type Props = {
    filter: TaskFilter;
    sortBy: TaskSortKey;
    onFilterChange: (filter: TaskFilter) => void;
    onSortChange: (sortBy: TaskSortKey) => void;
};

const selectClass =
    "h-8 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shrink-0";

export default function TaskFilterBar({
    filter,
    sortBy,
    onFilterChange,
    onSortChange,
}: Props) {
    const { categories } = useCategories();

    return (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <select
                value={filter.completed === undefined ? "" : String(filter.completed)}
                onChange={(e) => {
                    const val = e.target.value;
                    onFilterChange({
                        ...filter,
                        completed: val === "" ? undefined : val === "true",
                    });
                }}
                className={selectClass}
            >
                <option value="">全て</option>
                <option value="false">未完了</option>
                <option value="true">完了</option>
            </select>
            <select
                value={filter.priority ?? ""}
                onChange={(e) => {
                    const val = e.target.value;
                    onFilterChange({
                        ...filter,
                        priority: val === "" ? undefined : (val as Priority),
                    });
                }}
                className={selectClass}
            >
                <option value="">優先度: 全て</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
            </select>
            {categories.length > 0 && (
                <select
                    value={filter.categoryId ?? ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        onFilterChange({
                            ...filter,
                            categoryId: val === "" ? undefined : val,
                        });
                    }}
                    className={selectClass}
                >
                    <option value="">カテゴリ: 全て</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            )}
            <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as TaskSortKey)}
                className={selectClass}
            >
                <option value="createdAt">作成日順</option>
                <option value="dueDate">期日順</option>
                <option value="priority">優先度順</option>
            </select>
        </div>
    );
}
