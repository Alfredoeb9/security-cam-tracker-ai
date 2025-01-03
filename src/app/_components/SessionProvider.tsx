"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React, { type FC, type ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
  session: Session;
}

const SessionProviderWrapper: FC<ProviderProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
