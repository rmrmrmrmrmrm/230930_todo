"use client";

import {
  Box,
  Button,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Center,
  Spacer,
} from "@chakra-ui/react";
import { ButtonBack } from "./ButtonBack";
import { usePathname, useRouter } from "next/navigation";
import { collection, doc, getDocs, setDoc, query, where, Timestamp, orderBy } from "firebase/firestore";
import db from "../lib/firebase";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Comment {
  commentId: string;
  commentName: string;
  commentDetail: string;
  commentCreate: string;
}
interface Todo {
  Create: string;
  Detail: string;
  Task: string;
  Update: string;
}

export const FncShow = () => {
  // State
  const [todos, setTodos] = useState<Todo>({
    Create: "",
    Detail: "",
    Task: "",
    Update: "",
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  // id
  const pathname = usePathname();
  const segments = pathname.split("/");
  const id = segments[segments.length - 1];
  if (id == "show") {
    router.push(`/404`);
  }

  // Todoリスト
  const postsCol = collection(db, "posts");
  const queryRef = query(postsCol, where("Id", "==", id));
  const fetchData = async () => {
    // alert("ToDo読み込み"); //無限レンダリングセーフ
    try {
      const querySnapshot = await getDocs(queryRef);
      const todoDocObj = querySnapshot.docs[0];
      if (todoDocObj) {
        const data = todoDocObj.data();
        setTodos({
          Create: format(data.Create.toDate(), "yyyy-MM-dd HH:mm"),
          Detail: data.Detail,
          Task: data.Task,
          Update: format(data.Update.toDate(), "yyyy-MM-dd HH:mm"),
        });
      }
    } catch (err) {
      // console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // コメント表示
  const fetchComment = async () => {
    // alert("コメント読み込み"); //無限レンダリングセーフ
    try {
      const cmtCol = collection(db, "comments");
      const cmtQueryRef = query(cmtCol, where("Id", "==", id), orderBy("commentCreate", "desc"));
      getDocs(cmtQueryRef).then((cmtSnapShot) => {
        const cmtObj = cmtSnapShot.docs.map((doc) => {
          return {
            commentId: doc.data().commentId,
            commentName: doc.data().commentName,
            commentDetail: doc.data().commentDetail,
            commentCreate: format(doc.data().commentCreate.toDate(), "yyyy-MM-dd HH:mm"),
          };
        });
        setComments(cmtObj);
      });
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    fetchComment();
  }, []);

  // コメント追加
  // イベントの型アノテーションを追加
  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // const { commentName, commentDetail } = e.target.elements;
      const newComment = doc(collection(db, "comments"));
      const comdetailInput = e.currentTarget.elements.namedItem("commentDetail") as HTMLInputElement;
      const comnameInput = e.currentTarget.elements.namedItem("commentName") as HTMLInputElement;
      const comdetail = comdetailInput.value;
      const comname = comnameInput.value;
      await setDoc(newComment, {
        Id: id,
        commentCreate: Timestamp.now(),
        commentDetail: comdetail,
        commentId: newComment.id,
        commentName: comname,
      });
      /*
      元：e.target.reset();
      アノテーションしても実行されなかった。実行されなくても問題なかった
      const form = e.currentTarget;
      form.reset();
      */
      // modal-close
      onClose();
      // fetchComment();
    } catch (err: any) {
      // console.log(err);
    }
  };

  const linkToEdit = () => {
    router.push(`/edit/${id}`);
  };
  return (
    <>
      {/* Comment/Back */}
      <Flex justify="end" marginLeft="auto">
        <Box>
          <Button
            mr="20px"
            w="90px"
            bgColor="blue.700"
            rounded="full"
            color="white"
            textAlign="center"
            border="1px"
            borderColor="black"
            onClick={onOpen}
          >
            Comment
          </Button>
          <ButtonBack />
        </Box>
      </Flex>

      <Flex direction={{ base: "column", md: "row" }} align="flex-start" w="100%">
        {/* Todo */}
        <Box
          w={{ base: "100%", md: "55%" }}
          mt="20px"
          border="1px"
          borderColor="gray"
          p={2}
          mr="20px"
          borderRadius="10px"
        >
          <Box bg="blue.300">
            <Text as="b" px={2}>
              TITLE
            </Text>
          </Box>
          <Text mb="20px" p={2}>
            {todos.Task}
          </Text>
          <Box bg="blue.300">
            <Text as="b" px={2}>
              DETAIL
            </Text>
          </Box>
          <Text mb="20px" p={2}>
            {todos.Detail}
          </Text>
          <Flex mb="20px">
            <Button
              w="25%"
              mr="30px"
              bgColor="blue.300"
              rounded="full"
              textAlign="center"
              border="1px"
              borderColor="black"
              onClick={linkToEdit}
            >
              Edit
            </Button>
            <Box w="35%">
              <Text>Create</Text>
              <Text>{todos.Create}</Text>
            </Box>
            <Box w="35%">
              <Text>Update</Text>
              <Text>{todos.Update}</Text>
            </Box>
          </Flex>
        </Box>
        {/* comment */}
        <Box w={{ base: "100%", md: "45%" }} mt="20px">
          {comments.map((comment) => {
            return (
              <Box mb="20px" border="1px" borderColor="gray" borderRadius="5px" key={comment.commentId}>
                <Flex bgColor="blue.600" color="white" px={3}>
                  <Text>{comment.commentName}</Text>
                  <Spacer />
                  <Text textAlign="right">{comment.commentCreate}</Text>
                </Flex>
                <Text p={3}>{comment.commentDetail}</Text>
              </Box>
            );
          })}
        </Box>
      </Flex>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          minWidth="none"
          w="480px"
          h="480px"
          px={5}
          py={5}
          mt="120px"
          border="1px"
          borderColor="gray"
          borderRadius="10px"
        >
          <Text fontSize="5xl" as="b">
            Comment
          </Text>
          <Center>
            <form onSubmit={addComment} style={{ width: "100%" }}>
              <Box>
                {/* commentName */}
                <FormControl mt="16px" mb="10px">
                  <FormLabel>Name</FormLabel>
                  <Input size="lg" id="commentName" name="commentName" type="commentName" placeholder="Name" />
                </FormControl>
                {/* commentDetail */}
                <FormControl marginBottom="16px">
                  <FormLabel>Your Comment</FormLabel>
                  <Textarea
                    h="160px"
                    resize="none"
                    id="commentDetail"
                    name="commentDetail"
                    placeholder="Your Comment"
                  />
                </FormControl>
                {/* Create */}
                <Button
                  bgColor="blue.600"
                  w="100%"
                  color="white"
                  border="1px"
                  borderColor="black"
                  borderRadius="10px"
                  type="submit"
                >
                  CREATE
                </Button>
              </Box>
            </form>
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
};
