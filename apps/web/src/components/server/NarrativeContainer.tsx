import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { Narrative } from "@2pm/ui";
import PlotPointContainer from "./PlotPointContainer";
import { Environment, PlotPoint } from "@2pm/schemas";

interface Props {
  environmentId: Environment["id"];
}

interface ItemProps extends PlotPoint {}

/*
 * Item
 */

export const Item = ({ id, userId, type, ...rest }: ItemProps) => {
  const perspective = userId === 3 ? "FIRST_PERSON" : "THIRD_PERSON";
  const props: PlotPoint = { id, userId, type, ...rest };
  return (
    <Narrative.PlotPoint perspective={perspective} type={type}>
      <PlotPointContainer {...props} />
    </Narrative.PlotPoint>
  );
};

/**
 * NarrativeContainer
 */

const NarrativeContainer = async ({ environmentId }: Props) => {
  const { data } = await getPlotPointsByEnvironmentId(environmentId);

  return (
    <Narrative.Root>
      {data.map((plotPoint) => (
        <Item key={plotPoint.id} {...plotPoint} />
      ))}
    </Narrative.Root>
  );
};

export default NarrativeContainer;
