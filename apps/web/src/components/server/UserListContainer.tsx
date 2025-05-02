import { getUsersByEnvironmentId } from "@/api/environments";
import { Environment } from "@2pm/core";
import { UserList } from "@2pm/ui/components";

type Props = {
  environmentId: Environment["id"];
};

const UserListContainer = async ({ environmentId }: Props) => {
  const users = await getUsersByEnvironmentId(environmentId);

  return (
    <UserList.Root>
      <UserList.User type="AI" tag="niko" />
      <UserList.User type="HUMAN" tag="jake" />
    </UserList.Root>
  );
};

export default UserListContainer;
