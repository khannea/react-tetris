import React, { Component } from "react";

class Rank extends Component {
  state = {
    data: null
  };

  componentDidMount() {
    this.getDataFromDb();
  }

  getDataFromDb = () => {
    const req = new Request("http://localhost:4000/tetris_rank/get", {
      method: "GET",
      cache: "default"
    });
    fetch(req)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          data: data.sort(function(a, b) {
            return b.score - a.score;
          })
        });
      });
  };

  render() {
    return (
      <div id="rank">
        <h1>Ranking</h1>
        <div className="rank_table">
          <div className="rank_line">
            <div className="rank_col">NAME</div>
            <div className="rank_col">SCORE</div>
            <div className="rank_col">TIME</div>
          </div>

          {this.state.data !== null &&
            this.state.data.slice(0, 5).map(({ name, score, time, id }) => (
              <div className="rank_line" key={id}>
                <span className="rank_col">{name}</span>
                <span className="rank_col">{score}</span>
                <span className="rank_col">{time}</span>
              </div>
            ))}
        </div>
        <button onClick={() => this.props.actions.launchMenu()}>Back</button>
      </div>
    );
  }
}

export default Rank;
