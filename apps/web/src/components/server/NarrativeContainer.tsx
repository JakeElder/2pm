import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { Environment, PlotPointDtoSchema, PlotPointType } from "@2pm/core";
import NarrativeViewContainer from "@/components/client/NarrativeViewContainer";
import { getSession } from "@/actions";

type Props = {
  environmentId: Environment["id"];
  types?: PlotPointType[];
  filter?: PlotPointType[];
};

const NarrativeContainer = async ({ environmentId, types, filter }: Props) => {
  const session = await getSession();
  const res = await getPlotPointsByEnvironmentId(environmentId, {
    types,
    filter,
  });

  const plotPoints = res.data.map((pp) => PlotPointDtoSchema.parse(pp));

  return (
    <NarrativeViewContainer
      environmentId={environmentId}
      plotPoints={plotPoints}
      session={session}
      types={types}
      filter={filter}
    />
  );
};

export default NarrativeContainer;
