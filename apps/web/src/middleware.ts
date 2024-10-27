import api from "@/api";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { WORLD_ROOM_ENVIRONMENTS } from "@2pm/data/seed";

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

  const userRes = await api.users.createAnonymousUser({
    type: "ANONYMOUS",
  });

  if (!userRes.ok) {
    console.dir(userRes, { depth: null, colors: true });
    throw new Error();
  }

  const { data: sessionRes } = await api.sessions.createAnonymousSession({
    type: "ANONYMOUS",
    userId: userRes.data.data.user.id,
  });

  response.cookies.set({
    name: "sid",
    httpOnly: true,
    value: sessionRes.data.session.id,
    path: "/",
  });

  return response;
}
