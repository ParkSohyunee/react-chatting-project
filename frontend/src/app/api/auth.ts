import { axiosInstance } from "./axios";

type FormData = {
  name: string;
  password: string;
};

type ResponseUser = {
  userId: number;
  accessToken: string;
  message: string;
};

async function createUser(user: FormData) {
  const response = await axiosInstance.post<Omit<ResponseUser, "accessToken">>(
    "/auth/signup",
    user
  );
  return response;
}

async function loginUser(user: FormData) {
  const response = await axiosInstance.post<ResponseUser>("/auth/login", user);
  return response;
}

export { createUser, loginUser };
