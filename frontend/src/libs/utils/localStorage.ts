import { storageKeys } from "@/libs/constants/keys";

const setAccessToken = (token: string) => {
  localStorage.setItem(storageKeys.ACCESS_TOKEN, token);
};

const getAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? accessToken : null;
};

const removeAccessToken = () => {
  localStorage.removeItem(storageKeys.ACCESS_TOKEN);
};

export { setAccessToken, getAccessToken, removeAccessToken };
