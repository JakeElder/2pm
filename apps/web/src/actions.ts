"use server";

import { cookies } from "next/headers";
import api from "@/api";
import { CreateHumanMessageDto } from "@2pm/core";

export const submitMessage = async ({
  content,
  environmentId,
}: Omit<CreateHumanMessageDto, "userId">) => {
  console.log(content);
  console.log(await getSession());
  // const res = await api.plotPoints.createHumanUserMessagePlotPoint(dto);
  // return res.data;
  // throw new Error();
};

// export const createHumanSession = async () => {
//   const { data: userRes } = await api.users.createHumanUser({
//     type: "HUMAN",
//   });
//
//   const { data: sessionRes } = await api.sessions.createSession({
//     userId: userRes.data.user.id,
//   });
//
//   const store = await cookies();
//   store.set("sid", sessionRes.session.id, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//   });
//
//   return sessionRes;
// };

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
