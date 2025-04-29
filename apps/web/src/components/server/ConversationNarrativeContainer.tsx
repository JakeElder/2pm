import { Environment } from "@2pm/core";
import { StandardLayout } from "@2pm/ui/layouts";
import NarrativeContainer from "./NarrativeContainer";

type Props = {
  environmentId: Environment["id"];
};

const ConversationNarrativeContainer = async ({ environmentId }: Props) => {
  return (
    <StandardLayout.ConversationNarrative>
      <NarrativeContainer
        types={["AI_MESSAGE", "HUMAN_MESSAGE"]}
        environmentId={environmentId}
      />
    </StandardLayout.ConversationNarrative>
  );
};

export default ConversationNarrativeContainer;
