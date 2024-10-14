"use server";

import { createAuthenticatedUserMessagePlotPoint } from "@/api/plot-points";
import { CreateAuthenticatedUserMessagePlotPointDto } from "@2pm/api/client";
import { cookies } from "next/headers";
import * as api from "@/api/sessions";

export const submitMessage = async (
  dto: CreateAuthenticatedUserMessagePlotPointDto,
) => {
  const res = await createAuthenticatedUserMessagePlotPoint(dto);
  return res.data;
};

export async function getSession() {
  const store = cookies();

  const sid = store.get("sid");

  if (sid) {
    const session = await api.getSession(sid.value);
    return session;
  }

  // cookies().set("sid", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  //   path: "/",
  // });
}
