import css from "./page.module.css";
import universe from "@2pm/ui/images/universe.png";
import { Background, Module } from "@2pm/ui";
import ModulePromptViewContainer from "@/components/client/ModulePromptViewContainer";
import NarrativeContainer from "@/components/server/NarrativeContainer";
import AuthGate from "@/components/server/AuthGate";
import { getSession } from "@/api/sessions";

export default async function Home() {
  return (
    <Background src={universe.src}>
      <main className={css["main"]}>
        <div className={css["module"]}>
          <Module.Root>
            <Module.Foreground>
              <Module.AiAvatar code="IVAN" />
            </Module.Foreground>
            <Module.Main>
              <Module.Header handle="ivan" />
              <Module.Body>
                <Module.Narrative>
                  <NarrativeContainer environmentId={2} />
                </Module.Narrative>
              </Module.Body>
              <Module.Footer>
                <ModulePromptViewContainer environmentId={2} userId={3} />
              </Module.Footer>
            </Module.Main>
          </Module.Root>
        </div>
      </main>
    </Background>
  );
}
