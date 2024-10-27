"use client";

import { useEffect, useState } from "react";
import { Narrative } from "@2pm/ui";
import { EnvironmentDto, PlotPointDto } from "@2pm/data";
import { EnvironmentsRoomJoinedEventDto } from "@2pm/data";
import { environmentsSocket } from "@/socket";
import NarrativePlotPointViewContainer from "./NarrativePlotPointViewContainer";
import { useSession } from "@/hooks/use-session";

type Props = {
  environment: EnvironmentDto;
  plotPoints: PlotPointDto[];
};

const NarrativeViewContainer = ({ environment, plotPoints }: Props) => {
  const [data, setPlotPoints] = useState<PlotPointDto[]>(plotPoints);
  const session = useSession();

  useEffect(() => {
    const e: EnvironmentsRoomJoinedEventDto = {
      user: session.user,
      environment,
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
