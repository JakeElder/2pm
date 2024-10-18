import css from "./page.module.css";
import universe from "@2pm/ui/images/channels/UNIVERSE.png";
import { Background, CompanionOneToOneModule } from "@2pm/ui";
import CompanionOneToOneFooterContainer from "@/components/client/CompanionOneToOneFooterContainer";
import NarrativeContainer from "@/components/server/NarrativeContainer";

export default async function Home() {
  return (
    <Background src={universe.src}>
      <main className={css["main"]}>
        <div className={css["module"]}>
          <CompanionOneToOneModule.Root>
            <CompanionOneToOneModule.Avatar code="IVAN" />
            <CompanionOneToOneModule.Main>
              <CompanionOneToOneModule.Header handle="ivan" />
              <CompanionOneToOneModule.Body>
                <NarrativeContainer environmentId={2} />
              </CompanionOneToOneModule.Body>
              <CompanionOneToOneFooterContainer environmentId={2} userId={3} />
            </CompanionOneToOneModule.Main>
          </CompanionOneToOneModule.Root>
        </div>
      </main>
    </Background>
  );
}
