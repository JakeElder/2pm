import {
  EVALUATABLE_PLOT_POINT_TYPES,
  PLOT_POINT_TYPES,
} from "./plot-point.constants";

export type PlotPointType = (typeof PLOT_POINT_TYPES)[number];
export type EvaluatablePlotPointType =
  (typeof EVALUATABLE_PLOT_POINT_TYPES)[number];
