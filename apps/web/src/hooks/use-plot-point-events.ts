import { environmentsSocket } from "@/socket";
import { Environment, HumanUser, PlotPointDto } from "@2pm/core";
import { useEffect } from "react";

type Props = {
  environmentId: Environment["id"];
  humanUserId: HumanUser["id"];
  onCreated: (plotPoint: PlotPointDto) => void;
};

export const usePlotPointEvents = ({
  environmentId,
  humanUserId,
  onCreated,
}: Props) => {
  useEffect(() => {
    const join = () => {
      environmentsSocket.emit("join", { environmentId, humanUserId });
    };

    environmentsSocket.on("connect", join).on("plot-points.created", onCreated);

    if (environmentsSocket.connected) {
      join();
    }

    return () => {
      environmentsSocket.off("plot-points.created", onCreated);
      environmentsSocket.off("connect", join);
      environmentsSocket.emit("leave", { environmentId, humanUserId });
    };
  }, [environmentId, humanUserId, onCreated]);
};
