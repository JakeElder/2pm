import { humanUserConfigsSocket } from "@/socket";
import { HumanUser, HumanUserConfigUpdatedEventDto } from "@2pm/core";
import { useEffect } from "react";

type Props = {
  humanUserId: HumanUser["id"];
  onUpdated: (e: HumanUserConfigUpdatedEventDto) => void;
};

export const useHumanUserConfigEvents = ({ humanUserId, onUpdated }: Props) => {
  useEffect(() => {
    const join = () => {
      humanUserConfigsSocket.emit("join", { humanUserId });
    };

    humanUserConfigsSocket.on("connect", join).on("updated", onUpdated);

    if (humanUserConfigsSocket.connected) {
      join();
    }

    return () => {
      humanUserConfigsSocket.off("updated", onUpdated);
      humanUserConfigsSocket.off("connect", join);
      humanUserConfigsSocket.emit("leave", { humanUserId });
    };
  }, [humanUserId, onUpdated]);
};
