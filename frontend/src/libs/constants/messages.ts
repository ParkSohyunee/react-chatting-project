import { AUTH_CODE } from "./errorCode";

const AUTH_ERROR_MESSAGE: Record<keyof typeof AUTH_CODE, string> = {
  [AUTH_CODE.CHECK_NICKNAME]: "닉네임을 확인해주세요.",
  [AUTH_CODE.CHECK_PASSWORD]: "비밀번호를 확인해주세요.",
  [AUTH_CODE.ERROR_LOGIN]: "로그인을 다시 시도해주세요.",
  [AUTH_CODE.ERROR_SIGNUP]: "회원가입을 다시 시도해주세요.",
};

export { AUTH_ERROR_MESSAGE };
