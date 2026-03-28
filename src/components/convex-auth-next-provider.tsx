"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import type { ConvexReactClient } from "convex/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function ConvexAuthNextProvider({
  client,
  children,
}: {
  client: ConvexReactClient;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <ConvexAuthProvider client={client} replaceURL={(relativeUrl) => void router.replace(relativeUrl)}>
      {children}
    </ConvexAuthProvider>
  );
}
