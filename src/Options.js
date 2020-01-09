import React, { Component } from "react";
import Modal from "./Modal";
import keyChoosen from "./keyChoosen";
class Options extends Component {
  state = {
    options: {
      choosenKeys: {
        bottom: 40,
        left: 37,
        right: 39,
        rotateHour: 68,
        rotateAntiHour: 64
      }
    },
    keyPressed: false,
    modalActive: false
  };

  componentDidMount() {
    let options = JSON.parse(localStorage.getItem("tetris_options"));
    if (options === null || options === "") {
      options = keyChoosen;
    }

    this.setState({ options }, () => {
      window.addEventListener("keydown", this.keydownAction);
    });
  }

  keydownAction = e => {
    if (this.state.keyPressed !== false) {
      let choosenKeys = this.state.options.choosenKeys;
      choosenKeys[this.state.keyPressed] = e.keyCode;
      this.setState(
        { choosenKeys, keyPressed: false, modalActive: false },
        () => {}
      );
    }
  };

  componentWillUnmount() {
    localStorage.setItem("tetris_options", JSON.stringify(this.state.options));
    window.removeEventListener("keydow", this.keydownAction);
  }

  updateTouch = k => {
    this.setState({ keyPressed: k, modalActive: true });
  };

  render() {
    return (
      <div id="options">
        <Modal active={this.state.modalActive} />

        <h1>Options</h1>
        {Object.keys(this.state.options.choosenKeys).map(t => {
          return (
            <button onClick={() => this.updateTouch(t)} key={"key_" + t}>
              {t}
            </button>
          );
        })}
        <button onClick={() => this.props.actions.launchMenu()}>Back</button>
      </div>
    );
  }
}

export default Options;
