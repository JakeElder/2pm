"use client";

import { useEnvironmentAiTaskEvents } from "@/hooks";
import { ActiveEnvironmentAiTaskDto, Environment, SessionDto } from "@2pm/core";
import { InfoBarAiState } from "@2pm/ui/components";
import { useState, useCallback } from "react";

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

  useEnvironmentAiTaskEvents({
    environmentId,
    humanUserId: session.user.data.id,
    onUpdated: useCallback((e) => setAiTask(e), []),
    onCompleted: useCallback(() => setAiTask(null), []),
  });

  return aiTask === null ? (
    <InfoBarAiState.Idle />
  ) : (
    <InfoBarAiState.Active state={aiTask.state} tag={aiTask.aiUser.tag} />
  );
};

export default EnvironmentAiTaskStateViewContainer;
