import { useState } from "react";
import audio from "./breakbeep.mp3";
import "./App.css";

function App() {
  const [displayTime, setDisplayTime] = useState(5);
  const [breakLength, setBreakLength] = useState(3);
  const [sessionLength, setSessionLength] = useState(5);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(new Audio(audio));

  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakLength <= 60 && amount < 0) {
        return;
      }
      setBreakLength((prev) => prev + amount);
    } else {
      if (sessionLength <= 60 && amount < 0) {
        return;
      }
      setSessionLength((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionLength + amount);
      }
    }
  };

  const contolTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakSound();
              onBreakVariable = true;
              setOnBreak(true);
              console.log(breakLength);
              return breakLength;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSound();
              onBreakVariable = false;
              setOnBreak(false);
              console.log(sessionLength, onBreakVariable);
              return sessionLength;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }

    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakLength(5 * 60);
    setSessionLength(25 * 60);
  };

  return (
    <div className="App">
      <div className="top-labels">
        <Length
          title={"Break Length"}
          changeTime={changeTime}
          type={"break"}
          time={breakLength}
          formatTime={formatTime}
        />
        <Length
          title={"Session Length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionLength}
          formatTime={formatTime}
        />
      </div>
      <div id="timer-label">
        <h3>{onBreak ? "Break" : "Session"}</h3>
        <time>{formatTime(displayTime)}</time>
        <button
          id="start_stop"
          className="btn-large #ffffff white"
          onClick={contolTime}
        >
          {timerOn ? (
            <i className="material-icons">pause_circle_filled</i>
          ) : (
            <i className="material-icons">play_circle_filled</i>
          )}
        </button>
        <button
          id="reset"
          className="btn-large #ffffff white"
          onClick={resetTime}
        >
          <i className="material-icons">autorenew</i>
        </button>
      </div>
    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <div id="label">
      <div className="title">{title}</div>
      <div className="inc-dec">
        <div id="decrement" onClick={() => changeTime(-60, type)}>
          <i className="fa fa-arrow-down fa-2x"></i>
        </div>
        <div className="time">{formatTime(time)}</div>
        <div id="increment" onClick={() => changeTime(60, type)}>
          <i className="fa fa-arrow-up fa-2x"></i>
        </div>
      </div>
    </div>
  );
}

export default App;
