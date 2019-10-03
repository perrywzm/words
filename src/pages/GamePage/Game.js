import React, { Component } from "react";
import "./GamePage.css";

class Game extends Component {
  state = {
    typed: "",
    leftOver: "",
    error: false,
    errorCount: 0,
    time: -1
  };
  automeasureInterval = null;

  render() {
    return (
      <>
        <div className="fullwidth">
          <Stats
            showStats={this.state.time !== -1}
            wpm={this.getWpm()}
            errorCount={this.state.errorCount}
          />
          <TextArea
            typed={typed}
            leftOver={leftOver}
            error={error}
            handleKeyDown={this.handleKeyDown}
          />
        </div>
        <PlayersProgress
          socketId={this.props.gameService.socketId}
          players={this.props.gameService.gameState.players}
        />
        {this.state.leftOver.length === 0 ? <Fireworks /> : null}
      </>
    );
  }
}
