import api from "@/api";
import { Narrative } from "@2pm/ui";
import PlotPointSwitch from "./PlotPointSwitch";
import { Environment } from "@2pm/schemas";

interface Props {
  environment: Pick<Environment, "id">;
}

const NarrativeContainer = async ({ environment }: Props) => {
  const res = await api.environments.getPlotPointsByEnvironmentId(
    environment.id,
  );
  const plotPoints = res.data.reverse();
  return (
    <Narrative.Root>
      {plotPoints.map((plotPoint) => (
        <PlotPointSwitch key={plotPoint.id} {...plotPoint} />
      ))}
    </Narrative.Root>
  );
};

export default NarrativeContainer;
