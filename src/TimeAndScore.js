import React from "react";

function TimeAndScore({ time, score }) {
  return (
    <div id="time_and_score" class="ui-text">
      <div className="time">
        <span class="title">TIME</span>
        <span class="value">{time}</span>
      </div>
      <div className="score">
        <span class="title">SCORE</span>
        <span class="value">{score}</span>
      </div>
    </div>
  );
}

export default TimeAndScore;
