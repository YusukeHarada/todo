"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToCategories } from "@/lib/firebase/firestore/categories";
import type { Category } from "@/types/category";

type CategoriesState = {
    categories: Category[];
    loading: boolean;
};

const CategoriesContext = createContext<CategoriesState>({
    categories: [],
    loading: true,
});

export function CategoriesProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setCategories([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const unsubscribe = subscribeToCategories(
            user.uid,
            (data) => {
                setCategories(data);
                setLoading(false);
            },
            () => setLoading(false)
        );
        return unsubscribe;
    }, [user]);

    return (
        <CategoriesContext.Provider value={{ categories, loading }}>
            {children}
        </CategoriesContext.Provider>
    );
}

export function useCategories() {
    return useContext(CategoriesContext);
}
