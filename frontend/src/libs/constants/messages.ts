export type LoginErrorType = "CHECK_NICKNAME" | "CHECK_PASSWORD" | "ERROR_LOGIN";
export type SignUpErrorType = "ERROR_SIGNUP";

const LOGIN_ERROR_MESSAGE: Record<LoginErrorType, string> = {
  CHECK_NICKNAME: "닉네임을 확인해주세요.",
  CHECK_PASSWORD: "비밀번호를 확인해주세요.",
  ERROR_LOGIN: "로그인을 다시 시도해주세요.",
};

const SIGNUP_ERROR_MESSAGE: Record<SignUpErrorType, string> = {
  ERROR_SIGNUP: "회원가입을 다시 시도해주세요.",
};

export { LOGIN_ERROR_MESSAGE, SIGNUP_ERROR_MESSAGE };
