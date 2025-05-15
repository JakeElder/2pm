import { humanUserThemesSocket } from "@/socket";
import {
  HumanUser,
  HumanUserTheme,
  HumanUserThemeUpdatedEventDto,
} from "@2pm/core";
import { useEffect } from "react";

type Props = {
  humanUserId: HumanUser["id"];
  humanUserThemeId: HumanUserTheme["id"];
  onUpdated: (e: HumanUserThemeUpdatedEventDto) => void;
};

export const useHumanUserThemeEvents = ({
  humanUserId,
  humanUserThemeId,
  onUpdated,
}: Props) => {
  useEffect(() => {
    const join = () => {
      humanUserThemesSocket.emit("join", { humanUserId, humanUserThemeId });
    };

    humanUserThemesSocket.on("connect", join).on("updated", onUpdated);

    if (humanUserThemesSocket.connected) {
      join();
    }

    return () => {
      humanUserThemesSocket.off("updated", onUpdated);
      humanUserThemesSocket.off("connect", join);
      humanUserThemesSocket.emit("leave", { humanUserId, humanUserThemeId });
    };
  }, [humanUserId, onUpdated]);
};
