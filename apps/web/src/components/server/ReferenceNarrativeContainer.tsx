import { Environment } from "@2pm/core";
import { StandardLayout } from "@2pm/ui/layouts";
import NarrativeContainer from "./NarrativeContainer";

type Props = {
  environmentId: Environment["id"];
};

const ReferenceNarrativeContainer = async ({ environmentId }: Props) => {
  return (
    <StandardLayout.ReferenceNarrative>
      <NarrativeContainer
        filter={["AI_MESSAGE", "HUMAN_MESSAGE"]}
        environmentId={environmentId}
      />
    </StandardLayout.ReferenceNarrative>
  );
};

export default ReferenceNarrativeContainer;
