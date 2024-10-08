"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Narrative } from "@2pm/ui";
import { HydratedPlotPoint } from "@2pm/data";
import NarrativePlotPointViewContainer from "./NarrativePlotPointViewContainer";
import { EnvironmentRoomJoinedEvent } from "@2pm/data/api-events";

type Props = {
  environmentId: number;
  plotPoints: HydratedPlotPoint[];
};

const NarrativeViewContainer = ({ environmentId, plotPoints }: Props) => {
  const [data, setPlotPoints] = useState<HydratedPlotPoint[]>(plotPoints);

  useEffect(() => {
    const e: EnvironmentRoomJoinedEvent = {
      user: {
        id: 3,
        type: "HUMAN",
        tag: "jake",
      },
      environment: {
        id: environmentId,
        type: "COMPANION_ONE_TO_ONE",
      },
    };

    const socket = io("http://localhost:3002/environments")
      .emit("join", e)
      .on("plot-point.created", async (plotPoint: HydratedPlotPoint) => {
        setPlotPoints((data) => [plotPoint, ...data]);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Narrative.Root>
      {data.map((props) => (
        <NarrativePlotPointViewContainer key={props.id} {...props} />
      ))}
    </Narrative.Root>
  );
};

export default NarrativeViewContainer;
