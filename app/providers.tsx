"use client";

import { ReactNode } from "react";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";

import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import WithSubnavigation from "./components/NavGlobal";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <CacheProvider>
        <ChakraProvider>
          <CSSReset />
          <AuthProvider>
            <WithSubnavigation />
            <PrivateRoute>{children}</PrivateRoute>
          </AuthProvider>
        </ChakraProvider>
      </CacheProvider>
    </>
  );
}
