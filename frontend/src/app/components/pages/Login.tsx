"use client";

import { FormEvent } from "react";
import { AxiosError } from "axios";
import { loginUser } from "@/app/api/auth";
import useForm from "../hooks/useForm";

export default function Login() {
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
      console.log("로그인 결과: ", response);

      if (response.status === 200) {
        // 로그인하면 채팅방 목록 페이지로 이동
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    }
  };

  return (
    <section className="flex flex-col items-center mt-8">
      <h1 className="text-2xl mb-8">🪄 로그인</h1>
      <form onSubmit={onSubmit} className="text-xl flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <label htmlFor="name" className="w-20">
            닉네임
          </label>
          <input
            minLength={5}
            maxLength={30}
            autoComplete="off"
            autoFocus
            {...getTextFieldInputProps("name")}
            className="px-2 py-1 border rounded-md w-60 outline-none"
          />
        </div>
        <div className="flex gap-4 items-center">
          <label htmlFor="password" className="w-20">
            비밀번호
          </label>
          <input
            type="password"
            minLength={8}
            maxLength={20}
            {...getTextFieldInputProps("password")}
            className="px-2 py-1 border rounded-md w-60 outline-none"
          />
        </div>
        <button
          type="submit"
          className="p-1 mt-4 rounded-md bg-amber-100 outline-none"
        >
          로그인
        </button>
      </form>
    </section>
  );
}
