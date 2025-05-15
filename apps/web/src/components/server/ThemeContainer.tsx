import { getSession } from "@/actions";
import { getHumanUserTheme } from "@/api/human-users";
import ThemeViewContainer from "../client/ThemeViewContainer";

type Props = {
  children: React.ReactNode;
};

const ThemeContainer = async ({ children }: Props) => {
  const session = await getSession();
  const humanUserTheme = await getHumanUserTheme(session.humanUserId);
  return (
    <ThemeViewContainer session={session} humanUserTheme={humanUserTheme.data}>
      {children}
    </ThemeViewContainer>
  );
};

export default ThemeContainer;
