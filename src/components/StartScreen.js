
// StartScreen.js

function StartScreen({ numQuestions, dispatch, difficulty }) {
  return (
    <div className="start">
      <h2>Welcome to React quiz</h2>

      <h3>{numQuestions} questions to test your React mastery</h3>

      <label htmlFor="difficulty">Choose difficulty:</label>

      <select
        id="difficulty"
        value={difficulty}
        onChange={e =>
          dispatch({
            type: "selectDifficulty",
            payload: e.target.value,
          })
        }
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
