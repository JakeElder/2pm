"use server";

import { cookies } from "next/headers";
import api from "@/api";
import { CreateHumanUserMessagePlotPointDto } from "@2pm/core";

export const submitMessage = async (
  dto: CreateHumanUserMessagePlotPointDto,
) => {
  if (dto.type === "HUMAN_USER_MESSAGE") {
    const res = await api.plotPoints.createHumanUserMessagePlotPoint(dto);
    return res.data;
  }

  throw new Error();
};

export const createHumanSession = async () => {
  const { data: userRes } = await api.users.createHumanUser({
    type: "HUMAN",
  });

  const { data: sessionRes } = await api.sessions.createSession({
    userId: userRes.data.user.id,
  });

  const store = await cookies();
  store.set("sid", sessionRes.session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return sessionRes;
};

export async function getSession() {
  const store = await cookies();
  const sid = store.get("sid");

  if (sid) {
    const { data } = await api.sessions.getSessions({
      ids: [sid.value],
    });

    if (!data[0]) {
      throw new Error();
    }

    return data[0];
  }

  throw new Error();
}

export async function getCompanionOneToOneEnvironmentsByUserId(id: number) {
  const res = await api.users.getCompanionOneToOneEnvironmentsByUserId(id);

  if (!res.ok) {
    const res = await api.environments.createCompanionOneToOneEnvironment({
      type: "COMPANION_ONE_TO_ONE",
      userId: id,
    });

    if (res.ok) {
      return res.data;
    }
  }

  return res.data;
}
