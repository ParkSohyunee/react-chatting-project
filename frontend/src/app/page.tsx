"use client";

import { useState } from "react";

const id = 2;
const name = "sohyun";
const age = 14;
const password = "aaa";

interface User {
  id: number;
  name: string;
  age: number;
  password: string;
}

export default function Home() {
  const [user, setUser] = useState<User>({
    id,
    name,
    age,
    password,
  });

  async function createUser(user: User) {
    const response = await fetch("http://localhost:3001/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return response.json();
  }

  const handleClickPostAPI = async () => {
    const data = await createUser(user);
    console.log("data:", data);
  };

  const handleClickFetchAPI = async () => {
    return await fetch("http://localhost:3001/api")
      .then((res) => res.json())
      .then((res) => res.data);
  };

  console.log(setUser);

  return (
    <>
      <div>
        <button onClick={handleClickFetchAPI}>Get 요청 테스트</button>
      </div>
      <div>
        <button onClick={handleClickPostAPI}>Post 요청 테스트</button>
      </div>
    </>
  );
}
