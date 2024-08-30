import css from "./page.module.css";
import ivan from "@2pm/ui/images/ivan.png";
import universe from "@2pm/ui/images/universe.png";
import { Background, Terminal } from "@2pm/ui";
import prisma from "@/db";

export default async function Home() {
  const channels = await prisma.channel.findMany();

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
                <Terminal.Narrative>
                  <pre className={css["pre"]}>
                    {JSON.stringify(channels, null, 2)}
                  </pre>
                </Terminal.Narrative>
              </Terminal.Body>
              <Terminal.Footer />
            </Terminal.Main>
          </Terminal.Root>
        </div>
      </main>
    </Background>
  );
}
