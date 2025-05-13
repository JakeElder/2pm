import { spaceListsSocket } from "@/socket";
import { HumanUser, SpaceListUpdatedEventDto } from "@2pm/core";
import { useEffect } from "react";

type Props = {
  humanUserId: HumanUser["id"];
  onUpdated: (e: SpaceListUpdatedEventDto) => void;
};

export const useSpaceListEvents = ({ humanUserId, onUpdated }: Props) => {
  useEffect(() => {
    const join = () => {
      spaceListsSocket.emit("join", { humanUserId });
    };

    spaceListsSocket.on("connect", join).on("updated", onUpdated);

    if (spaceListsSocket.connected) {
      join();
    }

    return () => {
      spaceListsSocket.off("updated", onUpdated);
      spaceListsSocket.off("connect", join);
      spaceListsSocket.emit("leave", { humanUserId });
    };
  }, [humanUserId, onUpdated]);
};
