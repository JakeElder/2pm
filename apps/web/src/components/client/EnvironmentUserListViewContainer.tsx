"use client";

import { useEffect, useState } from "react";
import { EnvironmentUserList } from "@2pm/ui/components";
import { environmentUserListsSocket } from "@/socket";
import {
  Environment,
  SessionDto,
  EnvironmentUserListDto,
  EnvironmentUserListsRoomJoinedEventDto,
} from "@2pm/core";

type Props = {
  environmentUserList: EnvironmentUserListDto;
  session: SessionDto;
  environmentId: Environment["id"];
};

const EnvironmentUserListViewContainer = ({
  session,
  environmentId,
  ...rest
}: Props) => {
  const [list, setList] = useState(rest.environmentUserList);

  useEffect(() => {
    const e: EnvironmentUserListsRoomJoinedEventDto = {
      environmentId: environmentId,
      humanUserId: session.user.data.id,
    };

    environmentUserListsSocket.emit("join", e).on("updated", (dto) => {
      setList(dto);
    });

    return () => {
      environmentUserListsSocket.removeAllListeners();
      environmentUserListsSocket.emit("leave", e);
    };
  }, []);

  return (
    <EnvironmentUserList.Root>
      {list.users.map((user) => (
        <EnvironmentUserList.User
          key={user.data.id}
          {...user}
          showHash={user.type === "ANONYMOUS"}
        />
      ))}
    </EnvironmentUserList.Root>
  );
};

export default EnvironmentUserListViewContainer;
