import { getSession } from "@/actions";
import { getHumanUserTheme } from "@/api/human-users";
import ThemeProviderViewContainer from "../client/ThemeProviderViewContainer";
import { Environment } from "@2pm/core";

type Props = {
  children: React.ReactNode;
  environmentId: Environment["id"];
};

const ThemeProviderContainer = async ({ children, environmentId }: Props) => {
  const session = await getSession();
  const humanUserTheme = await getHumanUserTheme(session.humanUserId);

  return (
    <ThemeProviderViewContainer
      session={session}
      humanUserTheme={humanUserTheme.data}
      environmentId={environmentId}
    >
      {children}
    </ThemeProviderViewContainer>
  );
};

export default ThemeProviderContainer;
