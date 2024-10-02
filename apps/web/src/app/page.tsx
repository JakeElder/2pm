import css from "./page.module.css";
import universe from "@2pm/ui/images/universe.png";
import { Background, Terminal, Narrative } from "@2pm/ui";
import { FirstPersonMessage, ThirdPersonMessage } from "@2pm/ui/plot-points";
import TerminalPromptContainer from "@/components/server/TerminalPromptContainer";
import PlotPointsContainer from "@/components/server/PlotPointsContainer";

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
                  <Narrative.Root>
                    <PlotPointsContainer />
                    <Narrative.FirstPersonMessage>
                      <FirstPersonMessage>
                        My email address is jake@2pm.io
                      </FirstPersonMessage>
                    </Narrative.FirstPersonMessage>
                    <Narrative.ThirdPersonMessage>
                      <ThirdPersonMessage>
                        Sure, I’ve added the e-mail address to our wait list.
                      </ThirdPersonMessage>
                    </Narrative.ThirdPersonMessage>
                  </Narrative.Root>
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
