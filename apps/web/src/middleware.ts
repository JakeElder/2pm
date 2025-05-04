import api from "@/api";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const sid = request.cookies.get("sid");

  if (sid) {
    const { data } = await api.sessions.getSession(sid.value);

    if (data) {
      return response;
    }
  }

  const { ok, error, data: user } = await api.humanUsers.createHumanUser();

  if (!ok) {
    console.dir(error, { depth: null, colors: true });
    throw new Error();
  }

  const { data: session } = await api.sessions.createSession({
    humanUserId: user.data.id,
  });

  response.cookies.set({
    name: "sid",
    httpOnly: true,
    value: session.id,
    path: "/",
  });

  return response;
}
