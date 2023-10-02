import { Flex, Heading } from "@chakra-ui/react";
import { FncTodoList } from "./components/FncTodoList";

const metaSetting = {
  title: "TOP",
  subtitle: "タスク一覧",
};

const Top = () => {
  return (
    <>
      <Flex w="100%" mb={5} alignItems="flex-end">
        <Heading as="h2" lineHeight="1">
          {metaSetting.title}
        </Heading>
        <p className="subtitle">{metaSetting.subtitle}</p>
      </Flex>
      <FncTodoList />
    </>
  );
};

export default Top;
