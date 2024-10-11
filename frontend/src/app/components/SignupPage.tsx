"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { AxiosError } from "axios";

import { createUser } from "../api/auth";

export interface FormData {
  name: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormData>({
    name: "",
    password: "",
  });

  const handleChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!values.name || !values.password) {
      alert("이름 또는 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await createUser(values);
      console.log("회원가입 결과: ", response);

      if (response.status === 200) {
        alert("회원가입 성공! 로그인 해주세요.");
        router.push("/login");
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
      <h1 className="text-2xl mb-8">🖌️ 회원가입</h1>
      <form onSubmit={onSubmit} className="text-xl flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <label htmlFor="name" className="w-20">
            닉네임
          </label>
          <input
            id="name"
            minLength={5}
            maxLength={30}
            autoComplete="off"
            autoFocus
            onChange={handleChangeValues}
            className="px-2 py-1 border rounded-md w-60 outline-none"
          />
        </div>
        <div className="flex gap-4 items-center">
          <label htmlFor="password" className="w-20">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            minLength={8}
            maxLength={20}
            onChange={handleChangeValues}
            className="px-2 py-1 border rounded-md w-60 outline-none"
          />
        </div>
        <button
          type="submit"
          className="p-1 mt-4 rounded-md bg-amber-100 outline-none"
        >
          회원가입
        </button>
      </form>
    </section>
  );
}
