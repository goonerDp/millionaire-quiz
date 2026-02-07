import LinkButton from "@/components/LinkButton";
import styles from "./page.module.scss";
import Image from "next/image";

export const dynamic = "force-static";

function StartPage() {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            className={styles.image}
            src="/images/thumb-up.svg"
            alt="Thumb up"
            loading="eager"
            fill
            sizes="(max-width: 1280px) 196px, 624px"
          />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>Who wants to be a millionaire?</h1>
          <LinkButton className={styles.button} href="/quiz">
            Start
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
