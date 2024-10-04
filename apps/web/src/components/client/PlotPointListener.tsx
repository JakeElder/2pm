"use client";

import { PlotPointDto } from "@2pm/schemas/dto";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NarrativePlotPointContainer from "../server/NarrativePlotPointContainer";

type Props = {
  environmentId: number;
};

const PlotPointListener = ({ environmentId }: Props) => {
  const [data, setPlotPoints] = useState<PlotPointDto[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3002/environments")
      .emit("join", `${environmentId}/plot-points`)
      .on("plot-point-added", (plotPoint: PlotPointDto) => {
        setPlotPoints([...data, plotPoint]);
      });

    return () => {
      socket.disconnect();
    };
  }, [environmentId]);

  return data.map((props) => (
    <NarrativePlotPointContainer key={props.id} {...props} />
  ));
};

export default PlotPointListener;
