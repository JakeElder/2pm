"use client";

import MessageViewContainer from "./PlotPointContainers/MessageViewContainer";
import { HydratedPlotPoint } from "@2pm/schemas/comps";

type Props = HydratedPlotPoint;

const PlotPointViewContainer = (plotPoint: Props) => {
  const { type } = plotPoint;

  if (type === "HUMAN_MESSAGE" || type === "AI_MESSAGE") {
    return <MessageViewContainer {...plotPoint} />;
  }

  return null;
};

export default PlotPointViewContainer;
