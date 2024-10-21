"use client";

import { useEffect, useRef, useState } from "react";

import useForm from "@/components/hooks/useForm";
import TextField from "@/components/TextField";
import CustomButton from "@/components/CustomButton";

type RoleType = "sender" | "receiver" | "system";

interface ChatType {
  type: RoleType;
  message: string;
}

export default function ChattingRoomPage() {
  const [messages, setMessages] = useState<ChatType[]>([]);
  const ws = useRef<null | WebSocket>(null);
  const isMounted = useRef(true);
  const { values, getTextFieldInputProps } = useForm({
    initialState: {
      message: "",
    },
  });

  const chatStyleVariant = {
    system: {
      align: "text-center",
      color: "bg-slate-200",
    },
    sender: {
      align: "text-right",
      color: "bg-amber-300",
    },
    receiver: {
      align: "text-left",
      color: "bg-white",
    },
  };

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
      if (isMounted.current) {
        alert("로그인이 필요합니다.");
      }
    };

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, JSON.parse(event.data)]);
    };

    return () => {
      if (ws.current) {
        console.log("websocket 연결 종료");
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
          <li className={`${chatStyleVariant[data.type].align}`} key={index}>
            <span
              className={`
                text-sm text-slate-800 px-3 py-2 rounded-2xl 
                ${chatStyleVariant[data.type].color}
                `}
            >
              {data.message}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex sticky bottom-0 w-full bg-white justify-between items-center p-6 gap-2">
        <div className="grow">
          <TextField
            label=""
            field="message"
            {...getTextFieldInputProps("message")}
            placeholder="메세지를 입력해주세요.."
          />
        </div>
        <div className="mt-4 text-end">
          <CustomButton onClick={sendMessage}>보내기</CustomButton>
        </div>
      </div>
    </section>
  );
}