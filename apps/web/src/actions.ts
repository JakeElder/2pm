"use server";

import api from "@/api";
import { CreateHumanMessageDto } from "@2pm/api/client";

export const submitMessage = async (dto: CreateHumanMessageDto) => {
  const res = await api.humanMessage.createHumanMessage(dto);
  return res.data;
};
