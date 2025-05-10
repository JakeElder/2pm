import { getSession } from "@/actions";
import { getEnvironmentUserList } from "@/api/environments";
import EnvironmentUserListViewContainer from "@/components/client/EnvironmentUserListViewContainer";
import { Environment } from "@2pm/core";

type Props = {
  environmentId: Environment["id"];
};

const EnvironmentUserListContainer = async ({ environmentId }: Props) => {
  const list = await getEnvironmentUserList(environmentId);
  const session = await getSession();

  return (
    <EnvironmentUserListViewContainer
      environmentId={environmentId}
      environmentUserList={list.data}
      session={session}
    />
  );
};

export default EnvironmentUserListContainer;
