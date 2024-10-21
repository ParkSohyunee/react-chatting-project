"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { AxiosError } from "axios";

import { loginUser } from "@/app/api/auth";
import useForm from "@/components/hooks/useForm";
import TextField from "@/components/TextField";
import CustomButton from "@/components/CustomButton";

import { AUTH_ERROR_MESSAGE } from "@/libs/constants/messages";
import { AUTH_CODE } from "@/libs/constants/errorCode";
import { setAccessToken } from "@/libs/utils/localStorage";

export default function Login() {
  const router = useRouter();
  const { values, getTextFieldInputProps } = useForm({
    initialState: {
      name: "",
      password: "",
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!values.name || !values.password) {
      alert("이름 또는 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await loginUser(values);
      if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        router.push("/chattings");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorCode: keyof typeof AUTH_CODE = error.response?.data.errorCode;
        alert(AUTH_ERROR_MESSAGE[errorCode]);
      }
    }
  };

  return (
    <section className="flex flex-col items-center mt-8">
      <h1 className="text-2xl mb-8">🪄 로그인</h1>
      <form onSubmit={onSubmit} className="text-xl flex flex-col gap-2">
        <TextField
          label="닉네임"
          field="name"
          minLength={5}
          maxLength={30}
          autoFocus
          {...getTextFieldInputProps("name")}
        />
        <TextField
          label="비밀번호"
          field="password"
          type="password"
          minLength={8}
          maxLength={20}
          {...getTextFieldInputProps("password")}
        />
        <CustomButton type="submit">로그인</CustomButton>
      </form>
    </section>
  );
}
