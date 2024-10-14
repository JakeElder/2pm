import {
  AiUserMessagePlotPointSummaryDto,
  AuthenticatedUserMessagePlotPointSummaryDto,
  PlotPointSummaryDto,
} from "@2pm/data";

const jake: AuthenticatedUserMessagePlotPointSummaryDto["data"]["user"] = {
  id: 2,
  type: "AUTHENTICATED_USER",
  tag: "jake",
};

const ivan: AiUserMessagePlotPointSummaryDto["data"]["user"] = {
  id: 2,
  type: "AI",
  tag: "ivan",
};

let messageId = 1;

const authenticatedUserMessage = (
  props: Omit<
    AuthenticatedUserMessagePlotPointSummaryDto["data"]["message"],
    "id"
  >,
) => {
  return { id: messageId++, ...props };
};

const aiUserMessage = (
  props: Omit<AiUserMessagePlotPointSummaryDto["data"]["message"], "id">,
) => {
  return { id: messageId++, ...props };
};

const narrative: PlotPointSummaryDto[] = [
  {
    type: "AI_USER_MESSAGE",
    data: {
      user: ivan,
      message: aiUserMessage({
        state: "COMPLETE",
        content: "Let's get you authenticated",
      }),
    },
  },
  {
    type: "AI_USER_MESSAGE",
    data: {
      user: ivan,
      message: aiUserMessage({
        state: "COMPLETE",
        content: "What's your email address?",
      }),
    },
  },
  {
    type: "AUTHENTICATED_USER_MESSAGE",
    data: {
      user: jake,
      message: authenticatedUserMessage({
        content: "my email is jake@2pm.io",
      }),
    },
  },
];

export default narrative;
