import UsersContainerViewContainer from "../client/UsersContainerViewContainer";
import { getSession } from "@/actions";
import { getHumanUserConfig } from "@/api/human-users";
import { Environment } from "@2pm/core";

type Props = {
  children: React.ReactNode;
  environmentId: Environment["id"];
};

const UsersContainerContainer = async ({ children, environmentId }: Props) => {
  const session = await getSession();
  const config = await getHumanUserConfig(session.humanUserId);

  return (
    <UsersContainerViewContainer
      environmentId={environmentId}
      session={session}
      open={config.data.usersSidebarState === "OPEN"}
    >
      {children}
    </UsersContainerViewContainer>
  );
};

export default UsersContainerContainer;
