import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { Environment } from "@2pm/core";
import { StandardLayout } from "@2pm/ui/layouts";
import MessagePlotPointViewContainer from "../client/MessagePlotPointViewContainer";

type Props = {
  environmentId: Environment["id"];
};

const ConversationNarrativeContainer = async ({ environmentId }: Props) => {
  const plotPoints = await getPlotPointsByEnvironmentId(environmentId, {
    types: ["AI_USER_MESSAGE", "HUMAN_USER_MESSAGE"],
  });

  return (
    <StandardLayout.ConversationNarrative>
      {plotPoints.data.map((plotPoint) => (
        <MessagePlotPointViewContainer
          key={plotPoint.data.plotPoint.id}
          {...plotPoint}
        />
      ))}
    </StandardLayout.ConversationNarrative>
  );
};

export default ConversationNarrativeContainer;
