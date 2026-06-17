"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToCategories } from "@/lib/firebase/firestore/categories";
import type { Category } from "@/types/category";

type CategoriesState = {
    categories: Category[];
    loading: boolean;
    error: string | null;
};

const CategoriesContext = createContext<CategoriesState>({
    categories: [],
    loading: true,
    error: null,
});

export function CategoriesProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setCategories([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        const unsubscribe = subscribeToCategories(
            user.uid,
            (data) => {
                setCategories(data);
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
        <CategoriesContext.Provider value={{ categories, loading, error }}>
            {children}
        </CategoriesContext.Provider>
    );
}

export function useCategories() {
    return useContext(CategoriesContext);
}
