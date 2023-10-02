import { Flex, Heading } from "@chakra-ui/react";
import type { Metadata } from "next";
import { FncSignUp } from "../components/FncSignUp";

const metaSetting = {
  title: "SIGNUP",
  subtitle: "新規登録",
};

export const metadata: Metadata = {
  title: metaSetting.title,
  description: metaSetting.subtitle,
};

const SignUp = () => {
  return (
    <>
      <Flex w="100%" mb={5} alignItems="flex-end">
        <Heading as="h2" lineHeight="1">
          {metaSetting.title}
        </Heading>
        <p className="subtitle">{metaSetting.subtitle}</p>
      </Flex>
      <FncSignUp />
    </>
  );
};

export default SignUp;
