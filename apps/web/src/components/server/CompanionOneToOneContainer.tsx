import { CompanionOneToOneModule } from "@2pm/ui";
import NarrativeContainer from "@/components/server/NarrativeContainer";
import CompanionOneToOneFooterViewContainer from "@/components/client/CompanionOneToOneFooterViewContainer";
import {
  getSession,
  getCompanionOneToOneEnvironmentsByUserId,
} from "@/actions";
import { SessionProvider } from "../client/SessionProvider";

type Props = {};

const CompanionOneToOneContainer = async ({}: Props) => {
  const session = await getSession();
  const o2o = await getCompanionOneToOneEnvironmentsByUserId(
    session.data.user.id,
  );

  return (
    <CompanionOneToOneModule.Root>
      <CompanionOneToOneModule.Avatar code={o2o.data.companionAiUser.id} />
      <CompanionOneToOneModule.Main>
        <CompanionOneToOneModule.Header tag={o2o.data.companionAiUser.tag} />
        <CompanionOneToOneModule.Body>
          <NarrativeContainer environment={o2o} />
        </CompanionOneToOneModule.Body>
        <SessionProvider session={session}>
          <CompanionOneToOneFooterViewContainer environment={o2o} />
        </SessionProvider>
      </CompanionOneToOneModule.Main>
    </CompanionOneToOneModule.Root>
  );
};

export default CompanionOneToOneContainer;
