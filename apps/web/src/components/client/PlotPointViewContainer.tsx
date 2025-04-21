//@ts-nocheck
"use client";

import { PlotPointDto } from "@2pm/core";
import MessageViewContainer from "./PlotPointContainers/MessageViewContainer";

type Props = PlotPointDto;

const PlotPointViewContainer = (plotPoint: Props) => {
  const { type } = plotPoint;

  if (type === "HUMAN_USER_MESSAGE" || type === "AI_USER_MESSAGE") {
    return <MessageViewContainer {...plotPoint} />;
  }

  return null;
};

export default PlotPointViewContainer;
