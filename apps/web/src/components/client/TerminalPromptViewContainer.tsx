"use client";

import { submitMessage } from "@/actions";
import { CreateHumanMessageDto } from "@2pm/api/client";
import { PromptInput, PromptSubmitButton, Terminal } from "@2pm/ui";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props
  extends Pick<CreateHumanMessageDto, "userId" | "environmentId"> {}

type Inputs = {
  message: string;
};

const TerminalPromptViewContainer = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await submitMessage({ ...props, content: data.message });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Terminal.Prompt>
        <Terminal.Input>
          <PromptInput {...register("message")} autoComplete="off" />
        </Terminal.Input>
        <Terminal.SubmitButton>
          <PromptSubmitButton disabled={isSubmitting} />
        </Terminal.SubmitButton>
      </Terminal.Prompt>
    </form>
  );
};

export default TerminalPromptViewContainer;
