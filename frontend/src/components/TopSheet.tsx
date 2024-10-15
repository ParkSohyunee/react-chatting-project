import { ReactNode } from "react";

interface TopSheetProps {
  children: ReactNode;
  onClose: () => void;
}

export default function TopSheet({ children, onClose }: TopSheetProps) {
  return (
    <div className="fixed top-0 left-0 h-40 w-full p-3 bg-white shadow-lg">
      <button
        onClick={onClose}
        className="text-sm h-10 p-2 absolute right-0 top-0"
      >
        닫기
      </button>
      {children}
    </div>
  );
}
