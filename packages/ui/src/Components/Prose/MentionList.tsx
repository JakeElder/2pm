import classNames from "classnames";
import css from "./MentionList.module.css";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { AiUserDto } from "@2pm/core";

export default forwardRef<{}, { items: AiUserDto[]; command: any }>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) {
        command({
          id: item.id,
          label: item.tag,
        });
      }
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (
          event.key === "ArrowUp" ||
          (["p", "k"].includes(event.key) && event.ctrlKey)
        ) {
          upHandler();
          return true;
        }

        if (
          event.key === "ArrowDown" ||
          (["n", "j"].includes(event.key) && event.ctrlKey)
        ) {
          downHandler();
          return true;
        }

        if (event.key === "Enter" || (event.key === "y" && event.ctrlKey)) {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <div className={css["dropdown-menu"]}>
        <Items
          items={items}
          onClick={(index: any) => selectItem(index)}
          selectedIndex={selectedIndex}
        />
      </div>
    );
  },
);

/*
 * Items
 */

type ItemsProps = {
  items: any[];
  onClick: any;
  selectedIndex: number;
};

export const Items = ({ items, onClick, selectedIndex }: ItemsProps) => {
  if (!items.length) {
    return <div className={css["no-results"]}>no results</div>;
  }
  return items.map((item, index) => (
    <button
      className={classNames({
        [css["button"]]: true,
        [css["selected"]]: index === selectedIndex,
      })}
      key={index}
      onClick={() => onClick(index)}
    >
      @{item.tag}
    </button>
  ));
};
