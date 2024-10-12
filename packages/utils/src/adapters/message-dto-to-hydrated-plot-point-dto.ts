import { MessageDto, HydratedPlotPointDto } from "@2pm/data";

const messageDtoToHydratedPlotPointDto = (
  messageDto: MessageDto,
): HydratedPlotPointDto => {
  if (messageDto.type === "AI") {
    return {
      type: "AI_MESSAGE",
      data: {
        type: "AI",
        plotPoint: messageDto.plotPoint,
        message: messageDto.message,
        aiMessage: messageDto.aiMessage,
        environment: messageDto.environment,
        user: messageDto.user,
        aiUser: messageDto.aiUser,
      },
    };
  }

  if (messageDto.type === "HUMAN") {
    return {
      type: "HUMAN_MESSAGE",
      data: {
        type: "HUMAN",
        plotPoint: messageDto.plotPoint,
        message: messageDto.message,
        humanMessage: messageDto.humanMessage,
        environment: messageDto.environment,
        user: messageDto.user,
        humanUser: messageDto.humanUser,
      },
    };
  }

  throw new Error("Unsupported message type");
};

export default messageDtoToHydratedPlotPointDto;
