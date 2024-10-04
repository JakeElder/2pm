"use client";

import { HydratedPlotPoint } from "@2pm/schemas/comps";
import { Narrative } from "@2pm/ui";
import PlotPointViewContainer from "./PlotPointViewContainer";

type Props = HydratedPlotPoint;

const NarrativePlotPointViewContainer = (plotPoint: Props) => {
  const { userId, type } = plotPoint;
  const perspective = userId === 3 ? "FIRST_PERSON" : "THIRD_PERSON";
  return (
    <Narrative.PlotPoint perspective={perspective} type={type}>
      <PlotPointViewContainer {...plotPoint} />
    </Narrative.PlotPoint>
  );
};

export default NarrativePlotPointViewContainer;
