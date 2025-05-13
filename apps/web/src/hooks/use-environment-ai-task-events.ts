import { environmentAiTasksSocket } from "@/socket";
import {
  EnviromentAiTaskCompletedEventDto,
  EnviromentAiTaskUpdatedEventDto,
  Environment,
  HumanUser,
} from "@2pm/core";
import { useEffect } from "react";

type Props = {
  environmentId: Environment["id"];
  humanUserId: HumanUser["id"];
  onUpdated: (e: EnviromentAiTaskUpdatedEventDto) => void;
  onCompleted: (e: EnviromentAiTaskCompletedEventDto) => void;
};

export const useEnvironmentAiTaskEvents = ({
  environmentId,
  humanUserId,
  onUpdated,
  onCompleted,
}: Props) => {
  useEffect(() => {
    const join = () => {
      environmentAiTasksSocket.emit("join", {
        environmentId,
        humanUserId,
      });
    };

    environmentAiTasksSocket
      .on("connect", join)
      .on("updated", onUpdated)
      .on("completed", onCompleted);

    if (environmentAiTasksSocket.connected) {
      join();
    }

    return () => {
      environmentAiTasksSocket.off("updated", onUpdated);
      environmentAiTasksSocket.off("completed", onCompleted);
      environmentAiTasksSocket.off("connect", join);
      environmentAiTasksSocket.emit("leave", {
        environmentId,
        humanUserId,
      });
    };
  }, [environmentId, humanUserId, onUpdated, onCompleted]);
};
