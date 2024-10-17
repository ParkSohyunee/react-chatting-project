"use client";

import useForm from "@/components/hooks/useForm";
import TextField from "@/components/TextField";
import { useEffect, useRef, useState } from "react";

export default function ChattingRoomPage() {
  const [messages, setMessages] = useState<string[]>([]);
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
      ws?.current.send(values.message);
    }
  };

  useEffect(() => {
    // Create WebSocket connection
    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

    // Connection opened
    ws.current.onopen = () => {
      ws.current?.send("Connected to WS Server!");
    };

    ws.current.onerror = (error) => {
      console.log(error);
    };

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
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
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </section>
  );
}
