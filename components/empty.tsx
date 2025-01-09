import { BotIcon } from "lucide-react";
import Image from "next/image";

interface EmptyProps {
  label: string;
}

export const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center mt-32">
      <div className="h-32 w-32 mb-4">
        <BotIcon className="h-32 w-32 mb-4 text-cyan-600" />
      </div>
      <p className="text-zinc-500 font-bold text-md text-center">{label}</p>
    </div>
  );
};