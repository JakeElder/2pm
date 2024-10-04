"use server";

import { PlotPointDto } from "@2pm/schemas/dto";
import { Narrative } from "@2pm/ui";
import PlotPointContainer from "./PlotPointContainer";

type Props = PlotPointDto;

const NarrativePlotPointContainer = ({ id, userId, type, ...rest }: Props) => {
  const perspective = userId === 3 ? "FIRST_PERSON" : "THIRD_PERSON";
  const props: PlotPointDto = { id, userId, type, ...rest };
  return (
    <Narrative.PlotPoint perspective={perspective} type={type}>
      <PlotPointContainer {...props} />
    </Narrative.PlotPoint>
  );
};

export default NarrativePlotPointContainer;
