"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteNotice } from "@/lib/supabase/notices";

const NoticesContext = createContext<SiteNotice[]>([]);

export function NoticesProvider({
  notices,
  children,
}: {
  notices: SiteNotice[];
  children: ReactNode;
}) {
  return (
    <NoticesContext.Provider value={notices}>{children}</NoticesContext.Provider>
  );
}

export function useNotices(): SiteNotice[] {
  return useContext(NoticesContext);
}
