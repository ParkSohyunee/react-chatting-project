import { ChatType } from "../page";

interface MessageProps {
  data: ChatType;
}

export default function Message({ data }: MessageProps) {
  const chatStyleVariant = {
    system: {
      align: "text-center",
      color: "bg-slate-200",
    },
    sender: {
      align: "text-right",
      color: "bg-amber-300",
    },
    receiver: {
      align: "text-left",
      color: "bg-white",
    },
  };

  return (
    <li className={`${chatStyleVariant[data.type].align}`}>
      <span
        className={`
          text-sm text-slate-800 px-3 py-2 rounded-2xl 
          ${chatStyleVariant[data.type].color}
          `}
      >
        {data.message}
      </span>
    </li>
  );
}
