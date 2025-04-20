import { getSession } from "@/actions";
import { getHumanUserById } from "@/api/users";
import { shorten } from "@2pm/core/utils";
import { InfoBarUser } from "@2pm/ui/components";

type Props = {};

const InfoBarUserContainer = async ({}: Props) => {
  const session = await getSession();
  const { data: dto } = await getHumanUserById(session.user.id);
  const hash = shorten(dto.data.humanUser.id);
  return <InfoBarUser name="anon" hash={hash} />;
};

export default InfoBarUserContainer;
