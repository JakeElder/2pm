"use server";

import { cookies } from "next/headers";
import api from "@/api";
import { CreateHumanMessageDto } from "@2pm/core";
import { createHumanMessage } from "@/api/human-messages";

export const submitMessage = async ({
  content,
  environmentId,
}: Omit<CreateHumanMessageDto, "userId">) => {
  const session = await getSession();

  const data: CreateHumanMessageDto = {
    content,
    environmentId,
    userId: session.user.data.userId,
  };

  const res = await createHumanMessage(data);

  return res.data;
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
