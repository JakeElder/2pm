"use client";

import { useCallback, useState } from "react";
import {
  Environment,
  PlotPointDto,
  PlotPointType,
  SessionDto,
} from "@2pm/core";
import PlotPointViewContainer from "./PlotPointViewContainer";
import { usePlotPointEvents } from "@/hooks";

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

  usePlotPointEvents({
    environmentId,
    humanUserId: session.user.data.id,
    onCreated: useCallback((plotPoint: PlotPointDto) => {
      if (
        (types && !types.includes(plotPoint.type)) ||
        (filter && filter.includes(plotPoint.type))
      ) {
        return;
      }
      setPlotPoints((data) => [plotPoint, ...data]);
    }, []),
  });

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
