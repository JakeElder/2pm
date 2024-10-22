import { CompanionOneToOneModule } from "@2pm/ui";
import NarrativeContainer from "@/components/server/NarrativeContainer";
import CompanionOneToOneFooterViewContainer from "@/components/client/CompanionOneToOneFooterViewContainer";
import {
  getSession,
  getCompanionOneToOneEnvironmentsByUserId,
} from "@/actions";

type Props = {};

const CompanionOneToOneContainer = async ({}: Props) => {
  const session = await getSession();
  const o2o = await getCompanionOneToOneEnvironmentsByUserId(
    session.data.user.id,
  );

  return (
    <CompanionOneToOneModule.Root>
      <CompanionOneToOneModule.Avatar code="IVAN" />
      <CompanionOneToOneModule.Main>
        <CompanionOneToOneModule.Header handle="ivan" />
        <CompanionOneToOneModule.Body>
          <NarrativeContainer environment={o2o} />
        </CompanionOneToOneModule.Body>
        <CompanionOneToOneFooterViewContainer environment={o2o} />
      </CompanionOneToOneModule.Main>
    </CompanionOneToOneModule.Root>
  );
};

export default CompanionOneToOneContainer;
