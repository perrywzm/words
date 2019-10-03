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

const Status = {
  LOADING: 0,
  LOBBY: 1,
  STARTING: 2,
  RUNNING: 3,
  ENDED: 4
};

const defaultState = {
  typed: "",
  leftOver: "",
  error: false,
  errorCount: 0,
  time: -1
};

/**
 * Main Game Page business logic class that handles network I/O and
 * macro game state handling such as whether the game is in the lobby or has
 * already started
 */
class GamePage extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     gameStatus: Status.LOADING
  //   };
  // }
  constructor(props) {
    super(props);
    this.state = {
      isPlayerReady: false,
      // FOR GAME ONLY
      typed: "",
      leftOver: "",
      error: false,
      errorCount: 0,
      time: -1
    };
    this.autoMeasureInterval = null;
  }

  componentDidMount() {
    this.loadGame();
    console.log("Received this state", this.props.gameService.gameState);

    // Connect client to listen for websocket events
    this.props.gameService.listenForStart(this.handleGameStart);
    this.props.gameService.listenForMessages(this.handleGameMsg);
    this.props.gameService.listenForGameEnd(this.handleGameEnd);
  }

  loadGame = async () => {
    if (!this.props.gameService.gameState) {
      await this.props.gameService.sendGameRequest(
        this.props.match.params.id,
        ""
      );
    }

    const gameStatus = this.props.gameService.gameState.started
      ? Status.LOADING
      : Status.LOBBY;

    this.setState({
      gameStatus
    });
  };

  readyForGameStart = () => {
    this.props.gameService.readyGame(!this.state.isPlayerReady);
    this.setState(prev => ({ isPlayerReady: !prev.isPlayerReady }));
  };

  handleGameStart = () => {
    this.setState({
      leftOver: this.props.gameService.gameState.text,
      gameStatus: Status.STARTING,
      startingTimeLeft: 3
    });

    this.countdownFromState("startingTimeLeft", () =>
      this.setState({ gameStatus: Status.RUNNING, isPlayerReady: false })
    );
  };

  handleGameMsg = () => {
    if (!this.props.gameService.gameState.started) {
      this.setState({ gameStatus: Status.LOBBY });
      this.resetGameState();
    } else {
      this.setState({});
    }
  };

  handleGameEnd = () => {
    this.setState({ gameStatus: Status.ENDED, endingTimeLeft: 5 });
    this.countdownFromState("endingTimeLeft");
  };

  countdownFromState = (varName, onFinish = () => {}) => {
    const countdownCallback = () => {
      if (this.state[varName] <= 1) {
        onFinish();
        return clearInterval(interval);
      }
      this.setState(prevState => ({
        [varName]: prevState[varName] - 1
      }));
    };

    const interval = setInterval(countdownCallback, 1000);
  };

  /* ALL FUNCTIONS BELOW HERE SHOULD BE REFACTORED OUT*/
  resetGameState = () => {
    this.setState({ ...this.state, ...defaultState });
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
    if (e.keyCode === 16 || this.state.leftOver.length === 0) return;

    // Reset automeasurer time
    this.resetMeasurer();

    if (e.key === this.state.leftOver[0]) {
      const typed = this.state.typed + e.key;
      const leftOver = this.state.leftOver.slice(1);
      this.setState({ typed, leftOver, error: false });
      this.props.gameService.sendProgressUpdate(
        this.state.typed.length / this.props.gameService.gameState.text.length
      );

      // End game
      if (this.state.leftOver.length === 0) {
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

    return (
      (this.state.typed.split(" ").length /
        (new Date().getTime() - this.state.time)) *
      60000
    ).toFixed(0);
  };

  render() {
    const { typed, leftOver, error, gameStatus } = this.state;

    if (
      (gameStatus === Status.LOBBY || gameStatus === Status.STARTING) &&
      this.props.gameService.gameState
    ) {
      const player = this.props.gameService.gameState.players.filter(
        p => p.socketId === this.props.gameService.socketId
      )[0];

      return (
        <GameLobby
          onStart={this.readyForGameStart}
          gameId={this.props.gameService.gameState.id}
          onColorChange={this.props.gameService.sendColorChange}
          startingCounter={
            gameStatus !== Status.STARTING ? -1 : this.state.startingTimeLeft
          }
          player={player}
          isPlayerReady={this.state.isPlayerReady}
          players={this.props.gameService.gameState.players.filter(
            p => p.socketId !== this.props.gameService.socketId
          )}
        />
      );
    }

    const renderGameElement = () => (
      <>
        <div style={{ width: "100%" }}>
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
        {this.state.typed.length > 0 && this.state.leftOver.length === 0 ? (
          <Fireworks />
        ) : null}
      </>
    );

    return (
      <div className="game-container">
        {gameStatus === Status.RUNNING || gameStatus === Status.ENDED
          ? renderGameElement()
          : null}
        <Spinner show={gameStatus === Status.LOADING} />
        <GameEndingModal
          show={gameStatus === Status.ENDED}
          timeLeft={this.state.endingTimeLeft}
        />
      </div>
    );
  }
}

export default withRouter(withService(GamePage));
