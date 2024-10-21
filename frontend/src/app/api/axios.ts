import axios from "axios";
import { getAccessToken } from "@/libs/utils/localStorage";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };
