import { MentionOptions } from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import MentionList from "../Components/MentionList/MentionList";
import tippy from "tippy.js";

const suggestionMentionHandler: MentionOptions["suggestion"] = {
  items: async ({ query }) => {
    return ["Lea Thompson", "Cyndi Lauper", "Tom Cruise", "Madonna"]
      .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  },

  render: () => {
    let component: any;
    let popup: any;

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect as any,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
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

export default suggestionMentionHandler;
