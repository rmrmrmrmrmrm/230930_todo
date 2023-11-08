"use client";

import { Heading, Box, Button, Text, Input, Flex, Textarea, FormControl } from "@chakra-ui/react";
import { ButtonBack } from "./ButtonBack";
import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import db from "../lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { dateFormat } from "../util/dateFormat";

interface TodoData {
  Task: string;
  Detail: string;
  Create: string;
  Update: string;
}

// export const FncEdit = () => { うごかない
// export default function FncEdit() { うごく
export default function FncEdit() {
  // { params }で[id](uuidの動的ルーティング部分取得機能)が使用できない代わりの記述
  const pathname = usePathname();
  const segments = pathname.split("/");
  const id = segments[segments.length - 1];
  const params = { id: id };
  // console.log("コンポーネント：" + params);

  const router = useRouter();
  const [todo, setTodo] = useState<TodoData>({
    Task: "",
    Detail: "",
    Create: "",
    Update: "",
  });

  const fetchData = async () => {
    alert("編集データ取得");
    try {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      const data = { ...docSnap.data() } as TodoData;
      setTodo({
        Task: data.Task,
        Detail: data.Detail,
        Create: dateFormat(data.Create),
        Update: dateFormat(data.Update),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTodo({ ...todo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (window.confirm("更新してよろしいですか？")) {
      const docRef = doc(db, "posts", params.id);
      await updateDoc(docRef, {
        Task: todo.Task,
        Detail: todo.Detail,
        Update: serverTimestamp(),
      });
      router.push("/");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box w="100%">
      <Flex justify="end">
        <ButtonBack />
      </Flex>

      <form onSubmit={handleSubmit}>
        <Heading as="h4" size="md">
          TITLE
        </Heading>
        <Input
          name="Task"
          value={todo.Task}
          rounded={8}
          h={16}
          size="md"
          placeholder="Text"
          _placeholder={{ color: "gray", fontWeight: "bold", textAlign: "" }}
          onChange={handleInputChange}
        />

        <Heading as="h4" size="md" mt="15px">
          DETAIL
        </Heading>
        <Textarea
          name="Detail"
          value={todo.Detail}
          rounded={8}
          rows={10}
          resize="none"
          size="md"
          placeholder="Text"
          _placeholder={{ color: "gray", fontWeight: "bold" }}
          onChange={handleInputChange}
        />

        <Flex>
          <Box pr={5}>
            <Text fontSize="md" fontWeight="bold" mt="15px">
              Create
            </Text>
            <Text fontSize="xl" fontWeight="bold">
              {todo.Create}
            </Text>
          </Box>

          <Box>
            <Text fontSize="md" fontWeight="bold" mt="15px">
              Update
            </Text>
            <Text fontSize="xl" fontWeight="bold">
              {todo.Update}
            </Text>
          </Box>
        </Flex>

        <Flex justify="end">
          <Button
            type="submit"
            px={5}
            background={"blue.500"}
            border="1px"
            borderColor="blue.900"
            rounded="full"
            fontSize={18}
            color="white"
          >
            UPDATE
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
