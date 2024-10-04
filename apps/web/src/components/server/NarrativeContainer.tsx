"use server";

import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { hydratePlotPoint } from "@/actions";
import NarrativeViewContainer from "../client/NarrativeViewContainer";

type Props = {
  environmentId: number;
};

const NarrativeContainer = async ({ environmentId }: Props) => {
  const { data } = await getPlotPointsByEnvironmentId(environmentId);
  const hydrated = await Promise.all(data.map(hydratePlotPoint));

  return (
    <NarrativeViewContainer
      environmentId={environmentId}
      plotPoints={hydrated}
    />
  );
};

export default NarrativeContainer;
