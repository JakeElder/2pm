import React from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./PaliCanonReference.module.css";

type Props = {
  basket: string;
  author: string;
  children: React.ReactNode;
};

const PaliCanonReference = ({ basket, author, children }: Props) => {
  return (
    <StandardPlotPoint.Root>
      <StandardPlotPoint.Header>
        <StandardPlotPoint.HeadingAndReference>
          <StandardPlotPoint.Heading>
            <div className={css["heading"]}> Pali Canon Reference</div>
            <div className={css["basket-and-author"]}>
              <div className={css["basket"]}>
                <span className={css["label"]}>[basket]:</span>
                <span className={css["value"]}>{basket}</span>
              </div>
              <div className={css["author"]}>
                <span className={css["label"]}>[author]:</span>
                <span className={css["value"]}>{author}</span>
              </div>
            </div>
          </StandardPlotPoint.Heading>
        </StandardPlotPoint.HeadingAndReference>
      </StandardPlotPoint.Header>
      <StandardPlotPoint.Body>{children}</StandardPlotPoint.Body>
    </StandardPlotPoint.Root>
  );
};

export default PaliCanonReference;
