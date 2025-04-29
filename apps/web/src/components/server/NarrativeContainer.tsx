import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { Environment, PlotPointDtoSchema, PlotPointType } from "@2pm/core";
import NarrativeViewContainer from "@/components/client/NarrativeViewContainer";
import { getSession } from "@/actions";

type Props = {
  environmentId: Environment["id"];
  types: PlotPointType[];
};

const NarrativeContainer = async ({ environmentId, types }: Props) => {
  const session = await getSession();
  const res = await getPlotPointsByEnvironmentId(environmentId, { types });
  const plotPoints = res.data.map((pp) => PlotPointDtoSchema.parse(pp));

  return (
    <NarrativeViewContainer
      environmentId={environmentId}
      plotPoints={plotPoints}
      session={session}
    />
  );
};

export default NarrativeContainer;
