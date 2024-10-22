import { SessionContext } from "@/components/client/SessionProvider";
import { useContext } from "react";

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error();
  }

  return context.session;
};
