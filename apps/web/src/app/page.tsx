import {
  InfoBar,
  PaneHeader,
  SpaceList,
  Theme,
  TiptapEditor,
} from "@2pm/ui/components";
import { StandardLayout } from "@2pm/ui/layouts";
import { BibleVerse, EmailSent, Message } from "@2pm/ui/plot-points";

export default async function Home() {
  return (
    <Theme>
      <StandardLayout.Root>
        <StandardLayout.Main>
          <StandardLayout.Spaces>
            <PaneHeader> Spaces</PaneHeader>
            <SpaceList />
          </StandardLayout.Spaces>
          <StandardLayout.ReferencePlotPoints>
            <StandardLayout.PlotPoint>
              <EmailSent email="jake@2pm.io" reference={2} />
            </StandardLayout.PlotPoint>
            <StandardLayout.PlotPoint>
              <BibleVerse verse="Ecclesiastes 3:6" reference={1}>
                A time to weep, and a time to laugh; a time to mourn, and a time
                to dance; A time to cast away stones, and a time to gather
                stones together; a time to embrace, and a time to refrain from
                embracing; A time to get, and a time to lose; a time to keep,
                and a time to cast away; A time to rend, and a time to sew; a
                time to keep silence, and a time to speak; A time to love, and a
                time to hate; a time of war, and a time of peace.
              </BibleVerse>
            </StandardLayout.PlotPoint>
          </StandardLayout.ReferencePlotPoints>
          <StandardLayout.Conversation>
            <StandardLayout.ConversationPlotPoints>
              <Message type="HUMAN" user="jake">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </Message>
              <Message type="AI" user="niko">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </Message>
            </StandardLayout.ConversationPlotPoints>
            <StandardLayout.InputBar>
              <TiptapEditor />
            </StandardLayout.InputBar>
          </StandardLayout.Conversation>
        </StandardLayout.Main>
        <StandardLayout.StatusBar />
        <StandardLayout.InfoBar>
          <InfoBar />
        </StandardLayout.InfoBar>
      </StandardLayout.Root>
    </Theme>
  );
}
