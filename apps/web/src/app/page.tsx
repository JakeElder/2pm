import Image from "next/image";
import ivan from "../../public/ivan.png";
import css from "./page.module.css";

export default function Home() {
  return (
    <main className={css["main"]}>
      <div className={css["module"]}>
        <div className={css["fg"]}>
          <div className={css["avatar"]}>
            <Image {...ivan} alt="Ivan" width={64} height={64} />
          </div>
        </div>
        <div className={css["bg"]}>
          <header className={css["header"]}>
            <span className={css["name"]}>Ivan</span>
          </header>
        </div>
      </div>
    </main>
  );
}
