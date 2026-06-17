import type { Category, CategoryFormValues } from "@/types/category";
import type { Task } from "@/types/task";

export type CategoryValidationError = {
    name?: string;
};

export function validateCategoryForm(
    values: CategoryFormValues
): CategoryValidationError {
    const errors: CategoryValidationError = {};
    if (!values.name.trim()) {
        errors.name = "カテゴリ名を入力してください";
    } else if (values.name.length > 30) {
        errors.name = "カテゴリ名は30文字以内で入力してください";
    }
    return errors;
}

export function isCategoryDeletable(
    category: Category,
    tasks: Task[]
): boolean {
    return !tasks.some((task) => task.categoryId === category.id);
}
