import React from "react";
import css from "./ImageGrid.module.css";

import i1 from "../../../public/5H8A3228.jpg";
import i2 from "../../../public/5H8A3348.jpg";
import i3 from "../../../public/5H8A3321.jpg";
import i4 from "../../../public/5H8A3445.jpg";

type Props = {};

const ImageGrid = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <div
        className={css["item"]}
        style={{ backgroundImage: `url(${i1.src})` }}
      />
      <div className={css["cols"]}>
        <div className={css["rows"]}>
          <div
            className={css["item"]}
            style={{
              backgroundPosition: `0 34%`,
              backgroundImage: `url(${i2.src})`,
            }}
          />
          <div
            className={css["item"]}
            style={{
              backgroundPosition: `70% 68%`,
              backgroundSize: "105%",
              backgroundImage: `url(${i3.src})`,
            }}
          />
        </div>
        <div
          className={css["item"]}
          style={{
            backgroundImage: `url(${i4.src})`,
            backgroundPosition: `40% 0`,
          }}
        />
      </div>
    </div>
  );
};

export default ImageGrid;
