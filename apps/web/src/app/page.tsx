import ivan from "../../public/ivan.png";
import css from "./page.module.css";
import { Terminal } from "@2pm/ui";

export default function Home() {
  return (
    <main className={css["main"]}>
      <Terminal.Root>
        <Terminal.Foreground>
          <Terminal.Avatar image={ivan} alt="Ivan" />
        </Terminal.Foreground>
        <Terminal.Main>
          <Terminal.Header name="Ivan" />
        </Terminal.Main>
      </Terminal.Root>
    </main>
  );
}
