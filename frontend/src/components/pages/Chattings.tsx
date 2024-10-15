"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import useForm from "../hooks/useForm";
import { getChattingRooms, createChattingRoom } from "@/app/api/chattings";

import CustomButton from "../CustomButton";
import TextField from "../TextField";

interface ChattingRooms {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  roomStatus: "active" | "inactive";
}

export default function Chattings() {
  const [chattingList, setChattingList] = useState<ChattingRooms[]>();
  const { values, getTextFieldInputProps } = useForm({
    initialState: { name: "" },
  });

  const fetchChattingRooms = async () => {
    try {
      const response = await getChattingRooms<ChattingRooms[]>();
      setChattingList(response.result);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message);
      }
    }
  };

  const handleCreateRoom = async () => {
    if (!values.name.trim()) {
      alert("채팅방 이름을 입력해주세요.");
      return;
    }

    try {
      await createChattingRoom(values);
      fetchChattingRooms();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    fetchChattingRooms();
  }, []);

  return (
    <section className="relative p-4 w-full h-screen">
      <div className="flex justify-between items-center">
        <h1 className="px-4 py-2 text-2xl text-slate-800 font-bold">채팅</h1>
        <CustomButton type="button" onClick={handleCreateRoom}>
          + 채팅방 만들기
        </CustomButton>
      </div>
      <div>
        {chattingList?.map((chat) => (
          <div
            key={chat.id}
            className="p-4 flex justify-between hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-3xl bg-slate-400"></div>
              <div>
                <h2 className="text-slate-700 text-base font-medium">
                  {chat.name}
                </h2>
              </div>
            </div>
            <div>개설일 {chat.createdAt}</div>
          </div>
        ))}
      </div>
      <div>
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
        </div>
      </div>
    </section>
  );
}
