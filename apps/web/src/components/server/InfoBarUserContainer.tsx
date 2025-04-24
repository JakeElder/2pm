import { getSession } from "@/actions";
import { shorten } from "@2pm/core/utils";
import { InfoBarUser } from "@2pm/ui/components";

type Props = {};

const InfoBarUserContainer = async ({}: Props) => {
  const session = await getSession();
  const hash = shorten(session.humanUser.id);
  return <InfoBarUser name="anon" hash={hash} />;
};

export default InfoBarUserContainer;
