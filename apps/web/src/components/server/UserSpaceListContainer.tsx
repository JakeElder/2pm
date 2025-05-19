import { UserSpaceList, UserTag } from "@2pm/ui/components";
import * as users from "../../fixtures/users";
import { getUserSpaceLists } from "@/api/user-space-lists";
import UserSpaceListViewContainer from "../client/UserSpaceListViewContainer";
import { Environment } from "@2pm/core";

type Props = {
  activeEnvironmentId: Environment["id"];
};

const UserSpaceListContainer = async ({ activeEnvironmentId }: Props) => {
  const res = await getUserSpaceLists();

  return res.data.map((user) => {
    return (
      <UserSpaceListViewContainer
        key={user.humanUser.data.id}
        activeEnvironmentId={activeEnvironmentId}
        user={user}
      />
    );
  });
};

export default UserSpaceListContainer;

<UserSpaceList.Root>
  <UserSpaceList.Tag>
    <UserTag {...users.ANONYMOUS} showHash />
  </UserSpaceList.Tag>
  <UserSpaceList.Channels>
    <UserSpaceList.Channel disabled>#home</UserSpaceList.Channel>
  </UserSpaceList.Channels>
</UserSpaceList.Root>;
