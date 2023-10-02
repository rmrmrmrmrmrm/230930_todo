import { Flex, Spacer, Heading, Button, Container, Box } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "../lib/firebase";
import { useAuthContext } from "../context/AuthContext";

export const Header: React.FC = () => {
  const { user } = useAuthContext();
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
      <Box width="100%" bg={"blue.300"}>
        <Flex w="100%" maxW="800px" border="1px" p={3} mb={5} alignItems="center" style={{ margin: "auto" }}>
          <Heading as="h1">
            <Link href={"/"}>TODO</Link>
          </Heading>
          <Spacer />｜<Link href="/login">login</Link>｜<Link href="/signup">signup</Link>｜<Link href="/">top</Link>｜
          <Link href="/show/BZgofB5tp30xrWgcsQB9">show(testID)</Link>｜<Link href="/create">create</Link>｜
          <Link href="/edit/BZgofB5tp30xrWgcsQB9">edit(testID)</Link>｜
          {user && (
            <Button
              onClick={handleLogout}
              type="button"
              color={"white"}
              bg={"gray.400"}
              borderRadius={"50px"}
              width={"100px"}
              ml={3}
            >
              LOGOUT
            </Button>
          )}
        </Flex>
      </Box>
    </>
  );
};
