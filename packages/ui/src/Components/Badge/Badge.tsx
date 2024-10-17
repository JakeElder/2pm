import React from "react";
import css from "./Badge.module.css";
import { IconCode } from "@2pm/data";
import Image, { StaticImageData } from "next/image";
import STARS from "../../../public/images/icons/STARS.png";
import LOCK from "../../../public/images/icons/LOCK.png";

type Props = {
  children: React.ReactNode;
  icon: IconCode;
};

const icons: Record<IconCode, StaticImageData> = {
  STARS,
  LOCK,
};

const Badge = ({ children, icon }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["icon"]}>
        <Image
          alt={icon}
          {...icons[icon]}
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
