import { redirect } from "next/navigation";
import { getSession } from "@/actions";
import { createUserEnvironmentPresence } from "@/api/user-environment-presences";
import ThemeProviderContainer from "@/components/server/ThemeProviderContainer";
import { getHumanUserRoomEnvironmentByPath } from "@/api/human-user-room-environments";
import StandardLayoutContainer from "@/components/server/StandardLayoutContainer";

type Params = Promise<{ tag: string; channel: string }>;
type Props = { params: Params };

export default async function Home({ params }: Props) {
  const environment = await getHumanUserRoomEnvironmentByPath(await params);

  if (!environment.ok) {
    return redirect("/");
  }

  const { id: environmentId } = environment.data;

  const session = await getSession();

  await createUserEnvironmentPresence({
    environmentId,
    userId: session.user.data.userId,
  });

  return (
    <ThemeProviderContainer environmentId={environmentId}>
      <StandardLayoutContainer
        environmentId={environmentId}
        referenceNarrativeProps={{ types: ["HUMAN_POST"] }}
        conversationNarrativeProps={{
          filter: [
            "HUMAN_POST",
            "ENVIRONMENT_LEFT",
            "ENVIRONMENT_ENTERED",
            "HUMAN_USER_CONFIG_UPDATED",
          ],
        }}
      />
    </ThemeProviderContainer>
  );
}
