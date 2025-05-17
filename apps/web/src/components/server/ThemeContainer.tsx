import { getSession } from "@/actions";
import { getHumanUserTheme } from "@/api/human-users";
import ThemeViewContainer from "../client/ThemeViewContainer";
import { Environment } from "@2pm/core";

type Props = {
  children: React.ReactNode;
  environmentId: Environment["id"];
};

const ThemeContainer = async ({ children, environmentId }: Props) => {
  const session = await getSession();
  const humanUserTheme = await getHumanUserTheme(session.humanUserId);
  return (
    <ThemeViewContainer
      session={session}
      humanUserTheme={humanUserTheme.data}
      environmentId={environmentId}
    >
      {children}
    </ThemeViewContainer>
  );
};

export default ThemeContainer;
