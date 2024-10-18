"use client";

import { submitMessage } from "@/actions";
import { CreateAuthenticatedUserMessagePlotPointDto } from "@2pm/api/client";
import {
  PromptInput,
  PromptSubmitButton,
  CompanionOneToOneModule,
} from "@2pm/ui";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props
  extends Pick<
    CreateAuthenticatedUserMessagePlotPointDto,
    "userId" | "environmentId"
  > {}

type Inputs = {
  content: string;
};

const CompanionOneToOneFooterContainer = ({ userId, environmentId }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ content }) => {
    await submitMessage({
      type: "AUTHENTICATED_USER_MESSAGE",
      environmentId,
      userId,
      content,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CompanionOneToOneModule.Footer>
        <CompanionOneToOneModule.Input>
          <PromptInput {...register("content")} autoComplete="off" />
        </CompanionOneToOneModule.Input>
        <CompanionOneToOneModule.SubmitButton>
          <PromptSubmitButton disabled={isSubmitting} />
        </CompanionOneToOneModule.SubmitButton>
      </CompanionOneToOneModule.Footer>
    </form>
  );
};

export default CompanionOneToOneFooterContainer;
