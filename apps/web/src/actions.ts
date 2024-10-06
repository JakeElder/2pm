"use server";

import api from "@/api";
import { CreateHumanMessageDto } from "@2pm/api/client";
import { HydratedPlotPoint } from "@2pm/data/comps";
import { PlotPointDto } from "@2pm/data/dtos";
import {
  getAiMessageByPlotPointId,
  getHumanMessageByPlotPointId,
} from "./api/plot-points";

export const submitMessage = async (dto: CreateHumanMessageDto) => {
  const res = await api.humanMessage.createHumanMessage(dto);
  return res.data;
};

export const hydratePlotPoint = async (
  plotPoint: PlotPointDto,
): Promise<HydratedPlotPoint> => {
  if (plotPoint.type === "HUMAN_MESSAGE") {
    const { data } = await getHumanMessageByPlotPointId(plotPoint.id);
    return { ...plotPoint, type: "HUMAN_MESSAGE", data };
  }

  if (plotPoint.type === "AI_MESSAGE") {
    const { data } = await getAiMessageByPlotPointId(plotPoint.id);
    return { ...plotPoint, type: "AI_MESSAGE", data };
  }

  if (plotPoint.type === "ENVIRONMENT_ENTERED") {
    return { ...plotPoint, type: "ENVIRONMENT_ENTERED", data: {} };
  }

  if (plotPoint.type === "ENVIRONMENT_LEFT") {
    return { ...plotPoint, type: "ENVIRONMENT_LEFT", data: {} };
  }

  throw new Error();
};
