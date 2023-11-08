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
import { dateFormat } from "../util/dateFormat";
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

export const FncTodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const router = useRouter();

  // todoデータ取得
  const todoDataFromFirebase = async () => {
    // alert("todo取得"); //無限レンダリングセーフ
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
  // 作成
  const linkToCreate = () => {
    router.push("/create");
  };
  // 編集
  const linkToEdit = (Id: string) => {
    router.push(`/edit/${Id}`);
  };
  // 削除
  const DeleteTodo = async (Id: string) => {
    if (window.confirm("削除してよろしいですか？")) {
      await deleteDoc(doc(db, "posts", Id));
      todoDataFromFirebase();
    }
  };
  // キーワード検索
  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearch = async (event: any) => {
    // 入力されたデータを取得
    const searchtext = event.target.value.toLowerCase();
    // useStateに持たせる
    setSearchTerm(searchtext);
    console.log(searchTerm);
  };
  // キーワードを元に検索
  const searchFilter = () => {
    const filteredList = todos.filter((todo: any) => todo.Task.toLowerCase().includes(searchTerm));
    console.log(filteredList);
    // 検索した内容を表示する
    setTodos(filteredList);
  };
  // 優先度・状態のフィルター
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const initialPriority = "";
  const initialStatus = "";
  const filteredTodos = todos.filter((todo) => {
    switch (true) {
      // 条件なし
      case selectedStatus === "" && selectedPriority === "":
        return true;
      //
      case selectedStatus === "" && selectedPriority !== "":
        return todo.Priority === selectedPriority;
      //
      case selectedStatus !== "" && selectedPriority === "":
        return todo.Status === selectedStatus;
      //
      default:
        return todo.Status === selectedStatus && todo.Priority === selectedPriority;
    }
  });
  // フィルターの解除
  const handleReset = () => {
    setSelectedPriority(initialPriority);
    setSelectedStatus(initialStatus);
    alert("検索キーワードを空にする");
    setSearchTerm("");
    todoDataFromFirebase();
  };
  // 優先度の変更
  const onChangeSubTodoPriority = async (Id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    await updateDoc(doc(db, "posts", Id), {
      Priority: e.target.value,
      Update: Timestamp.now(),
    });
    todoDataFromFirebase();
  };
  // 状態の変更
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
  // ページネーション
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
              <Input type="text" placeholder="タスクを検索" onChange={handleSearch} value={searchTerm} />
              <InputRightElement>
                <IconButton
                  aria-label="Search task"
                  icon={<SearchIcon />}
                  size="sm"
                  type="submit"
                  onClick={() => searchFilter()}
                />
              </InputRightElement>
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
