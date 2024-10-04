"use server";

import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { Narrative } from "@2pm/ui";
import PlotPointListener from "@/components/client/PlotPointListener";
import NarrativePlotPointContainer from "./NarrativePlotPointContainer";

type Props = {
  environmentId: number;
};

const NarrativeContainer = async ({ environmentId }: Props) => {
  const { data } = await getPlotPointsByEnvironmentId(environmentId);

  return (
    <Narrative.Root>
      {data.map((props) => (
        <NarrativePlotPointContainer key={props.id} {...props} />
      ))}
      <PlotPointListener environmentId={environmentId} />
    </Narrative.Root>
  );
};

export default NarrativeContainer;
