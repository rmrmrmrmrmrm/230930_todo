"use client";

import { ReactNode } from "react";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { Header } from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";

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
            <Header />
            <PrivateRoute>{children}</PrivateRoute>
          </AuthProvider>
        </ChakraProvider>
      </CacheProvider>
    </>
  );
}
