import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { Environment, PlotPointDtoSchema, PlotPointType } from "@2pm/core";
import NarrativeViewContainer from "@/components/client/NarrativeViewContainer";

type Props = {
  environmentId: Environment["id"];
  types: PlotPointType[];
};

const NarrativeContainer = async ({ environmentId, types }: Props) => {
  const res = await getPlotPointsByEnvironmentId(environmentId, {
    types,
  });

  const plotPoints = res.data.map((pp) => PlotPointDtoSchema.parse(pp));

  return (
    <NarrativeViewContainer
      environmentId={environmentId}
      plotPoints={plotPoints}
    />
  );
};

export default NarrativeContainer;
