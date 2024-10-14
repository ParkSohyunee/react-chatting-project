"use client";

import useForm from "../hooks/useForm";

import CustomButton from "../CustomButton";
import TextField from "../TextField";
import { createChattingRoom } from "@/app/api/chattings";
import { AxiosError } from "axios";

export default function Chattings() {
  const { values, getTextFieldInputProps } = useForm({
    initialState: { name: "" },
  });

  const handleCreateRoom = async () => {
    if (!values.name.trim()) {
      alert("채팅방 이름을 입력해주세요.");
      return;
    }

    try {
      const response = await createChattingRoom(values);
      console.log(response.result); // null
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message);
      }
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <TextField
          label="채팅방명"
          field="name"
          placeholder="채팅방 이름을 입력해주세요."
          minLength={10}
          maxLength={50}
          autoFocus
          {...getTextFieldInputProps("name")}
        />
        <CustomButton type="button" onClick={handleCreateRoom}>
          + 채팅방 만들기
        </CustomButton>
      </div>
    </section>
  );
}
