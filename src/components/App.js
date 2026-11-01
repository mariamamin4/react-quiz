
// App.js

import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";
import PreviousButton from "./PreviousButton";

const SECS_PER_QUESTION = 30;

const initialState = {
  allQuestions: [],
  questions: [],
  status: "loading",
  index: 0,
  answers: [],
  points: 0,
  highscore: 0,
  difficulty: "easy",
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        allQuestions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "selectDifficulty":
      return {
        ...state,
        difficulty: action.payload,
      };

    case "start": {
      const selectedQuestions = state.allQuestions.filter(
        question => question.difficulty === state.difficulty
      );

      return {
        ...state,
        questions: selectedQuestions,
        status: "active",
        index: 0,
        answers: [],
        points: 0,
        secondsRemaining:
          selectedQuestions.length * SECS_PER_QUESTION,
      };
    }

    case "newAnswer": {
      const answers = [...state.answers];

      answers[state.index] = action.payload;

      const points = answers.reduce((total, answer, i) => {
        return total +
          (answer === state.questions[i].correctOption
            ? state.questions[i].points
            : 0);
      }, 0);

      return {
        ...state,
        answers,
        points,
      };
    }

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
      };

    case "previousQuestion":
      return {
        ...state,
        index: state.index - 1,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore
            ? state.points
            : state.highscore,
      };

    case "restart":
      return {
        ...initialState,
        allQuestions: state.allQuestions,
        status: "ready",
        difficulty: state.difficulty,
        highscore: state.highscore,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status:
          state.secondsRemaining === 1
            ? "finished"
            : state.status,
        highscore:
          state.secondsRemaining === 1 && state.points > state.highscore
            ? state.points
            : state.highscore,
      };

    default:
      throw new Error("Action Unknown");
  }
}

export default function App() {
  const [
    {
      allQuestions,
      questions,
      status,
      index,
      answers,
      points,
      highscore,
      difficulty,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;

  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  const answer = answers[index] ?? null;

  const availableQuestionCount = allQuestions.filter(
    question => question.difficulty === difficulty
  ).length;

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then(res => res.json())
      .then(data => dispatch({ type: "dataReceived", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}

        {status === "error" && <Error />}

        {status === "ready" && (
          <StartScreen
            numQuestions={availableQuestionCount}
            dispatch={dispatch}
            difficulty={difficulty}
          />
        )}

        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answers={answers}
            />

            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <Footer>
              <Timer
                dispatch={dispatch}
                secondsRemaining={secondsRemaining}
              />

              <PreviousButton
                dispatch={dispatch}
                index={index}
              />

              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
