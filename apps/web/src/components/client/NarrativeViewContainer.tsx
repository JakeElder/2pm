"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NarrativePlotPointViewContainer from "./NarrativePlotPointViewContainer";
import { Narrative } from "@2pm/ui";
import { HydratedPlotPoint } from "@2pm/data";

type Props = {
  environmentId: number;
  plotPoints: HydratedPlotPoint[];
};

const NarrativeViewContainer = ({ environmentId, plotPoints }: Props) => {
  const [data, setPlotPoints] = useState<HydratedPlotPoint[]>(plotPoints);

  useEffect(() => {
    const socket = io("http://localhost:3002/environments/:id/plot-points")
      .emit("join", `${environmentId}`)
      .on("created", async (plotPoint: HydratedPlotPoint) => {
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
