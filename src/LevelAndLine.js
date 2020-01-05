import React from "react";

function LevelAndLine({ lvl, line, lineToComplete }) {
  return (
    <div id="level_and_line" class="ui-text">
      <div className="lvl">
        <span class="title">LEVEL </span>
        <span class="value">{lvl}</span>
      </div>
      <div className="line">
        <span class="title">LINE </span>
        <span class="value">
          {line} / {lineToComplete}
        </span>
      </div>
    </div>
  );
}

export default LevelAndLine;
