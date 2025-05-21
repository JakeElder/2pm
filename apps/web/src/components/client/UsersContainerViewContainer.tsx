"use client";

import { StandardLayout } from "@2pm/ui/layouts";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  children: React.ReactNode;
};

const UsersContainerViewContainer = ({ children }: Props) => {
  const [open, setOpen] = useState(true);

  useHotkeys(
    "u",
    () => {
      console.log(open);
      setOpen((v) => !v);
    },
    [],
  );

  return (
    <StandardLayout.UsersContainer open={open}>
      {children}
    </StandardLayout.UsersContainer>
  );
};

export default UsersContainerViewContainer;
