"use server";

import { createHumanMessagePlotPoint } from "@/api/plot-points";
import { CreateHumanMessagePlotPointDto } from "@2pm/api/client";

export const submitMessage = async (dto: CreateHumanMessagePlotPointDto) => {
  const res = await createHumanMessagePlotPoint(dto);
  return res.data;
};
