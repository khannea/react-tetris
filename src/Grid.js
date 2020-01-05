import React from "react";

function Grid({ grid, piece }) {
  let projectionCoord = [];

  if (piece) {
    projectionCoord = getProjectionCoord(grid, piece);
  }

  return (
    <div id="grid" className="grid">
      {grid.map((line, y) => {
        return line.map((col, x) => {
          let classes = [];
          let value = 0;

          if (x === 0) {
            classes.push("first");
          }

          if (piece !== null) {
            if (piece.mergeData.indexOf(y + "_" + x) !== -1) {
              value = piece.color;
              classes.push("color" + value);
            } else if (projectionCoord.indexOf(y + "_" + x) !== -1) {
              value = piece.color;
              classes.push("projection");
            }
          }

          if (grid[y][x] > 0) {
            value = grid[y][x];
            classes.push("color" + value);
          }

          return (
            <span key={x + "_" + y} className={classes.join(" ")}>
              {/* {value} */}
            </span>
          );
        });
      })}
    </div>
  );
}

function getProjectionCoord(grid, piece) {
  let previousCordinate = [];
  let coordinate = [];

  for (let virtualY = piece.posY; virtualY < grid.length; virtualY++) {
    previousCordinate = coordinate;
    coordinate = [];

    for (let y = 0; y < piece.grid.length; y++) {
      for (let x = 0; x < piece.grid[0].length; x++) {
        if (piece.grid[y][x] > 0) {
          if (grid[y + virtualY] === undefined) {
            return previousCordinate;
          }

          if (grid[y + virtualY][x + piece.posX] > 0) {
            return previousCordinate;
          }

          coordinate.push(y + virtualY + "_" + (x + piece.posX));
        }
      }
    }
  }

  return coordinate;
}

export default Grid;
