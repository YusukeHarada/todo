"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { TasksProvider } from "@/contexts/TasksContext";
import AppShell from "./AppShell";

function AppGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <p className="text-gray-500">読み込み中...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <CategoriesProvider>
            <TasksProvider>
                <AppShell>{children}</AppShell>
            </TasksProvider>
        </CategoriesProvider>
    );
}

export default function AppClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <AppGuard>{children}</AppGuard>
        </AuthProvider>
    );
}
