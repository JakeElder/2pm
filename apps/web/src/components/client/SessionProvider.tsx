"use client";

import { SessionDto } from "@2pm/core";
import { createContext, ReactNode } from "react";

type SessionContextType = {
  session: SessionDto;
};

export const SessionContext = createContext<SessionContextType | null>(null);

type Props = {
  session: SessionDto;
  children: ReactNode;
};

export const SessionProvider = ({ session, children }: Props) => {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};
