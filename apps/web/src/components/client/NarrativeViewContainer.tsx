"use client";

import { useEffect, useState } from "react";
import { Narrative } from "@2pm/ui";
import { EnvironmentsClientSocket, HydratedPlotPointDto } from "@2pm/data";
import { EnvironmentsRoomJoinedEventDto } from "@2pm/data";
import NarrativePlotPointViewContainer from "./NarrativePlotPointViewContainer";
import { io } from "socket.io-client";

type Props = {
  environmentId: number;
  plotPoints: HydratedPlotPointDto[];
};

const NarrativeViewContainer = ({ environmentId, plotPoints }: Props) => {
  const [data, setPlotPoints] = useState<HydratedPlotPointDto[]>(plotPoints);

  useEffect(() => {
    const e: EnvironmentsRoomJoinedEventDto = {
      user: { id: 3, type: "HUMAN", tag: "jake" },
      environment: { id: environmentId, type: "COMPANION_ONE_TO_ONE" },
    };

    const socket: EnvironmentsClientSocket = io(
      "http://localhost:3002/environments",
    );

    socket
      .emit("join", e)
      .on("plot-points.created", async (plotPoint: HydratedPlotPointDto) => {
        setPlotPoints((data) => [plotPoint, ...data]);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Narrative.Root>
      {data.map((props) => (
        <NarrativePlotPointViewContainer
          key={props.data.plotPoint.id}
          {...props}
        />
      ))}
    </Narrative.Root>
  );
};

export default NarrativeViewContainer;
