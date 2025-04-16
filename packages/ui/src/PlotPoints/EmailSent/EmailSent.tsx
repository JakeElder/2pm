import React from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./EmailSent.module.css";

type Props = {
  reference: number;
  email: string;
};

const EmailSent = ({ reference, email }: Props) => {
  return (
    <StandardPlotPoint.Root>
      <StandardPlotPoint.Header>
        <StandardPlotPoint.HeadingAndReference>
          <StandardPlotPoint.Heading>󱡰 Email Sent</StandardPlotPoint.Heading>
          <StandardPlotPoint.Reference>{reference}</StandardPlotPoint.Reference>
        </StandardPlotPoint.HeadingAndReference>
      </StandardPlotPoint.Header>
      <StandardPlotPoint.Body>
        <span className={css["key"]}>email</span>:{" "}
        <span className={css["value"]}>{email}</span>
      </StandardPlotPoint.Body>
    </StandardPlotPoint.Root>
  );
};

export default EmailSent;
