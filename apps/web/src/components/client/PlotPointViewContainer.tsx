"use client";

import { HydratedPlotPointDto } from "@2pm/data";
import MessageViewContainer from "./PlotPointContainers/MessageViewContainer";

type Props = HydratedPlotPointDto;

const PlotPointViewContainer = (plotPoint: Props) => {
  const { type } = plotPoint;

  if (type === "HUMAN_MESSAGE" || type === "AI_MESSAGE") {
    return <MessageViewContainer {...plotPoint} />;
  }

  return null;
};

export default PlotPointViewContainer;
