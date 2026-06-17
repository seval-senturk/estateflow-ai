import type { Metadata } from "next";

import { AuthBrandPanel } from "@/components/layouts";
import { appConfig } from "@/config/app";

export const metadata: Metadata = {
  title: "Authentication",
  description: `Sign in to ${appConfig.name}`,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
