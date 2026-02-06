import Link from "next/link";

type Props = {
  searchParams: Promise<{ won?: string; lost?: string }>;
};

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const won = params.won != null ? Number(params.won) : null;
  const lost = params.lost != null ? Number(params.lost) : null;

  if (won != null && !Number.isNaN(won)) {
    return (
      <div>
        <h1>You won!</h1>
        <p>Your prize: {won.toLocaleString()}</p>
        <Link href="/">Play again</Link>
      </div>
    );
  }

  if (lost != null && !Number.isNaN(lost)) {
    return (
      <div>
        <h1>Wrong answer</h1>
        <p>You lost on question {lost}.</p>
        <Link href="/">Try again</Link>
      </div>
    );
  }

  return (
    <div>
      <p>No result data. Start a new game.</p>
      <Link href="/">Start</Link>
    </div>
  );
}
