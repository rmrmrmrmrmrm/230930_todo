import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";

export const ButtonLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("サインアウト失敗:", err);
      alert("サインアウト失敗");
    }
  };
  return (
    <>
      <Button
        onClick={handleLogout}
        type="button"
        as={"a"}
        fontSize={"sm"}
        fontWeight={600}
        color={"white"}
        bg={"gray.400"}
        _hover={{
          bg: "gray.300",
        }}
      >
        ログアウト
      </Button>
    </>
  );
};
