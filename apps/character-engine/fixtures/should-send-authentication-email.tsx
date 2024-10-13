import {
  AiMessagePlotPointSummaryDto,
  HumanMessagePlotPointSummaryDto,
  PlotPointSummaryDto,
} from "@2pm/data";

const jake: HumanMessagePlotPointSummaryDto["data"]["user"] = {
  id: 2,
  type: "HUMAN",
  tag: "jake",
};

const ivan: AiMessagePlotPointSummaryDto["data"]["user"] = {
  id: 2,
  type: "AI",
  tag: "ivan",
};

let messageId = 1;

const humanMessage = (
  props: Omit<HumanMessagePlotPointSummaryDto["data"]["message"], "id">,
) => {
  return { id: messageId++, ...props };
};

const aiMessage = (
  props: Omit<AiMessagePlotPointSummaryDto["data"]["message"], "id">,
) => {
  return { id: messageId++, ...props };
};

const narrative: PlotPointSummaryDto[] = [
  {
    type: "AI_MESSAGE",
    data: {
      user: ivan,
      message: aiMessage({
        state: "COMPLETE",
        content: "Let's get you authenticated",
      }),
    },
  },
  {
    type: "AI_MESSAGE",
    data: {
      user: ivan,
      message: aiMessage({
        state: "COMPLETE",
        content: "What's your email address?",
      }),
    },
  },
  {
    type: "HUMAN_MESSAGE",
    data: {
      user: jake,
      message: humanMessage({
        content: "my email is jake@2pm.io",
      }),
    },
  },
];

export default narrative;
