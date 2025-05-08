"use client";

import { environmentsSocket } from "@/socket";
import {
  ActiveEnvironmentAiTaskDto,
  Environment,
  EnvironmentsRoomJoinedEventDto,
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
    const e: EnvironmentsRoomJoinedEventDto = {
      userId: session.user.data.userId,
      environmentId,
    };

    environmentsSocket
      .emit("join", e)
      .on("ai-tasks.updated", async (nextAiTask) => {
        setAiTask(nextAiTask);
      })
      .on("ai-tasks.completed", () => {
        setAiTask(null);
      });

    return () => {
      environmentsSocket.off("ai-tasks.updated");
      environmentsSocket.emit("leave", e);
    };
  }, []);
  return (
    <div style={{ display: "flex" }}>
      {aiTask === null ? (
        <InfoBarAiState.Idle />
      ) : (
        <InfoBarAiState.Active state={aiTask.state} tag={aiTask.aiUser.tag} />
      )}
    </div>
  );
};

export default EnvironmentAiTaskStateViewContainer;
