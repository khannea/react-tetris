import React from "react";

function Menu({ actions }) {
  return (
    <div id="menu">
      <h1>TETRIS</h1>
      <button onClick={() => actions.launchGame()}>Play</button>
      <button onClick={() => actions.launchOptions()}>Options</button>
      <button onClick={() => actions.launchRank()}>Rank</button>
    </div>
  );
}

export default Menu;
