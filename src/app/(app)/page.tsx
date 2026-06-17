import Link from "next/link";
import TaskList from "@/components/tasks/TaskList";

export default function TasksPage() {
    return (
        <div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-base font-semibold">タスク</h2>
                <Link
                    href="/tasks/new"
                    className="flex items-center justify-center h-9 px-3 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg"
                >
                    + 追加
                </Link>
            </div>
            <TaskList />
        </div>
    );
}
