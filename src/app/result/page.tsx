import LinkButton from "@/components/LinkButton";
import styles from "./page.module.scss";
import Image from "next/image";
import { createLoader, parseAsInteger } from "nuqs/server";
import type { SearchParams } from "nuqs/server";
import { currencyFormatter } from "@/consts";

const resultSearchParams = {
  earned: parseAsInteger.withDefault(0),
};
const loadResultSearchParams = createLoader(resultSearchParams);

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ResultPage({ searchParams }: Props) {
  const { earned } = await loadResultSearchParams(searchParams);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {earned !== 0 && (
          <div className={styles.imageWrapper}>
            <Image
              className={styles.image}
              src="/images/thumb-up.svg"
              alt="Thumb up"
              fill
              sizes="(max-width: 1280px) 196px, 624px"
            />
          </div>
        )}
        <div className={styles.content}>
          <p className={styles.description}>Total score:</p>
          <h1 className={styles.title}>
            {currencyFormatter.format(earned)} earned
          </h1>
          <LinkButton className={styles.button} href="/quiz">
            Play again
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
