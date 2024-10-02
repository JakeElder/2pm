import { PlotPoint } from "@2pm/schemas";
import { ThirdPersonMessagePlotPointContainer } from "./PlotPointContainers/ThirdPersonMessageContainer";
import { FirstPersonMessageContainer } from "./PlotPointContainers/FirstPersonMessageContainer";

interface Props extends PlotPoint {}

const PlotPointSwitch = (plotPoint: Props) => {
  const { type } = plotPoint;
  if (type === "HUMAN_MESSAGE" || type === "AI_MESSAGE") {
    if (plotPoint.userId === 3) {
      return <FirstPersonMessageContainer {...plotPoint} />;
    } else {
      return <ThirdPersonMessagePlotPointContainer {...plotPoint} />;
    }
  }
};

export default PlotPointSwitch;
