import { humanUsersSocket } from "@/socket";
import { HumanUser, HumanUserTagUpdatedEventDto } from "@2pm/core";
import { useEffect } from "react";

type Props = {
  humanUserId: HumanUser["id"];
  onUpdated: (e: HumanUserTagUpdatedEventDto) => void;
};

export const useHumanUserEvents = ({ humanUserId, onUpdated }: Props) => {
  useEffect(() => {
    const join = () => {
      humanUsersSocket.emit("join", { humanUserId });
    };

    humanUsersSocket.on("connect", join).on("updated", onUpdated);

    if (humanUsersSocket.connected) {
      join();
    }

    return () => {
      humanUsersSocket.off("updated", onUpdated);
      humanUsersSocket.off("connect", join);
      humanUsersSocket.emit("leave", { humanUserId });
    };
  }, [humanUserId, onUpdated]);
};
