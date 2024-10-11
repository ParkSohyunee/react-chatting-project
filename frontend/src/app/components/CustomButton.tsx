interface CustomButtonProps {
  text: string;
  type?: "submit" | "button";
}

// TODO size, inValid 상태에 따른 스타일 적용
export default function CustomButton({
  text,
  type = "button",
}: CustomButtonProps) {
  return (
    <button
      type={type}
      className="p-1 mt-4 rounded-md bg-amber-100 outline-none"
    >
      {text}
    </button>
  );
}
