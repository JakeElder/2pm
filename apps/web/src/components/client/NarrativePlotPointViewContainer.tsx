"use client";

import { Narrative } from "@2pm/ui/components";
import PlotPointViewContainer from "./PlotPointViewContainer";
import { PlotPointDto, PlotPointPerspective } from "@2pm/core";
import { useSession } from "@/hooks/use-session";

type Props = PlotPointDto;

const getPerspective = (plotPoint: PlotPointDto): PlotPointPerspective => {
  const session = useSession();
  if (
    plotPoint.type === "HUMAN_USER_MESSAGE" ||
    plotPoint.type === "AI_USER_MESSAGE"
  ) {
    return plotPoint.data.user.id === session.user.id
      ? "FIRST_PERSON"
      : "THIRD_PERSON";
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
