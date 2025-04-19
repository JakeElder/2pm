import { getSession } from "@/actions";
import short from "short-uuid";

type Props = {};

const translator = short();

const UserModuleContainer = async ({}: Props) => {
  const session = await getSession();
  const uuid = translator.fromUUID(session.session.id);
  return <>{uuid}</>;
};

export default UserModuleContainer;
