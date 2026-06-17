import { describe, expect, test, vi } from "vitest";
import type { Task } from "@/types/task";
import {
    filterTasks,
    getPriorityOrder,
    isOverdue,
    sortTasks,
    validateTaskForm,
} from "./task";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
    id: "t1",
    userId: "u1",
    title: "テストタスク",
    description: "",
    completed: false,
    priority: "medium",
    categoryId: null,
    dueDate: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
});

describe("filterTasks", () => {
    const tasks: Task[] = [
        makeTask({ id: "1", categoryId: "cat1", priority: "high", completed: false }),
        makeTask({ id: "2", categoryId: "cat2", priority: "medium", completed: true }),
        makeTask({ id: "3", categoryId: null, priority: "low", completed: false }),
    ];

    test("カテゴリIDでフィルタリングできる", () => {
        const result = filterTasks(tasks, { categoryId: "cat1" });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("1");
    });

    test("優先度でフィルタリングできる", () => {
        const result = filterTasks(tasks, { priority: "medium" });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("2");
    });

    test("完了状態でフィルタリングできる（完了のみ）", () => {
        const result = filterTasks(tasks, { completed: true });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("2");
    });

    test("完了状態でフィルタリングできる（未完了のみ）", () => {
        const result = filterTasks(tasks, { completed: false });
        expect(result).toHaveLength(2);
    });

    test("複数条件をANDで絞り込める", () => {
        const result = filterTasks(tasks, { priority: "high", completed: false });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("1");
    });

    test("フィルター条件が空のとき全件返す", () => {
        const result = filterTasks(tasks, {});
        expect(result).toHaveLength(3);
    });
});

describe("sortTasks", () => {
    test("createdAt降順でソートできる", () => {
        const tasks: Task[] = [
            makeTask({ id: "1", createdAt: "2024-01-01T00:00:00.000Z" }),
            makeTask({ id: "2", createdAt: "2024-03-01T00:00:00.000Z" }),
            makeTask({ id: "3", createdAt: "2024-02-01T00:00:00.000Z" }),
        ];
        const result = sortTasks(tasks, "createdAt");
        expect(result.map((t) => t.id)).toEqual(["2", "3", "1"]);
    });

    test("dueDate昇順でソートできる（nullは末尾）", () => {
        const tasks: Task[] = [
            makeTask({ id: "1", dueDate: "2024-03-01" }),
            makeTask({ id: "2", dueDate: null }),
            makeTask({ id: "3", dueDate: "2024-01-01" }),
        ];
        const result = sortTasks(tasks, "dueDate");
        expect(result.map((t) => t.id)).toEqual(["3", "1", "2"]);
    });

    test("priorityでソートできる（高→中→低）", () => {
        const tasks: Task[] = [
            makeTask({ id: "1", priority: "low" }),
            makeTask({ id: "2", priority: "high" }),
            makeTask({ id: "3", priority: "medium" }),
        ];
        const result = sortTasks(tasks, "priority");
        expect(result.map((t) => t.id)).toEqual(["2", "3", "1"]);
    });
});

describe("validateTaskForm", () => {
    test("タイトルが空のときエラーを返す", () => {
        const errors = validateTaskForm({
            title: "",
            description: "",
            priority: "medium",
            categoryId: null,
            dueDate: null,
        });
        expect(errors.title).toBeDefined();
    });

    test("タイトルが100文字を超えるときエラーを返す", () => {
        const errors = validateTaskForm({
            title: "a".repeat(101),
            description: "",
            priority: "medium",
            categoryId: null,
            dueDate: null,
        });
        expect(errors.title).toBeDefined();
    });

    test("正常な値のときエラーなしを返す", () => {
        const errors = validateTaskForm({
            title: "タイトル",
            description: "",
            priority: "medium",
            categoryId: null,
            dueDate: null,
        });
        expect(errors.title).toBeUndefined();
    });
});

describe("isOverdue", () => {
    test("期日が昨日のタスクは期日超過", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2024-06-17"));
        const task = makeTask({ dueDate: "2024-06-16", completed: false });
        expect(isOverdue(task)).toBe(true);
        vi.useRealTimers();
    });

    test("期日が今日のタスクは期日超過でない", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2024-06-17"));
        const task = makeTask({ dueDate: "2024-06-17", completed: false });
        expect(isOverdue(task)).toBe(false);
        vi.useRealTimers();
    });

    test("dueDateがnullのタスクは期日超過でない", () => {
        const task = makeTask({ dueDate: null, completed: false });
        expect(isOverdue(task)).toBe(false);
    });

    test("完了済みタスクは期日超過でない", () => {
        const task = makeTask({ dueDate: "2020-01-01", completed: true });
        expect(isOverdue(task)).toBe(false);
    });
});

describe("getPriorityOrder", () => {
    test("highは0を返す", () => {
        expect(getPriorityOrder("high")).toBe(0);
    });

    test("mediumは1を返す", () => {
        expect(getPriorityOrder("medium")).toBe(1);
    });

    test("lowは2を返す", () => {
        expect(getPriorityOrder("low")).toBe(2);
    });
});
