import { PlotPoint } from "@2pm/schemas";
import { ThirdPersonMessagePlotPointContainer } from "./PlotPointContainers/ThirdPersonMessageContainer";

interface Props extends PlotPoint {}

const PlotPointSwitch = ({ type, ...rest }: Props) => {
  if (type === "MESSAGE_SENT") {
    return <ThirdPersonMessagePlotPointContainer {...rest} />;
  }
};

export default PlotPointSwitch;
