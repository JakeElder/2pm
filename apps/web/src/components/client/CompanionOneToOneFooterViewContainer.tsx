"use client";

import { submitMessage } from "@/actions";
import { useSession } from "@/hooks/use-session";
import { CompanionOneToOneEnvironmentDto } from "@2pm/data";
import {
  PromptInput,
  PromptSubmitButton,
  CompanionOneToOneModule,
} from "@2pm/ui";
import { useForm, SubmitHandler } from "react-hook-form";

type Props = {
  environment: CompanionOneToOneEnvironmentDto;
};

type Inputs = {
  content: string;
};

const CompanionOneToOneFooterViewContainer = ({ environment }: Props) => {
  const session = useSession();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ content }) => {
    await submitMessage({
      type: "HUMAN_USER_MESSAGE",
      environmentId: environment.data.environment.id,
      userId: session.user.id,
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

export default CompanionOneToOneFooterViewContainer;
