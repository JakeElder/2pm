import { getSession } from "@/actions";

type Props = {};

const CompanionOneToOneBodyContainer = async ({}: Props) => {
  const session = await getSession();
  return <>CompanionOneToOneBodyContainer</>;
};

export default CompanionOneToOneBodyContainer;
