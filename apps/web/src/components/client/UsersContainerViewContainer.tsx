"use client";

import { updateHumanUserConfig } from "@/actions";
import { useHumanUserConfigEvents } from "@/hooks";
import { Environment, SessionDto } from "@2pm/core";
import { StandardLayout } from "@2pm/ui/layouts";
import { useState, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  children: React.ReactNode;
  session: SessionDto;
  open: boolean;
  environmentId: Environment["id"];
};

const UsersContainerViewContainer = ({
  children,
  session,
  environmentId,
  ...rest
}: Props) => {
  const [open, setOpen] = useState(rest.open);

  useHumanUserConfigEvents({
    humanUserId: session.humanUserId,
    onUpdated: useCallback((e) => {
      setOpen(e.data.humanUserConfig.usersSidebarState === "OPEN");
    }, []),
  });

  useHotkeys(
    "u",
    () => {
      updateHumanUserConfig({
        humanUserId: session.humanUserId,
        environmentId,
        userId: session.user.data.userId,
        usersSidebarState: open ? "CLOSED" : "OPEN",
      });
    },
    [open],
  );

  return (
    <StandardLayout.UsersContainer open={open}>
      {children}
    </StandardLayout.UsersContainer>
  );
};

export default UsersContainerViewContainer;
