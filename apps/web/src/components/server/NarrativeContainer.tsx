"use server";

import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { EnvironmentDto } from "@2pm/data";
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
        plotPoints={plotPoints}
      />
    </SessionProvider>
  );
};

export default NarrativeContainer;
