import { axiosInstance } from "./axios";

type ResponseChatting = {
  chattingRoom: {
    id: number;
    name: string;
    createdBy: {
      userId: number;
    };
  };
};

async function createChattingRoom(value: { name: string }) {
  const response = await axiosInstance.post<ResponseChatting>(
    "/chattings",
    value
  );
  return response;
}

export { createChattingRoom };
