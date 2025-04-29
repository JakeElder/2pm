"use client";

import { useEffect, useState } from "react";
import { Environment, PlotPointDto } from "@2pm/core";
import PlotPointViewContainer from "./PlotPointViewContainer";

type Props = {
  environmentId: Environment["id"];
  plotPoints: PlotPointDto[];
};

const NarrativeViewContainer = ({ environmentId, plotPoints }: Props) => {
  const [data, setPlotPoints] = useState<PlotPointDto[]>(plotPoints);

  useEffect(() => {
    // const e: EnvironmentsRoomJoinedEventDto = {
    //   user: session.user,
    //   environment,
    // };
    //
    // environmentsSocket
    //   .emit("join", e)
    //   .on("plot-points.created", async (plotPoint: PlotPointDto) => {
    //     setPlotPoints((data) => [plotPoint, ...data]);
    //   });
    //
    // return () => {
    //   environmentsSocket.off("plot-points.created");
    //   environmentsSocket.emit("leave", e);
    // };
  }, []);

  return (
    <>
      {plotPoints.map((pp) => {
        return <PlotPointViewContainer key={pp.data.plotPoint.id} {...pp} />;
      })}
    </>
  );
};

export default NarrativeViewContainer;
