"use client";

import { PlotPointDto } from "@2pm/schemas/dto";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NarrativePlotPointViewContainer from "./NarrativePlotPointViewContainer";
import { HydratedPlotPoint } from "@2pm/schemas/comps";
import { Narrative } from "@2pm/ui";

type Props = {
  environmentId: number;
  plotPoints: HydratedPlotPoint[];
};

const NarrativeViewContainer = ({ environmentId, plotPoints }: Props) => {
  const [data, setPlotPoints] = useState<HydratedPlotPoint[]>(plotPoints);

  useEffect(() => {
    const socket = io("http://localhost:3002/environments")
      .emit("join", `${environmentId}/plot-points`)
      .on("plot-point-added", (plotPoint: PlotPointDto) => {
        console.log(plotPoint);
        // setPlotPoints([...data, plotPoint]);
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
