import React from "react";
import css from "./BibleVerse.module.css";

type Props = {
  verse: string;
  reference: number;
  children: React.ReactNode;
};

const BibleVerse = ({ verse, reference, children }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["header"]}>
        <div className={css["source-and-reference-number"]}>
          <div className={css["translation-and-verse"]}>
            <div className={css["translation"]}> The Bible</div>
            <div className={css["verse"]}>{verse}</div>
          </div>
          <div className={css["reference-number"]}>[{reference}]</div>
        </div>
      </div>
      <div className={css["body"]}>{children}</div>
    </div>
  );
};

export default BibleVerse;
