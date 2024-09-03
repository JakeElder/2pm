import css from "./page.module.css";
import ivan from "@2pm/ui/images/ivan.png";
import universe from "@2pm/ui/images/universe.png";
import {
  Background,
  Terminal,
  Narrative,
  PromptInput,
  PromptSubmitButton,
} from "@2pm/ui";
import { FirstPersonMessage, ThirdPersonMessage } from "@2pm/ui/plot-points";
import prisma from "@/db";

export default async function Home() {
  const channels = await prisma.channel.findMany();
  const handle = "ivan";

  return (
    <Background src={universe.src}>
      <main className={css["main"]}>
        <div className={css["module"]}>
          <Terminal.Root>
            <Terminal.Foreground>
              <Terminal.Avatar {...ivan} alt={handle} />
            </Terminal.Foreground>
            <Terminal.Main>
              <Terminal.Header handle={handle} />
              <Terminal.Body>
                <Terminal.Narrative>
                  <Narrative.Root>
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
                <Terminal.Prompt>
                  <Terminal.Input>
                    <PromptInput />
                  </Terminal.Input>
                  <Terminal.SubmitButton>
                    <PromptSubmitButton />
                  </Terminal.SubmitButton>
                </Terminal.Prompt>
              </Terminal.Footer>
            </Terminal.Main>
          </Terminal.Root>
        </div>
      </main>
    </Background>
  );
}
