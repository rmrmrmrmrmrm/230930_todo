// "use client"; あると metadata に怒られる
import { Flex, Heading } from "@chakra-ui/react";
import type { Metadata } from "next";
import FncEdit from "../../components/FncEdit";

const metaSetting = {
  title: "EDIT",
  subtitle: "編集",
};

export const metadata: Metadata = {
  title: metaSetting.title,
  description: metaSetting.subtitle,
};

// export default function Edit({ params }) { "use client";ないと動かない
// console.log("ページ：" + params); "use client";ないとターミナル側にしかでてこなくなる
// alert('ページ：'+params); "use client";ないとundifindになる
const Edit = () => {
  return (
    <>
      <Flex w="100%" mb={5} alignItems="flex-end">
        <Heading as="h2" lineHeight="1">
          {metaSetting.title}
        </Heading>
        <p className="subtitle">{metaSetting.subtitle}</p>
      </Flex>
      <FncEdit />
    </>
  );
};

export default Edit;
