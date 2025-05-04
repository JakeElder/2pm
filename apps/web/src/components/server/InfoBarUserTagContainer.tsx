import { getSession } from "@/actions";
import { UserTag } from "@2pm/ui/components";

type Props = {};

const InfoBarUserTagContainer = async ({}: Props) => {
  const session = await getSession();
  return <UserTag {...session.user} showHash />;
};

export default InfoBarUserTagContainer;
