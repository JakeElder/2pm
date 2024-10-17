import React from "react";
import css from "./Badge.module.css";
import { IconCode } from "@2pm/data";
import STARS from "../../../public/images/icons/STARS.png";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
  icon: IconCode;
};

const Badge = ({ children, icon }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["icon"]}>
        <Image
          alt={icon}
          {...STARS}
          style={{
            width: 10,
            height: 10,
          }}
        />
      </div>
      <div className={css["label"]}>{children}</div>
    </div>
  );
};

export default Badge;
