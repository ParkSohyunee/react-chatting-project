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
      className="px-4 py-2 text-md text-slate-800 font-semibold rounded-md bg-amber-200 outline-none hover:bg-amber-100"
    >
      {children}
    </button>
  );
}
