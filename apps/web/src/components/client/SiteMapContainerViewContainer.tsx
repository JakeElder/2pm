"use client";

import { StandardLayout } from "@2pm/ui/layouts";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  children: React.ReactNode;
};

const SiteMapContainerViewContainer = ({ children }: Props) => {
  const [open, setOpen] = useState(true);

  useHotkeys(
    "s",
    () => {
      setOpen((v) => !v);
    },
    [],
  );

  return (
    <StandardLayout.SiteMapContainer open={open}>
      {children}
    </StandardLayout.SiteMapContainer>
  );
};

export default SiteMapContainerViewContainer;
