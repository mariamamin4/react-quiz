import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining,points }) {
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick",payload:points });
      }, 1000);

      return () => clearInterval(id); //Cleanup function
    },
    [dispatch, points],
  );
  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins} : {seconds < 10 && "0"}
      {seconds}
    </div>
  );
}

export default Timer;
