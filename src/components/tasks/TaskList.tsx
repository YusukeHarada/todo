"use client";

import { useState } from "react";
import { useTasks } from "@/contexts/TasksContext";
import { type TaskFilter, type TaskSortKey, filterTasks, sortTasks } from "@/lib/domain/task";
import { toggleTaskCompleted } from "@/lib/firebase/firestore/tasks";
import type { Task } from "@/types/task";
import TaskCard from "./TaskCard";
import TaskFilterBar from "./TaskFilterBar";

export default function TaskList() {
    const { tasks, loading, error } = useTasks();
    const [filter, setFilter] = useState<TaskFilter>({ completed: false });
    const [sortBy, setSortBy] = useState<TaskSortKey>("createdAt");

    async function handleToggle(task: Task) {
        await toggleTaskCompleted(task.id, !task.completed);
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
                <p className="mt-1">{error}</p>
            </div>
        );
    }

    const filtered = filterTasks(tasks, filter);
    const sorted = sortTasks(filtered, sortBy);

    return (
        <div>
            <TaskFilterBar
                filter={filter}
                sortBy={sortBy}
                onFilterChange={setFilter}
                onSortChange={setSortBy}
            />
            {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400 dark:text-gray-500">
                    <p>タスクがありません</p>
                </div>
            ) : (
                <ul>
                    {sorted.map((task) => (
                        <li key={task.id}>
                            <TaskCard task={task} onToggleCompleted={handleToggle} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
