"use client";

import { useState, useCallback } from "react";
import { EnvironmentUserList, UserTag } from "@2pm/ui/components";
import { Environment, SessionDto, EnvironmentUserListDto } from "@2pm/core";
import { useEnvironmentUserListEvents } from "@/hooks";
import UserTagViewContainer from "./UserTagViewContainer";

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

  useEnvironmentUserListEvents({
    environmentId,
    humanUserId: session.user.data.id,
    onUpdated: useCallback((e) => setList(e), []),
  });

  return (
    <EnvironmentUserList.Root>
      {list.users.map((user) => (
        <EnvironmentUserList.User key={user.data.id}>
          <UserTagViewContainer {...user} />
        </EnvironmentUserList.User>
      ))}
    </EnvironmentUserList.Root>
  );
};

export default EnvironmentUserListViewContainer;
