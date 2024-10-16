import { axiosInstance } from "./axios";

interface ResponseChatting<T> {
  result: T;
}

async function getChattingRooms<T>(): Promise<ResponseChatting<T>> {
  const response = await axiosInstance.get<ResponseChatting<T>>("/chattings");
  return response.data;
}

async function createChattingRoom<T>(value: { name: string }): Promise<ResponseChatting<T>> {
  const response = await axiosInstance.post<ResponseChatting<T>>("/chattings", value);
  return response.data;
}

async function updateChattingRoom<T>(
  roomId: number,
  value: {
    name: string;
  }
): Promise<ResponseChatting<T>> {
  const response = await axiosInstance.patch<ResponseChatting<T>>(`/chattings/${roomId}`, value);
  return response.data;
}

async function deleteChattingRoom<T>(roomId: number): Promise<ResponseChatting<T>> {
  const response = await axiosInstance.delete<ResponseChatting<T>>(`/chattings/${roomId}`);
  return response.data;
}

export { getChattingRooms, createChattingRoom, updateChattingRoom, deleteChattingRoom };
