import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Todo",
    description: "シンプルなTodoアプリ",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" className="h-dvh">
            <body className="h-dvh flex flex-col">{children}</body>
        </html>
    );
}
