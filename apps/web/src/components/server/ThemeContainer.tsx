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
    <ThemeViewContainer theme={humanUserTheme.data.theme}>
      {children}
    </ThemeViewContainer>
  );
};

export default ThemeContainer;
