import React from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./ThemeCreated.module.css";
import { ThemeDto } from "@2pm/core";
import Theme from "../../Components/Theme";

/**
 * ThemeCreated
 */
type Props = {
  theme: ThemeDto;
};

const ThemeCreated = ({ theme }: Props) => {
  return (
    <StandardPlotPoint.Root>
      <StandardPlotPoint.Header>
        <StandardPlotPoint.HeadingAndReference>
          <StandardPlotPoint.Heading>
            <div className={css["heading"]}> Theme Created</div>
            <div className={css["name"]}>
              <span className={css["label"]}>[name]:</span>
              <span className={css["value"]}>{theme.name}</span>
            </div>
          </StandardPlotPoint.Heading>
        </StandardPlotPoint.HeadingAndReference>
      </StandardPlotPoint.Header>
      <StandardPlotPoint.Body>
        <Theme {...theme} />
      </StandardPlotPoint.Body>
    </StandardPlotPoint.Root>
  );
};

export default ThemeCreated;
