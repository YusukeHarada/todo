import { describe, expect, test } from "vitest";
import type { Category } from "@/types/category";
import type { Task } from "@/types/task";
import { isCategoryDeletable, validateCategoryForm } from "./category";

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
    id: "cat1",
    userId: "u1",
    name: "テストカテゴリ",
    color: "#3B82F6",
    createdAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
});

const makeTask = (overrides: Partial<Task> = {}): Task => ({
    id: "t1",
    userId: "u1",
    title: "タスク",
    description: "",
    completed: false,
    priority: "medium",
    categoryId: null,
    dueDate: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
});

describe("validateCategoryForm", () => {
    test("名前が空のときエラーを返す", () => {
        const errors = validateCategoryForm({ name: "", color: "#000000" });
        expect(errors.name).toBeDefined();
    });

    test("名前が30文字を超えるときエラーを返す", () => {
        const errors = validateCategoryForm({
            name: "a".repeat(31),
            color: "#000000",
        });
        expect(errors.name).toBeDefined();
    });

    test("正常な値のときエラーなしを返す", () => {
        const errors = validateCategoryForm({
            name: "仕事",
            color: "#3B82F6",
        });
        expect(errors.name).toBeUndefined();
    });
});

describe("isCategoryDeletable", () => {
    test("使用中のカテゴリは削除不可", () => {
        const category = makeCategory({ id: "cat1" });
        const tasks: Task[] = [makeTask({ categoryId: "cat1" })];
        expect(isCategoryDeletable(category, tasks)).toBe(false);
    });

    test("未使用のカテゴリは削除可能", () => {
        const category = makeCategory({ id: "cat1" });
        const tasks: Task[] = [makeTask({ categoryId: "cat2" })];
        expect(isCategoryDeletable(category, tasks)).toBe(true);
    });
});
