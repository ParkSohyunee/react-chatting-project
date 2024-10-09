import { FormData } from "../components/SignupPage";

export async function createUser(user: FormData) {
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
  return response.json();
}
