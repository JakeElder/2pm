import api from "@/api";
import { Narrative } from "@2pm/ui";
import PlotPointSwitch from "./PlotPointSwitch";

interface Props {}

const NarrativeContainer = async ({}: Props) => {
  const res = await api.environments.getPlotPointsByEnvironment(10);
  const plotPoints = res.data;

  return (
    <Narrative.Root>
      {plotPoints.map((plotPoint) => (
        <PlotPointSwitch key={plotPoint.id} {...plotPoint} />
      ))}
    </Narrative.Root>
  );
};

export default NarrativeContainer;
