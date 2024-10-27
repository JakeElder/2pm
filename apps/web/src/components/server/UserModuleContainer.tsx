import { UserModule } from "@2pm/ui";
import { getSession } from "@/actions";
import short from "short-uuid";
import { SessionDto } from "@2pm/data";

type Props = {};

const translator = short();

/*
 * Tag
 */

type TagProps = {
  session: SessionDto;
};

export const Tag = ({ session }: TagProps) => {
  const uuid = translator.fromUUID(session.session.id);
  return <UserModule.AnonymousTag>{uuid}</UserModule.AnonymousTag>;
};

const UserModuleContainer = async ({}: Props) => {
  const session = await getSession();

  return (
    <UserModule.Root>
      <UserModule.Header>
        <Tag session={session} />
        <UserModule.Level>{1}</UserModule.Level>
      </UserModule.Header>
      <UserModule.Body>
        <UserModule.Avatar />
        <UserModule.Rep>{0.000001}</UserModule.Rep>
      </UserModule.Body>
    </UserModule.Root>
  );
};

export default UserModuleContainer;
