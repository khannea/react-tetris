import React from "react";

function TimeAndScore({ time, score }) {
  return (
    <div id="time_and_score" className="ui-text">
      <div className="time">
        <span className="title">TIME</span>
        <span className="value">{time}</span>
      </div>
      <div className="score">
        <span className="title">SCORE</span>
        <span className="value">{score}</span>
      </div>
    </div>
  );
}

export default TimeAndScore;
