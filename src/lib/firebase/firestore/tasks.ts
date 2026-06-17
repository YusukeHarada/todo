import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc,
    type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Task, TaskFormValues } from "@/types/task";

function docToTask(id: string, data: Record<string, unknown>): Task {
    return {
        id,
        userId: data.userId as string,
        title: data.title as string,
        description: (data.description as string) ?? "",
        completed: (data.completed as boolean) ?? false,
        priority: (data.priority as Task["priority"]) ?? "medium",
        categoryId: (data.categoryId as string | null) ?? null,
        dueDate: (data.dueDate as string | null) ?? null,
        createdAt: data.createdAt as string,
        updatedAt: data.updatedAt as string,
    };
}

export function subscribeToTasks(
    userId: string,
    onData: (tasks: Task[]) => void,
    onError: (error: Error) => void
): Unsubscribe {
    const q = collection(db, COLLECTIONS.TASKS);
    return onSnapshot(
        q,
        (snapshot) => {
            const tasks = snapshot.docs
                .filter((d) => (d.data() as Record<string, unknown>).userId === userId)
                .map((d) => docToTask(d.id, d.data() as Record<string, unknown>));
            onData(tasks);
        },
        onError
    );
}

export async function createTask(
    userId: string,
    values: TaskFormValues
): Promise<void> {
    const now = new Date().toISOString();
    await addDoc(collection(db, COLLECTIONS.TASKS), {
        userId,
        title: values.title,
        description: values.description,
        completed: false,
        priority: values.priority,
        categoryId: values.categoryId,
        dueDate: values.dueDate,
        createdAt: now,
        updatedAt: now,
    });
}

export async function updateTask(
    taskId: string,
    values: Partial<TaskFormValues>
): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.TASKS, taskId), {
        ...values,
        updatedAt: new Date().toISOString(),
    });
}

export async function toggleTaskCompleted(
    taskId: string,
    completed: boolean
): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.TASKS, taskId), {
        completed,
        updatedAt: new Date().toISOString(),
    });
}

export async function deleteTask(taskId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.TASKS, taskId));
}

export async function clearTaskCategory(taskId: string): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.TASKS, taskId), {
        categoryId: null,
        updatedAt: new Date().toISOString(),
    });
}
