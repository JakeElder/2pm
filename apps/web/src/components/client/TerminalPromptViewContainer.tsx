"use client";

import { submitMessage } from "@/actions";
import { PromptInput, PromptSubmitButton, Terminal } from "@2pm/ui";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {}

type Inputs = {
  message: string;
};

const TerminalPromptViewContainer = ({}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await submitMessage(data.message);
    console.log(data.message);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Terminal.Prompt>
        <Terminal.Input>
          <PromptInput {...register("message")} />
        </Terminal.Input>
        <Terminal.SubmitButton>
          <PromptSubmitButton disabled={isSubmitting} />
        </Terminal.SubmitButton>
      </Terminal.Prompt>
    </form>
  );
};

export default TerminalPromptViewContainer;
