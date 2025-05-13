"use client";

import { useState, useCallback } from "react";
import { EnvironmentUserList } from "@2pm/ui/components";
import { Environment, SessionDto, EnvironmentUserListDto } from "@2pm/core";
import { useEnvironmentUserListEvents } from "@/hooks";

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
