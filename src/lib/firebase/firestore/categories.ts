import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    updateDoc,
    type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Category, CategoryFormValues } from "@/types/category";

function docToCategory(id: string, data: Record<string, unknown>): Category {
    return {
        id,
        userId: data.userId as string,
        name: data.name as string,
        color: data.color as string,
        createdAt: data.createdAt as string,
    };
}

export function subscribeToCategories(
    userId: string,
    onData: (categories: Category[]) => void,
    onError: (error: Error) => void
): Unsubscribe {
    const q = collection(db, COLLECTIONS.CATEGORIES);
    return onSnapshot(
        q,
        (snapshot) => {
            const categories = snapshot.docs
                .filter((d) => (d.data() as Record<string, unknown>).userId === userId)
                .map((d) =>
                    docToCategory(d.id, d.data() as Record<string, unknown>)
                );
            onData(categories);
        },
        onError
    );
}

export async function createCategory(
    userId: string,
    values: CategoryFormValues
): Promise<void> {
    await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
        userId,
        name: values.name,
        color: values.color,
        createdAt: new Date().toISOString(),
    });
}

export async function updateCategory(
    categoryId: string,
    values: CategoryFormValues
): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.CATEGORIES, categoryId), {
        name: values.name,
        color: values.color,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteCategory(categoryId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, categoryId));
}
