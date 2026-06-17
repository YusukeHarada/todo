"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToTasks } from "@/lib/firebase/firestore/tasks";
import type { Task } from "@/types/task";

type TasksState = {
    tasks: Task[];
    loading: boolean;
    error: string | null;
};

const TasksContext = createContext<TasksState>({
    tasks: [],
    loading: true,
    error: null,
});

export function TasksProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        const unsubscribe = subscribeToTasks(
            user.uid,
            (data) => {
                setTasks(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, [user]);

    return (
        <TasksContext.Provider value={{ tasks, loading, error }}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    return useContext(TasksContext);
}
