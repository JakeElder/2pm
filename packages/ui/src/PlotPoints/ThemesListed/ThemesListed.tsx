import React from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./ThemesListed.module.css";
import { ThemeDto } from "@2pm/core";
import Theme from "../../Components/Theme";

/**
 * ThemesListed
 */

type Props = {
  themes: ThemeDto[];
};

const ThemesListed = ({ themes }: Props) => {
  return (
    <StandardPlotPoint.Root>
      <StandardPlotPoint.Header>
        <StandardPlotPoint.HeadingAndReference>
          <StandardPlotPoint.Heading>
            <div className={css["heading"]}> Themes Listed</div>
          </StandardPlotPoint.Heading>
        </StandardPlotPoint.HeadingAndReference>
      </StandardPlotPoint.Header>
      <StandardPlotPoint.Body>
        <ul className={css["themes"]}>
          {themes.map((theme) => {
            return (
              <li key={theme.id} className={css["theme"]}>
                <div className={css["theme-heading"]}>
                  <span className={css["name"]}>{theme.name}</span>
                </div>
                <Theme {...theme} />
              </li>
            );
          })}
        </ul>
      </StandardPlotPoint.Body>
    </StandardPlotPoint.Root>
  );
};

export default ThemesListed;
