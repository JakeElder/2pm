import api from "@/api";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const sid = request.cookies.get("sid");

  if (sid) {
    const { data } = await api.sessions.getSessions({
      ids: [sid.value],
    });

    if (data[0]) {
      return response;
    }
  }

  const userRes = await api.users.createHumanUser({
    type: "HUMAN",
  });

  if (!userRes.ok) {
    console.dir(userRes, { depth: null, colors: true });
    throw new Error();
  }

  const { data: sessionRes } = await api.sessions.createSession({
    userId: userRes.data.data.user.id,
  });

  response.cookies.set({
    name: "sid",
    httpOnly: true,
    value: sessionRes.session.id,
    path: "/",
  });

  return response;
}
