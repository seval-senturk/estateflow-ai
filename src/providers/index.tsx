"use client";

import { NotificationProvider } from "./notification-provider";
import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";

import type { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export { NotificationProvider } from "./notification-provider";
export { SessionProvider } from "./session-provider";
export { ThemeProvider } from "./theme-provider";
