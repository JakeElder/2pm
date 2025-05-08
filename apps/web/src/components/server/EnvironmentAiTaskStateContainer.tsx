import { ActiveEnvironmentAiTaskDtoSchema, Environment } from "@2pm/core";
import EnvironmentAiTaskStateViewContainer from "../client/EnvironmentAiTaskStateViewContainer";
import { getSession } from "@/actions";
import { getEnvironmentAiTask } from "@/api/environments";

type Props = {
  environmentId: Environment["id"];
};

const EnvironmentAiTaskStateContainer = async ({ environmentId }: Props) => {
  const session = await getSession();
  const aiTask = await getEnvironmentAiTask(environmentId);

  return (
    <EnvironmentAiTaskStateViewContainer
      session={session}
      environmentId={environmentId}
      aiTask={
        aiTask.data ? ActiveEnvironmentAiTaskDtoSchema.parse(aiTask.data) : null
      }
    />
  );
};

export default EnvironmentAiTaskStateContainer;
