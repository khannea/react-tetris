import React, { Component } from "react";
import Grid from "./Grid";
import pieceCollection from "./pieceCollection";
import NextPiece from "./NextPiece";
import LevelAndLine from "./LevelAndLine";
import TimeAndScore from "./TimeAndScore";
import keyChoosen from "./keyChoosen";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

class Game extends Component {
  state = {
    grid: null,
    gridHeight: 20,
    gridWidth: 10,
    piece: null,
    score: 0,
    lvl: 0,
    nextPieceIndex: null,
    lostGame: false,
    numberLine: 0,
    numberLineToLevelUp: 5,
    options: null
  };

  componentDidMount() {
    let options = JSON.parse(localStorage.getItem("tetris_options"));
    if (options === null || options === "") {
      options = keyChoosen;
    }

    this.setState({ options }, () => {
      //option rdy. Init Game
      this.initGame();
    });
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.keyupActions);
    window.removeEventListener("keydown", this.keydownActions);
    window.removeEventListener("touchstart", this.keyupActions);
    window.removeEventListener("touchstop", this.keydownActions);
  }

  executeKeyCode = keyCode => {
    console.log("j'execute");
    switch (keyCode) {
      case this.state.options.choosenKeys["right"]:
        this.pieceMoveX(1);
        break;
      case this.state.options.choosenKeys["left"]:
        this.pieceMoveX(-1);
        break;
      case this.state.options.choosenKeys["bottom"]:
        this.pieceMoveY(1);
        break;
      case this.state.options.choosenKeys["rotateAntiHour"]:
        this.pieceRotate(-1);
        break;
      case this.state.options.choosenKeys["rotateHour"]:
        this.pieceRotate(1);
        break;
      default:
        break;
    }
  };

  keyupActions = e => {
    if (this.key_pressed.length < 2) {
      this.multiple_key = false;
    }
    let index = this.key_pressed.indexOf(e.keyCode);
    if (index > -1) {
      this.key_pressed.splice(index, 1);
    }
  };

  keydownActions = e => {
    if (this.key_pressed.indexOf(e.keyCode) === -1) {
      this.key_pressed.push(e.keyCode);
    }
    if (this.key_pressed.length > 1) {
      this.key_pressed.forEach((keyCode, index) => {
        if (this.multiple_key === false && index === 0) {
          this.multiple_key = true;
        } else {
          this.executeKeyCode(keyCode);
        }
      });
    } else {
      this.executeKeyCode(this.key_pressed[0]);
    }
  };

  touchstartActions = e => {
    if (this.key_pressed.length > 1) {
      this.key_pressed.forEach((keyCode, index) => {
        if (this.multiple_key === false && index === 0) {
          this.multiple_key = true;
        } else {
          this.executeKeyCode(keyCode);
        }
      });
    } else {
      this.executeKeyCode(this.key_pressed[0]);
    }
  };

  touchendActions = e => {
    clearInterval(this.touchingScreen);
    if (this.key_pressed.length > 0) {
      this.key_pressed = [];
    }
  };

  initGame = () => {
    this.baseIntervalTimer = 1000;
    this.globalTimer = 0;
    this.touchingScreen = false;

    setInterval(() => {
      this.globalTimer++;
    }, 1000);

    this.key_pressed = [];
    this.multiple_key = false;

    window.addEventListener("keydown", this.keydownActions);
    window.addEventListener("keyup", this.keyupActions);

    window.addEventListener("touchstart", () => {
      this.touchstartActions();
      this.touchingScreen = setInterval(this.touchstartActions, 50);
    });
    window.addEventListener("touchend", this.touchendActions);

    this.setState(
      {
        grid: this.buildGrid(),
        nextPieceIndex: this.generateNextPiece(),
        numberLine: 0,
        lvl: 1,
        lostGame: false,
        score: 0
      },
      () => {
        this.generatePiece();

        this.launchTimer();
      }
    );
  };

  lostGame = () => {
    clearInterval(this.timer);

    this.setState({ lostGame: true });

    window.removeEventListener("keyup", this.keyupActions);
    window.removeEventListener("keydown", this.keydownActions);
  };

  //TIMER FONCTION
  launchTimer = () => {
    // this.timer = setInterval(() => {
    //   this.pieceMoveY(1);
    // }, this.convertLvlToTime());
  };

  convertLvlToTime = () => {
    let lvl = this.state.lvl;
    if (lvl === 0) {
      return this.baseIntervalTimer;
    } else {
      return this.baseIntervalTimer * Math.pow(65 / 100, lvl);
    }
  };

  convertLineToScore = line => {
    return line * line * 100;
  };

  convertScoreToLvl = score => {
    let lvl = 0;
    if (score >= 100) {
      lvl = 1;
    }
    if (score >= 300) {
      lvl = 2;
    }
    if (score >= 500) {
      lvl = 3;
    }
    return lvl;
  };

  // GRID FUNCTIONS
  buildGrid = () => {
    let grid = [];

    for (let y = 0; y < this.state.gridHeight; y++) {
      let line = [];
      for (let x = 0; x < this.state.gridWidth; x++) {
        line.push(0);
      }
      grid.push(line);
    }
    return grid;
  };

  mergePieceToGrid = () => {
    const virtualGrid = this.state.grid;
    let score = this.state.score;

    this.state.piece.mergeData.forEach(element => {
      let mergeCoord = element.split("_");

      virtualGrid[mergeCoord[0]][mergeCoord[1]] = this.state.piece.color;
    });
    this.setState({ grid: virtualGrid, piece: null }, () => {
      let numberLine = this.cleanGrid();

      score += this.convertLineToScore(numberLine);
      numberLine += this.state.numberLine;
      if (numberLine >= this.state.numberLineToLevelUp) {
        this.setState({ lvl: this.state.lvl + 1 });
        clearInterval(this.timer);
        this.launchTimer();
        numberLine -= this.state.numberLineToLevelUp;
      }
      // let lvl = this.convertScoreToLvl(score);
      this.setState({ score, numberLine });
      this.generatePiece();
    });
  };

  cleanGrid = () => {
    let cleanGrid = [];
    let nbrLineCompleted = 0;
    for (let y = 0; y < this.state.gridHeight; y++) {
      let lineCompleted = true;
      for (let x = 0; x < this.state.gridWidth; x++) {
        if (this.state.grid[y][x] === 0) {
          lineCompleted = false;
        }
      }

      if (lineCompleted === false) {
        cleanGrid.push(this.state.grid[y]);
      } else {
        cleanGrid.unshift(this.makeCleanLine(this.state.gridWidth));
        nbrLineCompleted += 1;
      }
    }
    this.setState({ grid: cleanGrid });
    return nbrLineCompleted;
  };

  //PIECE FUNCTION

  generateNextPiece() {
    return Math.floor(Math.random() * pieceCollection.length);
  }

  generatePiece = () => {
    let piece = {};
    piece.posY = -1;

    let choice = this.state.nextPieceIndex;
    piece.posX = Math.floor((this.state.gridWidth - 3) / 2);

    piece.grid = pieceCollection[choice];
    piece.mergeData = [];
    piece.color = choice + 1;

    let coord = this.pieceCanBeMove(piece);

    if (coord !== false) {
      piece.mergeData = coord;
      this.setState({ piece, nextPieceIndex: this.generateNextPiece() });
    } else {
      //FIN DU JEU
      this.lostGame();
    }
  };

  pieceCanBeMove = piece => {
    let coord = [];

    for (let y = 0; y < piece.grid.length; y++) {
      for (let x = 0; x < piece.grid[0].length; x++) {
        if (piece.grid[y][x] > 0) {
          if (this.state.grid[y + piece.posY] === undefined) {
            return false;
          }
          if (this.state.grid[y + piece.posY][x + piece.posX] > 0) {
            return false;
          }
          if (this.state.grid[y + piece.posY][x + piece.posX] === undefined) {
            return false;
          }
          coord.push(y + piece.posY + "_" + (x + piece.posX));
        }
      }
    }
    return coord;
  };

  pieceMoveX = x => {
    let piece = { ...this.state.piece };

    if (piece === null) {
      return false;
    }
    piece.posX += x;

    let coord = this.pieceCanBeMove(piece);

    if (coord !== false) {
      piece.mergeData = coord;
      this.setState({ piece });
    }
  };

  pieceMoveY = y => {
    let piece = { ...this.state.piece };

    if (piece === null) {
      return false;
    }
    piece.posY += y;

    let coord = this.pieceCanBeMove(piece);

    if (coord !== false) {
      piece.mergeData = coord;
      this.setState({ piece });
    } else {
      this.mergePieceToGrid();
    }
  };

  pieceRotate = r => {
    let piece = { ...this.state.piece };

    if (piece === null) {
      return false;
    }

    let newGrid = [];

    if (r === 1) {
      let x = 0;
      let y = piece.grid.length - 1;

      while (x < piece.grid[0].length) {
        let line = [];

        while (y >= 0) {
          line.push(piece.grid[y][x]);
          y--;
        }
        newGrid.push(line);
        x++;
        y = piece.grid.length - 1;
      }
    } else {
      let y = 0;
      let x = piece.grid[0].length - 1;

      while (x >= 0) {
        let line = [];

        while (y < piece.grid.length) {
          line.push(piece.grid[y][x]);
          y++;
        }
        newGrid.push(line);
        x--;
        y = 0;
      }
    }

    piece.grid = newGrid;

    let coord = this.pieceCanBeMove(piece);

    if (coord !== false) {
      piece.mergeData = coord;
      this.setState({ piece });
    } else {
      //CAN T ROTATE
      if (piece.posX < 0) {
        piece.posX = 0;
        coord = this.pieceCanBeMove(piece);
        if (coord !== false) {
          piece.mergeData = coord;
          this.setState({ piece });
        }
      } else if (
        piece.grid[0].length + piece.posX >=
        this.state.gridWidth - 1
      ) {
        piece.posX -= piece.grid[0].length + piece.posX - this.state.gridWidth;
        coord = this.pieceCanBeMove(piece);
        if (coord !== false) {
          piece.mergeData = coord;
          this.setState({ piece });
        }
      } else if (piece.posY === -1) {
        piece.posY += 1;
        coord = this.pieceCanBeMove(piece);
        if (coord !== false) {
          piece.mergeData = coord;
          this.setState({ piece });
        }
      }
    }
  };

  makeCleanLine(width) {
    let line = [];
    for (let x = 0; x < width; x++) {
      line.push(0);
    }
    return line;
  }

  toHHMMSS = function(time) {
    var sec_num = time;

    var minutes = Math.floor(sec_num / 60);
    var seconds = sec_num - minutes * 60;

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  };

  render() {
    if (this.state.lostGame) {
      return (
        <div id="wrapper_lost_game">
          <h1>GAME OVER</h1>
          <div className="ui-text">
            <span className="ui-text">Score : {this.state.score}</span>
          </div>
          <div className="ui-text">
            {" "}
            <span className="title">
              Time : {this.toHHMMSS(this.globalTimer)}
            </span>
          </div>

          <div className="wrapper_button">
            <button onClick={() => this.initGame()}>Play again</button>
            <button onClick={() => this.props.actions.launchMenu()}>
              Back
            </button>
          </div>
        </div>
      );
    }
    return (
      <div id="wrapper_grid">
        <TimeAndScore
          time={this.toHHMMSS(this.globalTimer)}
          score={this.state.score}
        />
        <LevelAndLine
          lvl={this.state.lvl}
          line={this.state.numberLine}
          lineToComplete={this.state.numberLineToLevelUp}
        />
        {this.state.nextPieceIndex !== null && (
          <NextPiece index={this.state.nextPieceIndex} />
        )}

        {this.state.grid !== null && (
          <Grid grid={this.state.grid} piece={this.state.piece} />
        )}

        {/* <MobileView> */}
        <div id="mobile_key">
          <button
            id="mobileRotateHour"
            onTouchStart={e => {
              this.key_pressed.push(this.state.options.choosenKeys.rotateHour);
            }}
          ></button>
          <button
            id="mobileBottom"
            onTouchStart={e => {
              this.key_pressed.push(this.state.options.choosenKeys.bottom);
            }}
          ></button>
        </div>
        {/* </MobileView> */}
      </div>
    );
  }
}

export default Game;
