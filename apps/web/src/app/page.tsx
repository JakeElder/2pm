import css from "./page.module.css";
import universe from "@2pm/ui/images/universe.png";
import { Background, Terminal, Narrative } from "@2pm/ui";
import TerminalPromptContainer from "@/components/server/TerminalPromptContainer";
import NarrativeContainer from "@/components/server/NarrativeContainer";

export default async function Home() {
  const handle = "ivan";

  return (
    <Background src={universe.src}>
      <main className={css["main"]}>
        <div className={css["module"]}>
          <Terminal.Root>
            <Terminal.Foreground>
              <Terminal.AiAvatar code="IVAN" />
            </Terminal.Foreground>
            <Terminal.Main>
              <Terminal.Header handle={handle} />
              <Terminal.Body>
                <Terminal.Narrative>
                  <NarrativeContainer />
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
