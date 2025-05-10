"use client";

import { environmentAiTasksSocket } from "@/socket";
import {
  ActiveEnvironmentAiTaskDto,
  Environment,
  EnvironmentAiTasksRoomJoinedEventDto,
  SessionDto,
} from "@2pm/core";
import { InfoBarAiState } from "@2pm/ui/components";
import { useEffect, useState } from "react";

type Props = {
  environmentId: Environment["id"];
  session: SessionDto;
  aiTask: ActiveEnvironmentAiTaskDto | null;
};

const EnvironmentAiTaskStateViewContainer = ({
  session,
  environmentId,
  ...rest
}: Props) => {
  const [aiTask, setAiTask] = useState(rest.aiTask);

  useEffect(() => {
    const e: EnvironmentAiTasksRoomJoinedEventDto = {
      humanUserId: session.user.data.id,
      environmentId,
    };

    environmentAiTasksSocket
      .emit("join", e)
      .on("updated", async (nextAiTask) => {
        setAiTask(nextAiTask);
      })
      .on("completed", () => {
        setAiTask(null);
      });

    return () => {
      environmentAiTasksSocket.removeAllListeners();
      environmentAiTasksSocket.emit("leave", e);
    };
  }, []);

  return aiTask === null ? (
    <InfoBarAiState.Idle />
  ) : (
    <InfoBarAiState.Active state={aiTask.state} tag={aiTask.aiUser.tag} />
  );
};

export default EnvironmentAiTaskStateViewContainer;
