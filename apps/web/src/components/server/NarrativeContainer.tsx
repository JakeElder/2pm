"use server";

import { getHydratedPlotPointsByEnvironmentId } from "@/api/environments";
import NarrativeViewContainer from "../client/NarrativeViewContainer";

type Props = {
  environmentId: number;
};

const NarrativeContainer = async ({ environmentId }: Props) => {
  const { data } = await getHydratedPlotPointsByEnvironmentId(environmentId);
  return (
    <NarrativeViewContainer environmentId={environmentId} plotPoints={data} />
  );
};

export default NarrativeContainer;
