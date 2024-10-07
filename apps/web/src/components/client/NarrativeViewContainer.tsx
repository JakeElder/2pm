"use client";

import { PlotPointDto } from "@2pm/data/dtos";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NarrativePlotPointViewContainer from "./NarrativePlotPointViewContainer";
import { HydratedPlotPoint } from "@2pm/data/comps";
import { Narrative } from "@2pm/ui";
import { hydratePlotPoint } from "@/actions";

type Props = {
  environmentId: number;
  plotPoints: HydratedPlotPoint[];
};

const NarrativeViewContainer = ({ environmentId, plotPoints }: Props) => {
  const [data, setPlotPoints] = useState<HydratedPlotPoint[]>(plotPoints);

  useEffect(() => {
    const socket = io("http://localhost:3002/environments/:id/plot-points")
      .emit("join", `${environmentId}`)
      .on("created", async (plotPoint: PlotPointDto) => {
        const hydrated = await hydratePlotPoint(plotPoint);
        setPlotPoints((data) => [hydrated, ...data]);
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
