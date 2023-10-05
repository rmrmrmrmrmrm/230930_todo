import { Flex, Text } from "@chakra-ui/react";
import { FncTodoList } from "./components/FncTodoList";

const metaSetting = {
  title: "TOP",
  subtitle: "タスク一覧",
};

const Top = () => {
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
      <FncTodoList />
    </>
  );
};

export default Top;
