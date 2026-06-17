"use client";

import { NotificationProvider } from "./notification-provider";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";

import type { Session } from "next-auth";
import type { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

export function AppProviders({ children, session }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <QueryProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export { NotificationProvider } from "./notification-provider";
export { QueryProvider } from "./query-provider";
export { SessionProvider } from "./session-provider";
export { ThemeProvider } from "./theme-provider";
