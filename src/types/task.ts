export type Priority = "high" | "medium" | "low";

export type Task = {
    id: string;
    userId: string;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    categoryId: string | null;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
};

export type TaskFormValues = {
    title: string;
    description: string;
    priority: Priority;
    categoryId: string | null;
    dueDate: string | null;
};
