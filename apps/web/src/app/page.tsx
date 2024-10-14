import css from "./page.module.css";
import universe from "@2pm/ui/images/universe.png";
import { Background, Terminal } from "@2pm/ui";
import TerminalPromptViewContainer from "@/components/client/TerminalPromptViewContainer";
import NarrativeContainer from "@/components/server/NarrativeContainer";
import AuthGate from "@/components/server/AuthGate";
import { getSession } from "@/api/sessions";

export default async function Home() {
  const s = await getSession("550e8400-e29b-41d4-a716-446655440000");
  return <pre>{JSON.stringify(s, null, 2)}</pre>;

  return (
    <AuthGate>
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
    </AuthGate>
  );
}
