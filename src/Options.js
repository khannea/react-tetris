import React from "react";

function Options({ actions }) {
  return (
    <div id="menu">
      <h1>Options</h1>
      Liste des options
      <button onClick={() => actions.launchMenu()}>Back</button>
    </div>
  );
}

export default Options;
