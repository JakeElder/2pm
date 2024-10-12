"use client";

import { submitMessage } from "@/actions";
import { CreateHumanMessagePlotPointDto } from "@2pm/api/client";
import { PromptInput, PromptSubmitButton, Terminal } from "@2pm/ui";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props
  extends Pick<CreateHumanMessagePlotPointDto, "userId" | "environmentId"> {}

type Inputs = {
  content: string;
};

const TerminalPromptViewContainer = ({ userId, environmentId }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ content }) => {
    await submitMessage({
      type: "HUMAN_MESSAGE",
      environmentId,
      userId,
      content,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Terminal.Prompt>
        <Terminal.Input>
          <PromptInput {...register("content")} autoComplete="off" />
        </Terminal.Input>
        <Terminal.SubmitButton>
          <PromptSubmitButton disabled={isSubmitting} />
        </Terminal.SubmitButton>
      </Terminal.Prompt>
    </form>
  );
};

export default TerminalPromptViewContainer;
