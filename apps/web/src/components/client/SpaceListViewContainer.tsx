"use client";

import { useEffect, useState } from "react";
import { spaceListsSocket } from "@/socket";
import Link from "next/link";
import { SpaceList } from "@2pm/ui/components";
import {
  Environment,
  SessionDto,
  SpaceListDto,
  SpaceListsRoomJoinedEventDto,
} from "@2pm/core";

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

  useEffect(() => {
    const e: SpaceListsRoomJoinedEventDto = {
      humanUserId: session.user.data.id,
    };

    spaceListsSocket.emit("join", e).on("updated", async (dto) => {
      setSpaceList(dto);
    });

    return () => {
      spaceListsSocket.removeAllListeners();
      spaceListsSocket.emit("leave", e);
    };
  }, []);

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
