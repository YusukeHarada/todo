import CategoryList from "@/components/categories/CategoryList";

export default function CategoriesPage() {
    return (
        <div>
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-base font-semibold">カテゴリ</h2>
            </div>
            <CategoryList />
        </div>
    );
}
