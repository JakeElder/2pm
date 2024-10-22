import css from "./page.module.css";
import universe from "@2pm/ui/images/channels/UNIVERSE.png";
import { Background } from "@2pm/ui";
import CompanionOneToOneContainer from "@/components/server/CompanionOneToOneContainer";

export default async function Home() {
  return (
    <Background src={universe.src}>
      <main className={css["main"]}>
        <div className={css["module"]}>
          <CompanionOneToOneContainer />
        </div>
      </main>
    </Background>
  );
}
