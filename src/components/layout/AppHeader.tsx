"use client";

import { signOut } from "firebase/auth";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase/client";

export default function AppHeader() {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    async function handleSignOut() {
        await signOut(auth);
        setMenuOpen(false);
    }

    return (
        <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white shrink-0">
            <h1 className="text-lg font-bold">Todo</h1>
            <div className="relative">
                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-gray-200"
                    aria-label="メニュー"
                >
                    {user?.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={user.photoURL}
                            alt={user.displayName ?? "ユーザー"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <svg
                            className="w-5 h-5 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    )}
                </button>
                {menuOpen && (
                    <div className="absolute right-0 top-11 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100 truncate">
                            {user?.displayName ?? user?.email}
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                            ログアウト
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
