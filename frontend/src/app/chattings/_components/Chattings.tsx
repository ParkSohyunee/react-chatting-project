"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import {
  createChattingRoom,
  deleteChattingRoom,
  getChattingRooms,
  updateChattingRoom,
} from "@/app/api/chattings";

import CustomButton from "@/components/CustomButton";
import TopSheet from "@/components/TopSheet";
import useForm from "@/components/hooks/useForm";
import TextField from "@/components/TextField";
import ChattingRow from "./ChattingRow";
import useToggle from "@/components/hooks/useToggle";

export interface ChattingRoom {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  roomStatus: "active" | "inactive";
}

export default function Chattings() {
  const [chattingList, setChattingList] = useState<ChattingRoom[]>();
  const { value: isOpen, handleActive, handleInActive } = useToggle();
  const {
    value: isEdit,
    handleActive: handleOnEdit,
    handleInActive: handleOffEdit,
  } = useToggle();
  const [selected, setSelected] = useState<unknown>();
  const { values, getTextFieldInputProps } = useForm({
    initialState: { name: "" },
  });

  // 채팅방 조회
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

  // 채팅방 만들기
  const handleCreateRoom = async () => {
    if (!values.name.trim()) {
      alert("채팅방 이름을 입력해주세요.");
      return;
    }

    try {
      await createChattingRoom(values);
      fetchChattingRooms();
      handleInActive();
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    }
  };

  // 채팅방 수정하기
  const handleUpdateRoom = (roomId: unknown) => async () => {
    if (!values.name.trim()) {
      alert("채팅방 이름을 입력해주세요.");
      return;
    }

    try {
      await updateChattingRoom(roomId as number, values);
      handleOffEdit();
      handleInActive();
      fetchChattingRooms();
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    }
  };

  // 채팅방 삭제하기
  const handleDeleteRoom = async (roomId: number) => {
    try {
      await deleteChattingRoom(roomId);
      fetchChattingRooms();
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    }
  };

  const handleOnClickEdit = (roomId: number) => {
    handleOnEdit();
    handleActive();
    setSelected(roomId);
  };

  useEffect(() => {
    fetchChattingRooms();
  }, []);

  return (
    <section className="relative p-4 w-full h-screen">
      <div className="flex justify-between items-center mb-3">
        <h1 className="px-4 py-2 text-2xl text-slate-800 font-bold">💬 채팅</h1>
        <CustomButton type="button" onClick={handleActive}>
          + 채팅방 만들기
        </CustomButton>
      </div>
      <div>
        {chattingList?.map((room) => (
          <ChattingRow
            key={room.id}
            room={room}
            onClickEdit={handleOnClickEdit}
            onClickDelete={handleDeleteRoom}
          />
        ))}
      </div>
      {isOpen && (
        <TopSheet
          onClose={() => {
            handleInActive();
            handleOffEdit();
          }}
        >
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
            <CustomButton
              type="button"
              onClick={isEdit ? handleUpdateRoom(selected) : handleCreateRoom}
            >
              {isEdit ? "수정하기" : "만들기"}
            </CustomButton>
          </div>
        </TopSheet>
      )}
    </section>
  );
}
