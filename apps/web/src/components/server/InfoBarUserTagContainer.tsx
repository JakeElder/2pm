import { getSession } from "@/actions";
import UserTagViewContainer from "../client/UserTagViewContainer";

type Props = {};

const InfoBarUserTagContainer = async ({}: Props) => {
  const session = await getSession();
  return <UserTagViewContainer {...session.user} showHash />;
};

export default InfoBarUserTagContainer;
