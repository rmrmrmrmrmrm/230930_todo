import { Flex, Text } from "@chakra-ui/react";
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
        <Text fontSize={20} fontWeight={700} lineHeight={1}>
          {metaSetting.title}
        </Text>
        <Text fontSize={10} className="subtitle">
          {metaSetting.subtitle}
        </Text>
      </Flex>
      <FncSignUp />
    </>
  );
};

export default SignUp;
