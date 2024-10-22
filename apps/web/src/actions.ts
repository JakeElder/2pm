"use server";

import { createAuthenticatedUserMessagePlotPoint } from "@/api/plot-points";
import { CreateAuthenticatedUserMessagePlotPointDto } from "@2pm/api/client";
import { cookies } from "next/headers";
import api from "@/api";

export const submitMessage = async (
  dto: CreateAuthenticatedUserMessagePlotPointDto,
) => {
  const res = await createAuthenticatedUserMessagePlotPoint(dto);
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

  cookies().set("sid", sessionRes.data.session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return sessionRes;
};

export async function getSession() {
  const store = cookies();
  const sid = store.get("sid");

  if (sid) {
    const { data } = await api.sessions.getSessions({
      ids: [sid.value],
    });

    if (!data[0]) {
      throw new Error();
    }
  }

  throw new Error();
}
