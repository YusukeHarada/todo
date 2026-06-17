"use client";

import { useRouter } from "next/navigation";
import TaskForm from "@/components/tasks/TaskForm";
import { useAuth } from "@/contexts/AuthContext";
import { createTask } from "@/lib/firebase/firestore/tasks";
import type { TaskFormValues } from "@/types/task";

export default function NewTaskPage() {
    const { user } = useAuth();
    const router = useRouter();

    async function handleSubmit(values: TaskFormValues) {
        if (!user) return;
        await createTask(user.uid, values);
        router.push("/");
    }

    return (
        <div className="px-4 py-6">
            <h2 className="text-lg font-bold mb-4">タスクを追加</h2>
            <TaskForm
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
                submitLabel="追加"
            />
        </div>
    );
}
