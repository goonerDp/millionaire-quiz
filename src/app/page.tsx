import LinkButton from "@/components/LinkButton";

export const dynamic = "force-static";

function StartPage() {
  return (
    <div>
      <h1>Who Wants to Be a Millionaire?</h1>
      <p>Answer 12 questions. One wrong answer and the game is over.</p>
      <LinkButton href="/quiz">Start</LinkButton>
    </div>
  );
}

export default StartPage;
