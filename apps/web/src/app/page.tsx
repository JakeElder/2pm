import css from "./page.module.css";
import universe from "@2pm/ui/images/universe.png";
import { Background, Terminal } from "@2pm/ui";
import TerminalPromptViewContainer from "@/components/client/TerminalPromptViewContainer";
import NarrativeContainer from "@/components/server/NarrativeContainer";

export default async function Home() {
  return (
    <Background src={universe.src}>
      <main className={css["main"]}>
        <div className={css["module"]}>
          <Terminal.Root>
            <Terminal.Foreground>
              <Terminal.AiAvatar code="IVAN" />
            </Terminal.Foreground>
            <Terminal.Main>
              <Terminal.Header handle="ivan" />
              <Terminal.Body>
                <Terminal.Narrative>
                  <NarrativeContainer environmentId={2} />
                </Terminal.Narrative>
              </Terminal.Body>
              <Terminal.Footer>
                <TerminalPromptViewContainer environmentId={2} userId={3} />
              </Terminal.Footer>
            </Terminal.Main>
          </Terminal.Root>
        </div>
      </main>
    </Background>
  );
}
