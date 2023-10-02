import { Flex, Heading } from "@chakra-ui/react";
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
        <Heading as="h2" lineHeight="1">
          {metaSetting.title}
        </Heading>
        <p className="subtitle">{metaSetting.subtitle}</p>
      </Flex>
      <FncLogin />
    </>
  );
};

export default Login;
