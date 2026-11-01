
// Progress.js

function Progress({
  index,
  numQuestions,
  points,
  maxPossiblePoints,
  answers,
}) {
  const answeredQuestions = answers.filter(
    answer => answer !== undefined
  ).length;

  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={answeredQuestions}
      />

      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>

      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
