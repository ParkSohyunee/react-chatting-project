"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import useForm from "@/components/hooks/useForm";
import TextField from "@/components/TextField";
import CustomButton from "@/components/CustomButton";
import Message from "./_components/Message";

import { getAccessToken } from "@/libs/utils/localStorage";

type RoleType = "sender" | "receiver" | "system";

export interface ChatType {
  type: RoleType;
  message: string;
}

export default function ChattingRoomPage() {
  const [messages, setMessages] = useState<ChatType[]>([]);
  const ws = useRef<null | WebSocket>(null);
  const isMounted = useRef(true);
  const { values, setValues, getTextFieldInputProps } = useForm({
    initialState: {
      message: "",
    },
  });

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();

    // Broadcast the message to all connected clients
    // readyState - current state of the WebSocket connection
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws?.current.send(
        JSON.stringify({
          type: "sender",
          message: values.message,
        })
      );
    }
    setMessages((prev) => [...prev, { type: "sender", message: values.message }]);
    setValues({ message: "" });
  };

  useEffect(() => {
    const accessToken = getAccessToken();

    // 웹소켓 연결 및 토큰 전달
    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?token=${accessToken}`);

    ws.current.onopen = () => {
      console.log("Connected to WS Server!");
      // TODO 채팅방 연결
    };

    // 토큰이 없거나 토큰이 유효하지 않은 경우 등
    ws.current.onerror = (error) => {
      console.log(error);
      if (isMounted.current) {
        alert("로그인이 필요합니다.");
      }
    };

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, JSON.parse(event.data)]);
    };

    return () => {
      if (ws.current) {
        isMounted.current = false;
        ws.current.close();
      }
    };
  }, []);

  return (
    <section className="bg-slate-100 h-screen flex flex-col">
      <h1 className="p-4 text-lg font-semibold sticky top-0 w-full bg-slate-100">
        채팅방 상세페이지
      </h1>
      <ul className="p-4 flex flex-col grow gap-4 overflow-y-auto box-border">
        {messages.map((data, index) => (
          <Message key={index} data={data} />
        ))}
      </ul>
      <form
        onSubmit={sendMessage}
        className="flex sticky bottom-0 w-full bg-white justify-between items-center p-6 gap-2"
      >
        <div className="grow">
          <TextField
            field="message"
            placeholder="메세지를 입력해주세요.."
            value={values.message}
            {...getTextFieldInputProps("message")}
          />
        </div>
        <div className="mt-4 text-end">
          <CustomButton type="submit">보내기</CustomButton>
        </div>
      </form>
    </section>
  );
}
