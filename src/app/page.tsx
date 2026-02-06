import Link from "next/link";

export const dynamic = "force-static";

function StartPage() {
  return (
    <div>
      <h1>Who Wants to Be a Millionaire?</h1>
      <p>Answer 12 questions. One wrong answer and the game is over.</p>
      <Link href="/quiz">Start</Link>
    </div>
  );
}

export default StartPage;
