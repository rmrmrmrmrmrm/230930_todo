"use client";

import { Box, Button, Text, Input, VStack } from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const FncLogin = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  // イベントの型アノテーションを追加
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // const { email, password } = e.target.elements;
      // ↓ e.currentTarget.elementsから要素を直接取得し、その後でそれらの要素から値を取得する
      const emailInput = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
      const passwordInput = e.currentTarget.elements.namedItem("password") as HTMLInputElement;
      const email = emailInput.value;
      const password = passwordInput.value;

      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      // console.log(err);
      switch (err.code) {
        case "auth/invalid-email":
          setError("正しいメールアドレスの形式で入力してください。");
          break;
        case "auth/user-not-found":
          setError("メールアドレスかパスワードに誤りがあります。");
          break;
        case "auth/wrong-password":
          setError("メールアドレスかパスワードに誤りがあります。");
          break;
        default:
          setError("メールアドレスかパスワードに誤りがあります。");
          break;
      }
    }
  };
  return (
    <>
      <Box
        w={{ base: "90%", md: "500px" }}
        bg={"blue.100"}
        m={"30px auto"}
        p={"60px"}
        borderRadius={"40px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <form onSubmit={handleSubmit}>
          <Box>
            <Text fontWeight="bold" mb={2}>
              メールアドレス
            </Text>
            <Input id="email" name="email" type="email" placeholder="email" autoComplete="email" bg={"blue.50"} />
          </Box>
          <Box mt={"24px"}>
            <Text fontWeight="bold" mb={2}>
              パスワード
            </Text>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="password"
              autoComplete="password"
              bg={"blue.50"}
            />
          </Box>
          <Box mt={"24px"} textAlign={"center"}>
            <Button
              type="submit"
              bg={"blue.600"}
              borderColor={"blue.600"}
              color={"white"}
              variant="solid"
              borderRadius={"100px"}
              width={"200px"}
            >
              ログイン
            </Button>
          </Box>
          <Box mt={"15px"} textAlign={"center"}>
            <VStack textAlign={"center"}>{error && <p style={{ color: "red" }}>{error}</p>}</VStack>
          </Box>
          <Box mt={"15px"} textAlign={"center"}>
            アカウントを持っていない方は
            <Link href={"/signup"} style={{ color: "gray" }}>
              新規登録
            </Link>
            から。
          </Box>
        </form>
      </Box>
    </>
  );
};
