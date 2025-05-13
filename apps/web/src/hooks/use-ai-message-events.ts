import { aiMessagesSocket } from "@/socket";
import { AiMessage, AiMessageUpdatedEventDto, HumanUser } from "@2pm/core";
import { useEffect } from "react";

type Props = {
  humanUserId: HumanUser["id"];
  aiMessageId: AiMessage["id"];
  onUpdated: (e: AiMessageUpdatedEventDto) => void;
};

export const useAiMessageEvents = ({
  humanUserId,
  aiMessageId,
  onUpdated,
}: Props) => {
  useEffect(() => {
    const join = () => {
      aiMessagesSocket.emit("join", { humanUserId, aiMessageId });
    };

    const handleUpdated: Props["onUpdated"] = (e) => {
      if (e.aiMessage.id !== aiMessageId) return;
      onUpdated(e);
    };

    aiMessagesSocket.on("connect", join).on("updated", handleUpdated);

    if (aiMessagesSocket.connected) {
      join();
    }

    return () => {
      aiMessagesSocket.off("updated", handleUpdated);
      aiMessagesSocket.off("connect", join);
      aiMessagesSocket.emit("leave", { humanUserId, aiMessageId });
    };
  }, [humanUserId, aiMessageId, onUpdated]);
};
