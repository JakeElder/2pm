import { getWorldRoomEnvironments } from "@/api/world-room-environments";
import { Environment } from "@2pm/core";
import { SpaceList } from "@2pm/ui/components";
import Link from "next/link";

type Props = {
  activeEnvironmentId: Environment["id"];
};

const SpaceListContainer = async ({ activeEnvironmentId }: Props) => {
  const environments = await getWorldRoomEnvironments();

  return (
    <SpaceList.Root>
      {environments.data.map((e) => {
        return (
          <Link key={e.id} href={`/${e.slug}`}>
            <SpaceList.Channel
              active={e.environmentId === activeEnvironmentId}
              slug={e.slug}
              userCount={e.presentUsers}
            />
          </Link>
        );
      })}
    </SpaceList.Root>
  );
};

export default SpaceListContainer;
