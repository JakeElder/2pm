import { PlotPointDto } from "@2pm/schemas/dto";
import { getPlotPointsByEnvironmentId } from "@/api/environments";
import { Narrative } from "@2pm/ui";
import PlotPointContainer from "./PlotPointContainer";

interface Props {
  environmentId: number;
}

interface ItemProps extends PlotPointDto {}

/*
 * Item
 */

export const Item = ({ id, userId, type, ...rest }: ItemProps) => {
  const perspective = userId === 3 ? "FIRST_PERSON" : "THIRD_PERSON";
  const props: PlotPointDto = { id, userId, type, ...rest };
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
