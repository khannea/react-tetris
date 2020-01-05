import React from "react";

function Menu({ actions }) {
  console.log(actions);
  return (
    <div id="menu">
      <h1>TETRIS</h1>
      <button onClick={() => actions.launchGame()}>Play</button>
      <button onClick={() => actions.launchOptions()}>Options</button>
      <button>Classement</button>
    </div>
  );
}

export default Menu;
