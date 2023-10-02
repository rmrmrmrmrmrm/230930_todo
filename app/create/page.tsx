import { Flex, Heading } from "@chakra-ui/react";
import type { Metadata } from "next";
import { FncCreate } from "../components/FncCreate";

const metaSetting = {
  title: "CREATE",
  subtitle: "新規追加",
};

export const metadata: Metadata = {
  title: metaSetting.title,
  description: metaSetting.subtitle,
};

const Create = () => {
  return (
    <>
      <Flex w="100%" mb={5} alignItems="flex-end">
        <Heading as="h2" lineHeight="1">
          {metaSetting.title}
        </Heading>
        <p className="subtitle">{metaSetting.subtitle}</p>
      </Flex>
      <FncCreate />
    </>
  );
};

export default Create;
