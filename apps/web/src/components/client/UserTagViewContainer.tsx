"use client";

import { useHumanUserEvents } from "@/hooks";
import { UserTag } from "@2pm/ui/components";
import { useState, useCallback } from "react";

/*
 * HumanUserTagViewContainer
 */

type HumanUserTagViewContainerProps = React.ComponentProps<typeof UserTag>;

export const HumanUserTagViewContainer = ({
  ...rest
}: HumanUserTagViewContainerProps) => {
  const [props, setProps] = useState(rest);
  useHumanUserEvents({
    humanUserId: props.data.id,
    onUpdated: useCallback((e) => {
      if (e.data.humanUser.data.id === rest.data.id) {
        console.log(e.data.humanUser);
        setProps(e.data.humanUser);
      }
    }, []),
  });
  return (
    <UserTag
      {...props}
      showHash={rest.showHash || props.type === "ANONYMOUS"}
    />
  );
};

type Props = React.ComponentProps<typeof UserTag>;

const UserTagViewContainer = ({ ...props }: Props) => {
  if (props.type === "AI") {
    return <UserTag {...props} />;
  }

  return <HumanUserTagViewContainer {...props} />;
};

export default UserTagViewContainer;
