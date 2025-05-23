"use client";

import Link from "next/link";
import { UserSpaceList } from "@2pm/ui/components";
import { Environment, UserSpaceListDto } from "@2pm/core";
import UserTagViewContainer from "./UserTagViewContainer";

type Props = {
  user: UserSpaceListDto[number];
  activeEnvironmentId: Environment["id"];
};

const UserSpaceListViewContainer = ({ activeEnvironmentId, user }: Props) => {
  if (user.humanUser.type === "ANONYMOUS") {
    throw new Error();
  }

  const tag = user.humanUser.data.tag;

  return (
    <UserSpaceList.Root>
      <UserSpaceList.Tag>
        <UserTagViewContainer {...user.humanUser} />
      </UserSpaceList.Tag>
      <UserSpaceList.Channels>
        {user.spaces.map((space) => {
          return (
            <UserSpaceList.Channel
              key={space.id}
              active={space.environmentId === activeEnvironmentId}
              updates={space.slug === "food"}
            >
              <Link key={space.id} href={`/@${tag}/${space.slug}`}>
                #{space.slug}
              </Link>
            </UserSpaceList.Channel>
          );
        })}
      </UserSpaceList.Channels>
    </UserSpaceList.Root>
  );
};

export default UserSpaceListViewContainer;
