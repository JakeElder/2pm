import { PlotPoint } from "@2pm/schemas";
import api from "@/api";
import { ThirdPersonMessage } from "@2pm/ui/plot-points";
import { Narrative } from "@2pm/ui";

interface ThirdPersonMessagePlotPointContainerProps
  extends Omit<PlotPoint, "type"> {}

export const ThirdPersonMessagePlotPointContainer = async ({
  id,
}: ThirdPersonMessagePlotPointContainerProps) => {
  const { data: aiMessage } =
    await api.plotPoints.getAiMessageByPlotPointId(id);
  return (
    <Narrative.ThirdPersonMessage>
      <ThirdPersonMessage>
        {JSON.stringify(aiMessage, null, 2)}
      </ThirdPersonMessage>
    </Narrative.ThirdPersonMessage>
  );
};
