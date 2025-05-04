"use client";

import { submitMessage } from "@/actions";
import { Environment, ProseDtoSchema } from "@2pm/core";
import { Prose } from "@2pm/ui/components";

type Props = {
  environmentId: Environment["id"];
};

const ProseViewContainer = ({ environmentId }: Props) => {
  return (
    <Prose
      onSubmit={async (editor) => {
        await submitMessage({
          environmentId,
          content: ProseDtoSchema.parse(editor.getJSON()),
        });
        editor.commands.clearContent();
      }}
    />
  );
};

export default ProseViewContainer;
