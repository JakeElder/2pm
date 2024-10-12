"use client";

import { Narrative } from "@2pm/ui";
import PlotPointViewContainer from "./PlotPointViewContainer";
import { HydratedPlotPointDto, PlotPointPerspective } from "@2pm/data";

type Props = HydratedPlotPointDto;

const getPerspective = (
  plotPoint: HydratedPlotPointDto,
): PlotPointPerspective => {
  if (plotPoint.type === "HUMAN_MESSAGE" || plotPoint.type === "AI_MESSAGE") {
    return plotPoint.data.user.id === 3 ? "FIRST_PERSON" : "THIRD_PERSON";
  }
  return "NEUTRAL";
};

const NarrativePlotPointViewContainer = (plotPoint: Props) => {
  const perspective = getPerspective(plotPoint);
  const { type } = plotPoint;
  return (
    <Narrative.PlotPoint perspective={perspective} type={type}>
      <PlotPointViewContainer {...plotPoint} />
    </Narrative.PlotPoint>
  );
};

export default NarrativePlotPointViewContainer;
