import { getSession } from "@/actions";

type Props = {};

const UserModuleContainer = async ({}: Props) => {
  const session = await getSession();
  return <pre>{JSON.stringify(session)}</pre>;
};

export default UserModuleContainer;
