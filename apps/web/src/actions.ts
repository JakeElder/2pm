"use server";

import { cookies } from "next/headers";
import api from "@/api";
import {
  CreateHumanMessageDto,
  FilterAiUsersDto,
  ShiftDirectionHumanUserThemeDto,
} from "@2pm/core";
import { createHumanMessage } from "@/api/human-messages";

export const submitMessage = async ({
  json,
  text,
  environmentId,
}: Omit<CreateHumanMessageDto, "userId">) => {
  const session = await getSession();

  const data: CreateHumanMessageDto = {
    json,
    text,
    environmentId,
    userId: session.user.data.userId,
  };

  const res = await createHumanMessage(data);

  return res.data;
};

export const nextTheme = async ({
  id,
  environmentId,
}: ShiftDirectionHumanUserThemeDto) => {
  console.log(id, environmentId);
  await api.humanUserThemes.nextHumanUserTheme(id, { environmentId });
};

export const prevTheme = async ({
  id,
  environmentId,
}: ShiftDirectionHumanUserThemeDto) => {
  await api.humanUserThemes.prevHumanUserTheme(id, { environmentId });
};

export async function getSession() {
  const store = await cookies();
  const sid = store.get("sid");

  if (sid) {
    const { data } = await api.sessions.getSession(sid.value);

    if (!data) {
      throw new Error();
    }

    return data;
  }

  throw new Error();
}

export async function getAiUsers({ environmentId }: FilterAiUsersDto) {
  if (environmentId) {
    const users = await api.environments.getEnvironmentAiUsers(environmentId);
    return users.data;
  }
  const users = await api.aiUsers.getAiUsers();
  return users.data;
}
