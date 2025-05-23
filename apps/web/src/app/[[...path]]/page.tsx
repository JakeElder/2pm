import {
  getOneWorldRoomEnvironment,
  getWorldRoomEnvironments,
} from "@/api/world-room-environments";
import { WorldRoomEnvironmentDto } from "@2pm/core";
import { redirect } from "next/navigation";
import { getSession } from "@/actions";
import { createUserEnvironmentPresence } from "@/api/user-environment-presences";
import ThemeProviderContainer from "@/components/server/ThemeProviderContainer";
import StandardLayoutContainer from "@/components/server/StandardLayoutContainer";

type Params = Promise<{ path?: string[] }>;
type Props = { params: Params };

async function getDefaultEnvironment() {
  const res = await getOneWorldRoomEnvironment("UNIVERSE");
  return res.data;
}

async function getEnvironment(
  path: Awaited<Params>["path"],
): Promise<WorldRoomEnvironmentDto | null> {
  if (!path) {
    return getDefaultEnvironment();
  }

  if (path.length > 1) {
    return null;
  }

  const res = await getWorldRoomEnvironments({
    slug: path[0],
  });

  return res.data[0] || null;
}

export default async function Home({ params }: Props) {
  const { path } = await params;

  const environment = await getEnvironment(path);

  if (!environment) {
    return redirect("/");
  }

  const { environmentId } = environment;
  const session = await getSession();

  await createUserEnvironmentPresence({
    environmentId,
    userId: session.user.data.userId,
  });

  return (
    <ThemeProviderContainer environmentId={environmentId}>
      <StandardLayoutContainer
        environmentId={environmentId}
        conversationNarrativeProps={{ types: ["HUMAN_MESSAGE", "AI_MESSAGE"] }}
        referenceNarrativeProps={{
          filter: [
            "HUMAN_MESSAGE",
            "AI_MESSAGE",
            "HUMAN_USER_CONFIG_UPDATED",
            "HUMAN_USER_TAG_UPDATED",
          ],
        }}
      />
    </ThemeProviderContainer>
  );
}
