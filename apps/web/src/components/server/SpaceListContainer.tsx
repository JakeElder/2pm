import { getSession } from "@/actions";
import { getSpaceList } from "@/api/space-lists";
import { Environment } from "@2pm/core";
import SpaceListViewContainer from "../client/SpaceListViewContainer";

type Props = {
  activeEnvironmentId: Environment["id"];
};

const SpaceListContainer = async ({ activeEnvironmentId }: Props) => {
  const spaceList = await getSpaceList();
  const session = await getSession();

  return (
    <SpaceListViewContainer
      activeEnvironmentId={activeEnvironmentId}
      session={session}
      spaceList={spaceList.data}
    />
  );
};

export default SpaceListContainer;
