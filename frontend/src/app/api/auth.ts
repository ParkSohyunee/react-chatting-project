import { FormData } from "../components/SignupPage";

async function createUser(user: FormData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );
  return response;
}

async function loginUser(user: FormData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );
  return response;
}

export { createUser, loginUser };
