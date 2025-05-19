import { themesSocket } from "@/socket";
import { HumanUser, Theme, ThemeUpdatedEventDto } from "@2pm/core";
import { useEffect } from "react";

type Props = {
  humanUserId: HumanUser["id"];
  themeId: Theme["id"];
  onUpdated: (e: ThemeUpdatedEventDto) => void;
};

export const useThemeEvents = ({ humanUserId, themeId, onUpdated }: Props) => {
  useEffect(() => {
    const join = () => {
      themesSocket.emit("join", { humanUserId, themeId });
    };

    themesSocket.on("connect", join).on("updated", onUpdated);

    if (themesSocket.connected) {
      console.log("joining");
      join();
    }

    return () => {
      themesSocket.off("updated", onUpdated);
      themesSocket.off("connect", join);
      themesSocket.emit("leave", { humanUserId, themeId });
    };
  }, [humanUserId, onUpdated]);
};
