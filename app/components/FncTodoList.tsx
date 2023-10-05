"use client";

import { AddIcon, DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  HStack,
  Button,
  Select,
  Input,
  InputRightElement,
  InputGroup,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Timestamp, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import db from "../lib/firebase";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import "./FncTodoList.css";

interface TodoItem {
  Create: string;
  Detail: string;
  Id: string;
  Priority: string;
  Status: string;
  Task: string;
  Update: string;
}

const dateFormat = (date: string) => {
  // .toDate() はfirestore のメソッドでタイムスタンプをJSのDate型にしてる
  const formattedDate = format(date.toDate(), "yyyy-MM-dd HH:mm");
  return formattedDate;
};

export const FncTodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const router = useRouter();

  const initialPriority = "";
  const initialStatus = "";

  const todoDataFromFirebase = async () => {
    alert("todo取得");
    const todoData = collection(db, "posts");
    const q = query(todoData, orderBy("Update", "desc"));
    const snapShot = await getDocs(q);
    const getTodoData = snapShot.docs.map((doc) => {
      const { Create, Detail, Id, Priority, Status, Task, Update } = doc.data() as TodoItem;
      return {
        Create: dateFormat(Create),
        Detail,
        Id,
        Priority,
        Status,
        Task,
        Update: dateFormat(Update),
      };
    });
    setTodos(getTodoData);
  };

  useEffect(() => {
    todoDataFromFirebase();
  }, []);

  const linkToCreate = () => {
    router.push("/create");
  };

  const linkToEdit = (Id: string) => {
    router.push(`/edit/${Id}`);
  };

  const DeleteTodo = async (Id: string) => {
    if (window.confirm("削除してよろしいですか？")) {
      await deleteDoc(doc(db, "posts", Id));
      todoDataFromFirebase();
    }
  };

  const onChangeSubTodoPriority = async (Id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    await updateDoc(doc(db, "posts", Id), {
      Priority: e.target.value,
      Update: Timestamp.now(),
    });
    todoDataFromFirebase();
  };

  const onClickStatus = async (Id: string, Status: string) => {
    switch (Status) {
      case "NOT STARTED":
        await updateDoc(doc(db, "posts", Id), {
          Status: "DOING",
          Update: Timestamp.now(),
        });
        todoDataFromFirebase();
        break;
      case "DOING":
        await updateDoc(doc(db, "posts", Id), {
          Status: "DONE",
          Update: Timestamp.now(),
        });
        todoDataFromFirebase();
        break;
      case "DONE":
        await updateDoc(doc(db, "posts", Id), {
          Status: "NOT STARTED",
          Update: Timestamp.now(),
        });
        todoDataFromFirebase();
        break;
    }
  };

  const filteredTodos = todos.filter((todo) => {
    switch (true) {
      case selectedStatus === "" && selectedPriority === "":
        return true;
      case selectedStatus === "" && selectedPriority !== "":
        return todo.Priority === selectedPriority;
      case selectedStatus !== "" && selectedPriority === "":
        return todo.Status === selectedStatus;
      default:
        return todo.Status === selectedStatus && todo.Priority === selectedPriority;
    }
  });

  const handleReset = () => {
    setSelectedPriority(initialPriority);
    setSelectedStatus(initialStatus);
  };

  const itemsPerPage = 6;
  const [itemsOffset, setItemsOffset] = useState(0);
  const endOffset = itemsOffset + itemsPerPage;

  const currentAlbums = filteredTodos.slice(itemsOffset, endOffset);
  const pageCount = Math.ceil(filteredTodos.length / itemsPerPage);

  const handlePageClick = (e: { selected: number }) => {
    const newOffset = (e.selected * itemsPerPage) % filteredTodos.length;
    setItemsOffset(newOffset);
  };

  return (
    <>
      {/* HEAD */}
      <HStack mb={5} w="100%">
        <HStack spacing={2} align="flex-end">
          <FormControl>
            <FormLabel>SEARCH</FormLabel>
            <InputGroup size="sm">
              <InputRightElement>
                <IconButton aria-label="Search task" icon={<SearchIcon />} size="sm" />
              </InputRightElement>
              <Input placeholder="タスクを検索" />
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>STATUS</FormLabel>
            <Select
              placeholder="---------"
              size="sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="NOT STARTED">NOT STARTED</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>PRIORITY</FormLabel>
            <Select
              placeholder="---------"
              size="sm"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Middle">Middle</option>
              <option value="Low">Low</option>
            </Select>
          </FormControl>
          <Box>
            <Button variant="outline" colorScheme="gray" rounded="full" onClick={handleReset}>
              RESET
            </Button>
          </Box>
        </HStack>
        <Spacer />
        <Box>
          {" "}
          <IconButton
            aria-label="Create task"
            icon={<AddIcon />}
            colorScheme="blue"
            rounded="full"
            mr={2}
            onClick={linkToCreate}
          >
            Task作成
          </IconButton>
        </Box>
      </HStack>
      {/* LIST */}
      <Box w="100%">
        <TableContainer>
          {/*  <TableContainer height="335px"> */}
          <Table variant="simple" className="todolist">
            <Thead bgColor="blue.300">
              <Tr>
                <Th width="40%">Task</Th>
                <Th width="12%">Status</Th>
                <Th width="12%">Priority</Th>
                <Th width="12%">Create</Th>
                <Th width="12%">Update</Th>
                <Th width="12%">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentAlbums.map((todo) => (
                <Tr key={todo.Id}>
                  <Td width="40%" className="top_td_task">
                    <Link href={`/show/${todo.Id}`} style={{ cursor: "pointer" }}>
                      {todo.Task}
                    </Link>
                  </Td>
                  <Td width="12%" className="top_td_status">
                    {todo.Status === "NOT STARTED" && (
                      <Button
                        width={100}
                        fontSize={6}
                        bgColor="blue.50"
                        rounded="full"
                        textAlign="center"
                        onClick={() => onClickStatus(todo.Id, todo.Status)}
                      >
                        {todo.Status}
                      </Button>
                    )}
                    {todo.Status === "DOING" && (
                      <Button
                        width={100}
                        fontSize={6}
                        bgColor="blue.200"
                        rounded="full"
                        textAlign="center"
                        onClick={() => onClickStatus(todo.Id, todo.Status)}
                      >
                        {todo.Status}
                      </Button>
                    )}
                    {todo.Status === "DONE" && (
                      <Button
                        width={100}
                        fontSize={6}
                        bgColor="blue.500"
                        rounded="full"
                        textAlign="center"
                        onClick={() => onClickStatus(todo.Id, todo.Status)}
                      >
                        {todo.Status}
                      </Button>
                    )}
                  </Td>
                  <Td width="12%" className="top_td_priority">
                    <Select size="sm" value={todo.Priority} onChange={(e) => onChangeSubTodoPriority(todo.Id, e)}>
                      <option value="High">High</option>
                      <option value="Middle">Middle</option>
                      <option value="Low">Low</option>
                    </Select>
                  </Td>
                  <Td width="12%" className="top_td_timestamp">
                    {todo.Create}
                  </Td>
                  <Td width="12%" className="top_td_timestamp">
                    {todo.Update}
                  </Td>
                  <Td width="12%" className="top_td_action">
                    <IconButton
                      aria-label="Edit task"
                      icon={<EditIcon />}
                      size="s"
                      ml={4}
                      onClick={() => {
                        linkToEdit(todo.Id);
                      }}
                    />
                    <IconButton
                      aria-label="Delete task"
                      icon={<DeleteIcon />}
                      size="s"
                      ml={4}
                      onClick={() => {
                        DeleteTodo(todo.Id);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      {/* PAGER */}
      <Box display="flex" justifyContent="center">
        <ReactPaginate
          pageCount={pageCount}
          onPageChange={handlePageClick}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
          previousLabel="<"
          nextLabel=">"
          pageLinkClassName="page-item"
          previousLinkClassName="page-item-nextAndPrevious"
          nextLinkClassName="page-item-nextAndPrevious"
          breakLabel="..."
          breakLinkClassName="page-item-disablebutton"
          containerClassName="pagination"
          activeLinkClassName="active"
        />
      </Box>
    </>
  );
};
