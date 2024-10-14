import { getSession } from "@/actions";

type Props = {
  children: React.ReactNode;
};

const AuthGate = async ({ children }: Props) => {
  return <>{children}</>;
};

export default AuthGate;
