"use client";

import { useEffect, useState } from "react";
import {
  Environment,
  EnvironmentsRoomJoinedEventDto,
  PlotPointDto,
  PlotPointType,
  SessionDto,
} from "@2pm/core";
import PlotPointViewContainer from "./PlotPointViewContainer";
import { environmentsSocket } from "@/socket";

type Props = {
  environmentId: Environment["id"];
  plotPoints: PlotPointDto[];
  session: SessionDto;
  types?: PlotPointType[];
  filter?: PlotPointType[];
};

const NarrativeViewContainer = ({
  environmentId,
  plotPoints,
  session,
  types,
  filter,
}: Props) => {
  const [data, setPlotPoints] = useState<PlotPointDto[]>(plotPoints);

  useEffect(() => {
    const e: EnvironmentsRoomJoinedEventDto = {
      humanUserId: session.user.data.id,
      environmentId,
    };

    environmentsSocket
      .emit("join", e)
      .on("plot-points.created", async (plotPoint: PlotPointDto) => {
        if (types && !types.includes(plotPoint.type)) {
          return;
        }
        if (filter && filter.includes(plotPoint.type)) {
          return;
        }
        setPlotPoints((data) => [plotPoint, ...data]);
      });

    return () => {
      environmentsSocket.removeAllListeners();
      environmentsSocket.emit("leave", e);
    };
  }, []);

  return (
    <>
      {data.map((plotPoint) => {
        return (
          <PlotPointViewContainer
            key={plotPoint.data.plotPoint.id}
            session={session}
            plotPoint={plotPoint}
          />
        );
      })}
    </>
  );
};

export default NarrativeViewContainer;
