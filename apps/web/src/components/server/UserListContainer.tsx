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
      {users.data.map((user) => (
        <UserList.User
          key={user.data.id}
          {...user}
          showHash={user.type === "ANONYMOUS"}
        />
      ))}
    </UserList.Root>
  );
};

export default UserListContainer;
