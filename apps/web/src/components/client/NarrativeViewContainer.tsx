"use client";

import { useEffect, useState } from "react";
import {
  Environment,
  EnvironmentsRoomJoinedEventDto,
  PlotPointDto,
  SessionDto,
} from "@2pm/core";
import PlotPointViewContainer from "./PlotPointViewContainer";
import { environmentsSocket } from "@/socket";

type Props = {
  environmentId: Environment["id"];
  plotPoints: PlotPointDto[];
  session: SessionDto;
};

const NarrativeViewContainer = ({
  environmentId,
  plotPoints,
  session,
}: Props) => {
  const [data, setPlotPoints] = useState<PlotPointDto[]>(plotPoints);

  useEffect(() => {
    const e: EnvironmentsRoomJoinedEventDto = {
      userId: session.humanUser.userId,
      environmentId,
    };

    environmentsSocket
      .emit("join", e)
      .on("plot-points.created", async (plotPoint: PlotPointDto) => {
        setPlotPoints((data) => [plotPoint, ...data]);
      });

    return () => {
      environmentsSocket.off("plot-points.created");
      environmentsSocket.emit("leave", e);
    };
  }, []);

  return (
    <>
      {data.map((plotPoint) => {
        return (
          <PlotPointViewContainer
            key={plotPoint.data.plotPoint.id}
            {...plotPoint}
          />
        );
      })}
    </>
  );
};

export default NarrativeViewContainer;
