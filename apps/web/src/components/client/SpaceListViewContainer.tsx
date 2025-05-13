"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { SpaceList } from "@2pm/ui/components";
import { Environment, SessionDto, SpaceListDto } from "@2pm/core";
import { useSpaceListEvents } from "@/hooks";

type Props = {
  spaceList: SpaceListDto;
  session: SessionDto;
  activeEnvironmentId: Environment["id"];
};

const SpaceListViewContainer = ({
  session,
  activeEnvironmentId,
  ...rest
}: Props) => {
  const [spaceList, setSpaceList] = useState(rest.spaceList);

  useSpaceListEvents({
    humanUserId: session.user.data.id,
    onUpdated: useCallback(async (dto) => setSpaceList(dto), []),
  });

  return (
    <SpaceList.Root>
      {spaceList.spaces.map((e) => {
        return (
          <Link key={e.id} href={`/${e.slug}`}>
            <SpaceList.Channel
              {...e}
              active={e.environmentId === activeEnvironmentId}
            />
          </Link>
        );
      })}
    </SpaceList.Root>
  );
};

export default SpaceListViewContainer;
