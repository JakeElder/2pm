import { getSession } from "@/actions";
import { getHumanUserById } from "@/api/users";
import { InfoBarUser } from "@2pm/ui/components";
import short from "short-uuid";

type Props = {};

const translator = short();

const InfoBarUserContainer = async ({}: Props) => {
  const session = await getSession();
  const { data: dto } = await getHumanUserById(session.user.id);
  const hash = translator.fromUUID(dto.data.humanUser.id);
  return <InfoBarUser name="anon" hash={hash} />;
};

export default InfoBarUserContainer;
