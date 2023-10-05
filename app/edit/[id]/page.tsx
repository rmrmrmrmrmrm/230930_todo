// "use client"; あると metadata に怒られる
import { Flex, Text } from "@chakra-ui/react";
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
        <Text fontSize={20} fontWeight={700} lineHeight={1}>
          {metaSetting.title}
        </Text>
        <Text fontSize={10} className="subtitle">
          {metaSetting.subtitle}
        </Text>
      </Flex>
      <FncEdit />
    </>
  );
};

export default Edit;
