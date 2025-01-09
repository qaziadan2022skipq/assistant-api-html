import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2Icon } from "lucide-react";
export const UserAvatar = () => {
  return (
    <Avatar className="h-8 w-8">
      <User2Icon />
    </Avatar>
  );
};