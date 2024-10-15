"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { createChattingRoom, getChattingRooms } from "@/app/api/chattings";
import convertFormatDatetime from "@/libs/utils/convertFormatDatetime";

import CustomButton from "../../../components/CustomButton";
import TopSheet from "../../../components/TopSheet";
import useForm from "../../../components/hooks/useForm";
import TextField from "../../../components/TextField";

interface ChattingRoom {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  roomStatus: "active" | "inactive";
}

interface ChattingRowProps {
  room: ChattingRoom;
}

function ChattingRow({ room }: ChattingRowProps) {
  const { id, name, createdAt } = room;

  return (
    <Link
      href={`/chattings/${id}`}
      className="p-4 flex justify-between items-end hover:bg-gray-100 cursor-pointer"
    >
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-3xl bg-slate-400"></div>
        <div>
          <h2 className="text-slate-700 text-base font-medium">{name}</h2>
        </div>
      </div>
      <div className="text-slate-400 text-sm">
        개설일 {convertFormatDatetime(createdAt)}
      </div>
    </Link>
  );
}

export default function Chattings() {
  const [chattingList, setChattingList] = useState<ChattingRoom[]>();
  const [isOpen, setIsOpen] = useState(false);
  const { values, getTextFieldInputProps } = useForm({
    initialState: { name: "" },
  });

  const fetchChattingRooms = async () => {
    try {
      const response = await getChattingRooms<ChattingRoom[]>();
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
      setIsOpen(false);
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
      <div className="flex justify-between items-center mb-3">
        <h1 className="px-4 py-2 text-2xl text-slate-800 font-bold">💬 채팅</h1>
        <CustomButton type="button" onClick={() => setIsOpen(true)}>
          + 채팅방 만들기
        </CustomButton>
      </div>
      <div>
        {chattingList?.map((room) => (
          <ChattingRow key={room.id} room={room} />
        ))}
      </div>
      <div></div>
      {isOpen && (
        <TopSheet onClose={() => setIsOpen(false)}>
          <div className="flex flex-col gap-4 h-full justify-evenly">
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
              만들기
            </CustomButton>
          </div>
        </TopSheet>
      )}
    </section>
  );
}
