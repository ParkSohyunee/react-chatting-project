import axios from "axios";

type FormData = {
  name: string;
  password: string;
};

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api`,
});

type ResponseUser = {
  userId: number;
  accessToken: string;
  message: string;
};

async function createUser(user: FormData) {
  const response = await axiosInstance.post<Omit<ResponseUser, "accessToken">>(
    "/signup",
    user
  );
  return response;
}

async function loginUser(user: FormData) {
  const response = await axiosInstance.post<ResponseUser>("/login", user);
  return response;
}

export { createUser, loginUser };
