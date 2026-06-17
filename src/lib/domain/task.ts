import type { Priority, Task, TaskFormValues } from "@/types/task";

export type TaskFilter = {
    categoryId?: string | null;
    priority?: Priority | null;
    completed?: boolean | null;
};

export type TaskSortKey = "createdAt" | "dueDate" | "priority";

export type TaskValidationError = {
    title?: string;
};

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
    return tasks.filter((task) => {
        if (filter.categoryId !== undefined && filter.categoryId !== null) {
            if (task.categoryId !== filter.categoryId) return false;
        }
        if (filter.priority !== undefined && filter.priority !== null) {
            if (task.priority !== filter.priority) return false;
        }
        if (filter.completed !== undefined && filter.completed !== null) {
            if (task.completed !== filter.completed) return false;
        }
        return true;
    });
}

export function getPriorityOrder(priority: Priority): number {
    const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    return order[priority];
}

export function sortTasks(tasks: Task[], sortBy: TaskSortKey): Task[] {
    return [...tasks].sort((a, b) => {
        if (sortBy === "createdAt") {
            return b.createdAt.localeCompare(a.createdAt);
        }
        if (sortBy === "dueDate") {
            if (a.dueDate === null && b.dueDate === null) return 0;
            if (a.dueDate === null) return 1;
            if (b.dueDate === null) return -1;
            return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === "priority") {
            return getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
        }
        return 0;
    });
}

export function validateTaskForm(values: TaskFormValues): TaskValidationError {
    const errors: TaskValidationError = {};
    if (!values.title.trim()) {
        errors.title = "タイトルを入力してください";
    } else if (values.title.length > 100) {
        errors.title = "タイトルは100文字以内で入力してください";
    }
    return errors;
}

export function isOverdue(task: Task): boolean {
    if (task.completed) return false;
    if (task.dueDate === null) return false;
    const today = new Date().toISOString().slice(0, 10);
    return task.dueDate < today;
}
