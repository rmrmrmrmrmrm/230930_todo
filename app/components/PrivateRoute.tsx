import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Container } from "@chakra-ui/react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // alert("ユーザーチェック実行");
    if (!user && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login");
    }
  }, [pathname]);

  if (!user && pathname !== "/login" && pathname !== "/signup") {
    return null;
  }

  return (
    <>
      {/*  border="1px" */}
      <Container maxW="800px" my={10} centerContent>
        {children}
      </Container>
    </>
  );
};
