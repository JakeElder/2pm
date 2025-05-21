import SiteMapsContainerViewContainer from "@/components/client/SiteMapContainerViewContainer";
import { getSession } from "@/actions";
import { getHumanUserConfig } from "@/api/human-users";
import { Environment } from "@2pm/core";

type Props = {
  children: React.ReactNode;
  environmentId: Environment["id"];
};

const SiteMapsContainerContainer = async ({
  children,
  environmentId,
}: Props) => {
  const session = await getSession();
  const config = await getHumanUserConfig(session.humanUserId);

  return (
    <SiteMapsContainerViewContainer
      session={session}
      open={config.data.siteMapSidebarState === "OPEN"}
      environmentId={environmentId}
    >
      {children}
    </SiteMapsContainerViewContainer>
  );
};

export default SiteMapsContainerContainer;
