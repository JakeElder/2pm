"use client";

import { PromptInput, PromptSubmitButton, Terminal } from "@2pm/ui";
import { useFormStatus } from "react-dom";

interface Props {}

const TerminalPromptViewContainer = ({}: Props) => {
  const { pending } = useFormStatus();
  return (
    <Terminal.Prompt>
      <Terminal.Input>
        <PromptInput name="message" disabled={pending} />
      </Terminal.Input>
      <Terminal.SubmitButton>
        <PromptSubmitButton disabled={pending} />
      </Terminal.SubmitButton>
    </Terminal.Prompt>
  );
};

export default TerminalPromptViewContainer;
