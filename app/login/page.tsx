import { Flex, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import { FncLogin } from "../components/FncLogin";

const metaSetting = {
  title: "LOGIN",
  subtitle: "ログイン",
};

export const metadata: Metadata = {
  title: metaSetting.title,
  description: metaSetting.subtitle,
};

const Login = () => {
  return (
    <>
      <Flex w="100%" mb={5} alignItems="flex-end">
        <Text fontSize={20} fontWeight={700} lineHeight={1}>
          {metaSetting.title}
        </Text>
        <Text fontSize={10} className="subtitle">
          {metaSetting.subtitle}
        </Text>
      </Flex>
      <FncLogin />
    </>
  );
};

export default Login;
