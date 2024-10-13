"use client";

import { useEffect, useState } from "react";
import { Narrative } from "@2pm/ui";
import { PlotPointDto } from "@2pm/data";
import { EnvironmentsRoomJoinedEventDto } from "@2pm/data";
import { environmentsSocket } from "@/socket";
import NarrativePlotPointViewContainer from "./NarrativePlotPointViewContainer";

type Props = {
  environmentId: number;
  plotPoints: PlotPointDto[];
};

const NarrativeViewContainer = ({ environmentId, plotPoints }: Props) => {
  const [data, setPlotPoints] = useState<PlotPointDto[]>(plotPoints);

  useEffect(() => {
    const e: EnvironmentsRoomJoinedEventDto = {
      user: { id: 3, type: "HUMAN", tag: "jake" },
      environment: { id: environmentId, type: "COMPANION_ONE_TO_ONE" },
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
