import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { Environment } from "@2pm/core";
import { StandardLayout } from "@2pm/ui/layouts";

type Props = {
  environmentId: Environment["id"];
};

const ConversationNarrativeContainer = async ({ environmentId }: Props) => {
  const plotPoints = await getPlotPointsByEnvironmentId(environmentId, {
    types: ["AI_USER_MESSAGE", "HUMAN_USER_MESSAGE"],
  });

  return (
    <StandardLayout.ConversationNarrative>
      {plotPoints.data.map((p) => {
        return JSON.stringify(p, null, 2);
      })}
    </StandardLayout.ConversationNarrative>
  );
};

export default ConversationNarrativeContainer;
