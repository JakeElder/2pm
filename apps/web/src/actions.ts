"use server";

import { createHumanMessage } from "@/api/human-message";
import { CreateHumanMessageDto } from "@2pm/api/client";

export const submitMessage = async (dto: CreateHumanMessageDto) => {
  const res = await createHumanMessage(dto);
  return res.data;
};
