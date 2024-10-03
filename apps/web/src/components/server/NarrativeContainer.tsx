import api from "@/api";
import { Narrative } from "@2pm/ui";
import PlotPointContainer from "./PlotPointContainer";
import { Environment, PlotPointPerspective, User } from "@2pm/schemas";

interface Props {
  environment: Pick<Environment, "id">;
}

const getPerspective = (userId: User["id"]): PlotPointPerspective =>
  userId === 3 ? "FIRST_PERSON" : "THIRD_PERSON";

const NarrativeContainer = async ({ environment }: Props) => {
  const res = await api.environments.getPlotPointsByEnvironmentId(
    environment.id,
  );
  return (
    <Narrative.Root>
      {res.data.map((plotPoint) => {
        const perspective = getPerspective(plotPoint.userId);
        return (
          <Narrative.PlotPoint
            key={plotPoint.id}
            perspective={perspective}
            type={plotPoint.type}
          >
            <PlotPointContainer {...plotPoint} />
          </Narrative.PlotPoint>
        );
      })}
    </Narrative.Root>
  );
};

export default NarrativeContainer;
