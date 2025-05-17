"use client";

import { getAiUsers, submitMessage } from "@/actions";
import { Environment, ProseDtoSchema } from "@2pm/core";
import { Prose } from "@2pm/ui/components";

type Props = {
  environmentId: Environment["id"];
};

const ProseViewContainer = ({ environmentId }: Props) => {
  return (
    <Prose
      suggestionItems={async ({ query }) => {
        const users = await getAiUsers({ environmentId });
        return users.filter((item) =>
          item.tag.toLowerCase().startsWith(query.toLowerCase()),
        );
      }}
      onSubmit={async (editor) => {
        await submitMessage({
          environmentId,
          json: ProseDtoSchema.parse(editor.getJSON()),
          text: editor.getText(),
        });
        editor.commands.clearContent();
      }}
    />
  );
};

export default ProseViewContainer;
