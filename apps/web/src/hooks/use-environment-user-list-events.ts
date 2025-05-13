import { environmentUserListsSocket } from "@/socket";
import {
  AiMessage,
  EnvironmentUserListUpdatedEventDto,
  HumanUser,
} from "@2pm/core";
import { useEffect } from "react";

type Props = {
  humanUserId: HumanUser["id"];
  environmentId: AiMessage["id"];
  onUpdated: (e: EnvironmentUserListUpdatedEventDto) => void;
};

export const useEnvironmentUserListEvents = ({
  humanUserId,
  environmentId,
  onUpdated,
}: Props) => {
  useEffect(() => {
    const join = () => {
      environmentUserListsSocket.emit("join", { humanUserId, environmentId });
    };

    environmentUserListsSocket.on("connect", join).on("updated", onUpdated);

    if (environmentUserListsSocket.connected) {
      join();
    }

    return () => {
      environmentUserListsSocket.off("updated", onUpdated);
      environmentUserListsSocket.off("connect", join);
      environmentUserListsSocket.emit("leave", { humanUserId, environmentId });
    };
  }, [humanUserId, environmentId, onUpdated]);
};
