"use server";

import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { EnvironmentDto, PlotPointDtoSchema } from "@2pm/core";
import { getSession } from "@/actions";
import NarrativeViewContainer from "../client/NarrativeViewContainer";
import { SessionProvider } from "../client/SessionProvider";

type Props = {
  environment: EnvironmentDto;
};

const NarrativeContainer = async ({ environment }: Props) => {
  const [{ data: plotPoints }, session] = await Promise.all([
    getPlotPointsByEnvironmentId(environment.data.environment.id),
    getSession(),
  ]);

  return (
    <SessionProvider session={session}>
      <NarrativeViewContainer
        environment={environment}
        plotPoints={plotPoints.map((p) => PlotPointDtoSchema.parse(p))}
      />
    </SessionProvider>
  );
};

export default NarrativeContainer;
