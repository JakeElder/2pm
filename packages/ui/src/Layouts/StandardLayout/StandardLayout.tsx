"use client";

import React from "react";
import css from "./StandardLayout.module.css";
import SpaceList from "../../Components/SpaceList";
import PaneHeader from "../../Components/PaneHeader";
import BibleVerse from "../../PlotPoints/BibleVerse";
import EmailSent from "../../PlotPoints/EmailSent";
import TiptapEditor from "../../Components/TiptapEditor";
import Message from "../../PlotPoints/Message";
import InfoBar from "../../Components/InfoBar";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({}: RootProps) => {
  return (
    <div className={css["root"]}>
      <div className={css["main"]}>
        <div className={css["spaces"]}>
          <PaneHeader> Spaces</PaneHeader>
          <SpaceList />
        </div>
        <div className={css["reference-plot-points"]}>
          <div className={css["plot-point"]}>
            <EmailSent email="jake@2pm.io" reference={2} />
          </div>
          <div className={css["plot-point"]}>
            <BibleVerse verse="Ecclesiastes 3:6" reference={1}>
              A time to weep, and a time to laugh; a time to mourn, and a time
              to dance; A time to cast away stones, and a time to gather stones
              together; a time to embrace, and a time to refrain from embracing;
              A time to get, and a time to lose; a time to keep, and a time to
              cast away; A time to rend, and a time to sew; a time to keep
              silence, and a time to speak; A time to love, and a time to hate;
              a time of war, and a time of peace.
            </BibleVerse>
          </div>
        </div>
        <div className={css["conversation"]}>
          <div className={css["conversation-plot-points"]}>
            <Message type="HUMAN" user="jake">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Message>
            <Message type="AI" user="niko">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Message>
          </div>
          <div className={css["input-bar"]}>
            <TiptapEditor />
          </div>
        </div>
      </div>
      <div className={css["status-bar"]}></div>
      <InfoBar />
    </div>
  );
};
