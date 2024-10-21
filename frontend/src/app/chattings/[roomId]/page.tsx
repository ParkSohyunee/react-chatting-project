"use client";

import { useEffect, useRef, useState } from "react";

import useForm from "@/components/hooks/useForm";
import TextField from "@/components/TextField";

interface ChatType {
  type: "sender" | "receiver" | "system";
  message: string;
}

export default function ChattingRoomPage() {
  const [messages, setMessages] = useState<ChatType[]>([]);
  const ws = useRef<null | WebSocket>(null);
  const { values, getTextFieldInputProps } = useForm({
    initialState: {
      message: "",
    },
  });

  const sendMessage = () => {
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
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    // 웹소켓 연결 및 토큰 전달
    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?token=${accessToken}`);

    // Connection opened
    ws.current.onopen = () => {
      console.log("Connected to WS Server!");
    };

    // 토큰이 없거나 토큰이 유효하지 않은 경우 등
    ws.current.onerror = (error) => {
      console.log(error);
      if (ws.current) {
        alert("로그인이 필요합니다.");
      }
    };

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, JSON.parse(event.data)]);
    };

    return () => {
      if (ws.current) {
        console.log("websocket 연결 종료");
        ws.current.close();
      }
    };
  }, []);

  return (
    <section>
      채팅방 상세페이지
      <TextField label="+" field="message" {...getTextFieldInputProps("message")} />
      <button onClick={sendMessage}>메세지 보내기</button>
      <ul id="chat">
        {messages.map((data, index) => (
          <li
            className={
              data.type === "system"
                ? "text-center"
                : data.type === "sender"
                ? "text-right"
                : "text-left"
            }
            key={index}
          >
            {data.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
