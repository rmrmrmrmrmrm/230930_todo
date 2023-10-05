"use client";

import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export const ButtonBack: React.FC = () => {
  const router = useRouter();
  const linkToTop = () => router.back();
  return (
    <>
      <Button
        onClick={linkToTop}
        w="90px"
        bgColor="blue.300"
        rounded="full"
        textAlign="center"
        border="1px"
        borderColor="black"
      >
        Back
      </Button>
    </>
  );
};
