"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToTasks } from "@/lib/firebase/firestore/tasks";
import type { Task } from "@/types/task";

type TasksState = {
    tasks: Task[];
    loading: boolean;
};

const TasksContext = createContext<TasksState>({
    tasks: [],
    loading: true,
});

export function TasksProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const unsubscribe = subscribeToTasks(
            user.uid,
            (data) => {
                setTasks(data);
                setLoading(false);
            },
            () => setLoading(false)
        );
        return unsubscribe;
    }, [user]);

    return (
        <TasksContext.Provider value={{ tasks, loading }}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    return useContext(TasksContext);
}
