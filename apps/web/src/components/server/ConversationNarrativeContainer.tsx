import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { EnvironmentDto } from "@2pm/core";
import { StandardLayout } from "@2pm/ui/layouts";

type Props = {
  environmentId: EnvironmentDto["data"]["environment"]["id"];
};

const ConversationNarrativeContainer = async ({ environmentId }: Props) => {
  const plotPoints = await getPlotPointsByEnvironmentId(environmentId, {
    types: ["AI_USER_MESSAGE", "HUMAN_USER_MESSAGE"],
  });

  return (
    <StandardLayout.ConversationNarrative>
      <pre>{JSON.stringify(plotPoints, null, 2)}</pre>
    </StandardLayout.ConversationNarrative>
  );
};

export default ConversationNarrativeContainer;
