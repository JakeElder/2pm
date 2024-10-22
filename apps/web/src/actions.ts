"use server";

import { CreateAuthenticatedUserMessagePlotPointDto } from "@2pm/api/client";
import { cookies } from "next/headers";
import api from "@/api";

export const submitMessage = async (
  dto: CreateAuthenticatedUserMessagePlotPointDto,
) => {
  const res = await api.plotPoints.createAuthenticatedUserMessagePlotPoint(dto);
  return res.data;
};

export const createAnonymousSession = async () => {
  const { data: userRes } = await api.users.createAnonymousUser({
    type: "ANONYMOUS",
    locationEnvironmentId: 1,
  });

  const { data: sessionRes } = await api.sessions.createAnonymousSession({
    type: "ANONYMOUS",
    userId: userRes.data.user.id,
  });

  const store = await cookies();
  store.set("sid", sessionRes.data.session.id, {
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
