import { ReactNode } from "react";

interface CustomButtonProps {
  children: ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
}

// TODO size, inValid 상태에 따른 스타일 적용
export default function CustomButton({
  children,
  type = "button",
  onClick,
}: CustomButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="p-1 mt-4 rounded-md bg-amber-100 outline-none"
    >
      {children}
    </button>
  );
}
