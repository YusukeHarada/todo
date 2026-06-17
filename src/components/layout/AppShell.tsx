import AppHeader from "./AppHeader";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-dvh">
            <AppHeader />
            <main className="overflow-y-auto min-h-0 flex-1 pb-16 sm:pb-0">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
