"use client";

import Link from "next/link";
import { Box, Button, Text } from "@chakra-ui/react";

const NotFound: React.FC = () => {
  return (
    <>
      <Box textAlign="center">
        <Text fontSize="4xl" lineHeight={1} fontWeight="700">
          404
        </Text>
        <Text fontSize="lg" my={5}>
          This is not the web page you are looking for.
        </Text>
        <Link href={"/"}>
          <Button background={"blue.300"} borderColor={"blue.300"} color={"white"} variant="solid">
            TOP
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default NotFound;
