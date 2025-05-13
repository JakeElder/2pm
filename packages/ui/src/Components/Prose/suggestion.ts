import { ReactRenderer } from "@tiptap/react";
import { MentionOptions } from "@tiptap/extension-mention";
import tippy from "tippy.js";
import MentionList from "./MentionList";
import { AiUserDto } from "@2pm/core";

const options: MentionOptions<AiUserDto>["suggestion"] = {
  render: () => {
    let component: any;
    let popup: ReturnType<typeof tippy>;

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        const root = document.querySelector("[data-root]");

        if (!root) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: () => {
            const x = props.clientRect?.();
            return x!;
          },
          appendTo: () => root,
          animation: false,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "auto-start",
          offset: [16, 16],
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

export default options;
