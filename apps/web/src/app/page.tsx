import css from "./page.module.css";
import universe from "@2pm/ui/images/universe.png";
import { Background, Terminal } from "@2pm/ui";
import TerminalPromptContainer from "@/components/server/TerminalPromptContainer";
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
                  <NarrativeContainer environment={{ id: 2 }} />
                </Terminal.Narrative>
              </Terminal.Body>
              <Terminal.Footer>
                <TerminalPromptContainer />
              </Terminal.Footer>
            </Terminal.Main>
          </Terminal.Root>
        </div>
      </main>
    </Background>
  );
}
