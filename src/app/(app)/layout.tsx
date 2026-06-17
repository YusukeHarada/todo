"use client";

import dynamic from "next/dynamic";

const AppClientLayout = dynamic(
    () => import("@/components/layout/AppClientLayout"),
    { ssr: false }
);

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppClientLayout>{children}</AppClientLayout>;
}
