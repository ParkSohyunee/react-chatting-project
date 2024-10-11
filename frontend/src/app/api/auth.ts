import axios from "axios";
import { FormData } from "../components/SignupPage";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api`,
});

async function createUser(user: FormData) {
  const response = await axiosInstance.post("/signup", user);
  return response;
}

async function loginUser(user: FormData) {
  const response = await axiosInstance.post("/login", user);
  return response;
}

export { createUser, loginUser };
