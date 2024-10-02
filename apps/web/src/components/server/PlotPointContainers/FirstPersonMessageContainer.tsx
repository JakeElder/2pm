import { PlotPoint } from "@2pm/schemas";
import api from "@/api";
import { FirstPersonMessage } from "@2pm/ui/plot-points";
import { Narrative } from "@2pm/ui";

interface FirstPersonContainerProps extends PlotPoint {}

export const FirstPersonMessageContainer = async ({
  id,
}: FirstPersonContainerProps) => {
  const { data: aiMessage } =
    await api.plotPoints.getAiMessageByPlotPointId(id);
  return (
    <Narrative.FirstPersonMessage>
      <FirstPersonMessage>
        {JSON.stringify(aiMessage, null, 2)}
      </FirstPersonMessage>
    </Narrative.FirstPersonMessage>
  );
};
