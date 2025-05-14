import React from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./BibleVerseReference.module.css";

type Props = {
  verse: string;
  children: React.ReactNode;
};

const BibleVerseReference = ({ verse, children }: Props) => {
  return (
    <StandardPlotPoint.Root>
      <StandardPlotPoint.Header>
        <StandardPlotPoint.HeadingAndReference>
          <StandardPlotPoint.Heading>
            <div className={css["heading"]}> Bible Reference</div>
            <div className={css["verse"]}>{verse}</div>
          </StandardPlotPoint.Heading>
        </StandardPlotPoint.HeadingAndReference>
      </StandardPlotPoint.Header>
      <StandardPlotPoint.Body>{children}</StandardPlotPoint.Body>
    </StandardPlotPoint.Root>
  );
};

export default BibleVerseReference;
