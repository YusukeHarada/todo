"use client";

import dynamic from "next/dynamic";

const AuthClientLayout = dynamic(
    () => import("@/components/layout/AuthClientLayout"),
    { ssr: false }
);

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthClientLayout>{children}</AuthClientLayout>;
}
