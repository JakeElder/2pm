import css from "./page.module.css";
import ivan from "@2pm/ui/images/ivan.png";
import universe from "@2pm/ui/images/universe.png";
import { Background, Terminal } from "@2pm/ui";

export default function Home() {
  return (
    <Background src={universe.src}>
      <main className={css["main"]}>
        <div className={css["module"]}>
          <Terminal.Root>
            <Terminal.Foreground>
              <Terminal.Avatar {...ivan} alt="Ivan" />
            </Terminal.Foreground>
            <Terminal.Main>
              <Terminal.Header name="Ivan" />
              <Terminal.Body>
                <Terminal.Narrative />
              </Terminal.Body>
              <Terminal.Footer />
            </Terminal.Main>
          </Terminal.Root>
        </div>
      </main>
    </Background>
  );
}
