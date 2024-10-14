import { axiosInstance } from "./axios";

interface ResponseChatting<T> {
  result: T;
}

async function createChattingRoom<T>(value: {
  name: string;
}): Promise<ResponseChatting<T>> {
  const response = await axiosInstance.post<ResponseChatting<T>>(
    "/chattings",
    value
  );
  return response.data;
}

export { createChattingRoom };
