import React, { Component } from "react";
import Fireworks from "./components/Fireworks";
import PlayersProgress from "./components/PlayersProgress";
import Stats from "./components/Stats";
import TextArea from "./components/TextArea";
import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";
import { withService } from "../../services/GameService";
import { withRouter } from "react-router-dom";
import "./GamePage.css";
import GameLobby from "./GameLobby";
import GameEndingModal from "./components/GameEndingModal";
import { getRandomLightColor } from "../../util/colors";

const defaultState = {
  typed: "",
  error: false,
  errorCount: 0,
  time: -1,
  finalizedWPM: 0
};

/**
 * Main Game Page business logic class that handles network I/O and
 * macro game state handling such as whether the game is in the lobby or has
 * already started
 */
class Game extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     gameStatus: Status.LOADING
  //   };
  // }
  constructor(props) {
    super(props);
    this.state = {
      typed: "",
      error: false,
      errorCount: 0,
      time: -1,
      finalizedWPM: 0
    };
    this.autoMeasureInterval = null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.willResetGame) {
      this.resetGameState()
    }
  }

  resetGameState = () => {
    this.setState({ ...defaultState });
  };

  resetMeasurer = () => {
    clearTimeout(this.autoMeasureInterval);
    this.autoMeasureInterval = setTimeout(this.measureStats, 2000);
  };

  measureStats = () => {
    // Force re-render to reacquire WPM
    this.setState({});
    this.resetMeasurer();
  };

  handleKeyDown = e => {
    if (e.keyCode === 16 || this.props.leftOver.length === 0) return;

    // Reset automeasurer time
    this.resetMeasurer();

    if (e.key === this.props.leftOver[0]) {
      const typed = this.state.typed + e.key;
      const leftOver = this.props.onUpdateType(typed.length);
      this.setState({ typed, leftOver, error: false });

      // End game
      if (this.props.leftOver.length === 0) {
        this.setState({ finalizedWPM: this.getWpm() });
        clearTimeout(this.autoMeasureInterval);
      }

      // If initiating the game itself
      if (this.state.time === -1) {
        this.setState({ time: new Date().getTime() });
      }
    } else {
      this.setState(prevState => ({
        error: true,
        errorCount: prevState.errorCount + 1
      }));
    }
  };

  getWpm = () => {
    // Prevent recording wpm when zero words are typed
    if (this.state.typed.split(" ").length === 1) {
      return "Measuring...";
    }

    if (this.state.finalizedWPM) {
      return this.state.finalizedWPM;
    }

    return (
      (this.state.typed.split(" ").length /
        (new Date().getTime() - this.state.time)) *
      60000
    ).toFixed(0);
  };

  renderGameElement = () => {
    const { leftOver, playerSocketId, players } = this.props;
    const { time, error, errorCount, typed } = this.state;

    return (
      <>
        <div style={{ width: "100%" }}>
          <Stats
            showStats={time !== -1}
            wpm={this.getWpm()}
            errorCount={errorCount}
          />
          <TextArea
            typed={typed}
            leftOver={leftOver}
            error={error}
            handleKeyDown={this.handleKeyDown}
          />
        </div>
        <PlayersProgress socketId={playerSocketId} players={players} />
        {typed.length > 0 && leftOver.length === 0 ? <Fireworks /> : null}
      </>
    );
  };

  render() {
    return (
      <div className="game-container">
        {this.renderGameElement()}
        <GameEndingModal
          show={this.props.hasGameEnded}
          players={this.props.players}
          timeLeft={this.props.endingTimeLeft}
        />
      </div>
    );
  }
}

export default Game;
