import React from "react";
import pieceCollection from "./pieceCollection";

function NextPiece({ index }) {
  let grid = pieceCollection[index];
  return (
    <div id="next_piece_wrapper" class="ui-text">
      <span class="title">NEXT PIECE</span>
      <div id="next_piece" className="grid">
        {grid.map((line, y) => {
          return line.map((col, x) => {
            let classes = [];

            if (x === 0) {
              classes.push("first");
            }

            if (grid[y][x] > 0) {
              classes.push("color" + (index + 1));
            }

            return (
              <span key={x + "_" + y} className={classes.join(" ")}></span>
            );
          });
        })}
      </div>
    </div>
  );
}

export default NextPiece;
