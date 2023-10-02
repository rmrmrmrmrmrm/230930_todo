"use client";

import { v4 as uuidv4 } from "uuid";
import { Heading, Box, Button, Input, RadioGroup, Radio, Stack, Flex, Textarea, FormControl } from "@chakra-ui/react";
import { useState } from "react";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import db from "../lib/firebase";
import { BackButton } from "./BackButton";

const initialTodo = {
  Task: "",
  Detail: "",
  Priority: "High",
  Status: "NOT STARTED",
};

const priorities = ["High", "Middle", "Low"];

export const FncCreate: React.FC = () => {
  const router = useRouter();
  const [newTodo, setNewTodo] = useState(initialTodo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTodo({ ...newTodo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(newTodo);
    // alert("ストップ");
    if (confirm("Todoリストを追加します。よろしいですか？")) {
      const newId = uuidv4();
      try {
        await setDoc(doc(db, "posts", newId), {
          ...newTodo,
          Id: newId,
          Create: serverTimestamp(),
          Update: serverTimestamp(),
        });
        console.log("todoが追加されました: ");
        setNewTodo(initialTodo);
        router.push("/");
      } catch (error) {
        alert("todoの登録に失敗しました。");
        console.log(error);
      }
    }
  };

  return (
    <>
      <Box w="100%">
        <Flex justify="end">
          <BackButton />
        </Flex>

        <form onSubmit={handleSubmit}>
          <FormControl>
            <Heading as="h4" size="md">
              TITLE
            </Heading>
            <Input
              name="Task"
              rounded={8}
              h={16}
              size="md"
              placeholder="Text"
              _placeholder={{ color: "gray", fontWeight: "bold" }}
              value={newTodo.Task}
              onChange={handleInputChange}
              required
            />

            <Heading as="h4" size="md" mt="15px">
              DETAIL
            </Heading>
            <Textarea
              name="Detail"
              rounded={8}
              rows={10}
              resize="none"
              size="md"
              placeholder="Text"
              _placeholder={{ color: "gray", fontWeight: "bold" }}
              value={newTodo.Detail}
              onChange={handleInputChange}
            />

            <Box fontSize="20px" fontWeight="bold">
              <RadioGroup name="Priority" value={newTodo.Priority}>
                <Heading as="h4" size="md" mt="15px">
                  PRIORITY
                </Heading>
                <Stack direction="row">
                  {priorities.map((priority) => (
                    <Radio
                      key={priority}
                      value={priority}
                      isChecked={priority === newTodo.Priority}
                      onChange={handleInputChange}
                    >
                      <Box fontSize="20px" pr={3}>
                        {priority}
                      </Box>
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>

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
                CREATE
              </Button>
            </Flex>
          </FormControl>
        </form>
      </Box>
    </>
  );
};
