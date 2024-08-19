import css from "./page.module.css";
import ivan from "@2pm/ui/images/ivan.png";
import { Terminal } from "@2pm/ui";

export default function Home() {
  return (
    <main className={css["main"]}>
      <Terminal.Root>
        <Terminal.Foreground>
          <Terminal.Avatar {...ivan} alt="Ivan" />
        </Terminal.Foreground>
        <Terminal.Main>
          <Terminal.Header name="Ivan" />
        </Terminal.Main>
      </Terminal.Root>
    </main>
  );
}
