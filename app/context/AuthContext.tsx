import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const value: AuthContextType = {
    user,
    loading,
  };

  useEffect(() => {
    // alert("認証チェック実行");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log(user);
      setUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [pathname]);

  if (!loading) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  } else {
    return null;
  }
}
