import Link from "next/link";
import { MouseEvent } from "react";

import { ChattingRoom } from "./Chattings";
import convertFormatDatetime from "@/libs/utils/convertFormatDatetime";

interface ChattingRowProps {
  room: ChattingRoom;
  onClickEdit: (roomId: number) => void;
  onClickDelete: (roomId: number) => void;
}

export default function ChattingRow({ room, onClickEdit, onClickDelete }: ChattingRowProps) {
  const { id, name, createdAt } = room;

  const handleClickEditButton = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClickEdit(id);
  };

  const handleClickDeleteButton = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClickDelete(id);
  };

  return (
    <Link
      href={`/chattings/${id}`}
      className="p-4 flex justify-between items-end hover:bg-gray-100 cursor-pointer"
    >
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-3xl bg-amber-100"></div>
        <div>
          <h2 className="text-slate-700 text-base font-medium">{name}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end text-slate-400 text-sm">
        <div className="flex justify-center items-center gap-1">
          <button
            onClick={handleClickEditButton}
            className="px-2 py-1 bg-white border-slate-300 rounded-lg border"
          >
            수정
          </button>
          <button
            onClick={handleClickDeleteButton}
            className="px-2 py-1 bg-white border-slate-300 rounded-lg border"
          >
            삭제
          </button>
        </div>
        🌱 {convertFormatDatetime(createdAt)}
      </div>
    </Link>
  );
}
