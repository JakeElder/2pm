import React from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./BibleVerse.module.css";

type Props = {
  verse: string;
  reference: number;
  children: React.ReactNode;
};

const BibleVerse = ({ verse, reference, children }: Props) => {
  return (
    <StandardPlotPoint.Root>
      <StandardPlotPoint.Header>
        <StandardPlotPoint.HeadingAndReference>
          <StandardPlotPoint.Heading>
            <div className={css["translation"]}> The Bible</div>
            <div className={css["verse"]}>{verse}</div>
          </StandardPlotPoint.Heading>
          <StandardPlotPoint.Reference>{reference}</StandardPlotPoint.Reference>
        </StandardPlotPoint.HeadingAndReference>
      </StandardPlotPoint.Header>
      <StandardPlotPoint.Body>{children}</StandardPlotPoint.Body>
    </StandardPlotPoint.Root>
  );
};

export default BibleVerse;
