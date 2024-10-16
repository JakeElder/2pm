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

const createAnonymousSession = async () => {
  // const user = api.users.createAnonymousUser({
  //   type: "ANONYMOUS",
  //   locationEnvironmentId: 1,
  // });
  // const session = api.sessions.create();
  // cookies().set("sid", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  //   path: "/",
  // });
};

export async function getSession() {
  const store = cookies();
  const sid = store.get("sid");

  if (sid) {
    const { data } = await api.sessions.getSessions({
      ids: [sid.value],
    });

    return data[0];
  }

  return null;
}
