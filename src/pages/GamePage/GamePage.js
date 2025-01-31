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
import Game from "./Game";
import GameEndingModal from "./components/GameEndingModal";
import { getRandomLightColor } from "../../util/colors";

const Status = {
  LOADING: 0,
  LOBBY: 1,
  STARTING: 2,
  RUNNING: 3,
  ENDED: 4
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
      leftOver: "",
      willResetGame: false,
    };
    this.autoMeasureInterval = null;
  }

  componentDidMount() {
    this.loadGame();
    // console.log("Received this state", this.props.gameService.gameState);

    // Connect client to listen for websocket events
    this.props.gameService.listenForStart(this.handleGameStart);
    this.props.gameService.listenForMessages(this.handleGameMsg);
    this.props.gameService.listenForGameEnd(this.handleGameEnd);
  }

  /* GAME SERVICE METHODS */
  loadGame = async () => {
    if (!this.props.gameService.gameState) {
      await this.props.gameService.sendGameRequest(
        this.props.match.params.id,
        ""
      );
    }

    if (this.props.gameService.gameState.started) {
      this.setState({
        gameStatus: Status.RUNNING,
        leftOver: this.props.gameService.gameState.text
      });
    } else {
      this.setState({
        gameStatus: Status.LOBBY
      });
    }
  };

  readyForGameStart = () => {
    if (this.state.gameStatus === Status.STARTING) return;

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
      this.setState({ gameStatus: Status.LOBBY, willResetGame: true });
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

  /* GAME SERVICE UPDATE METHODS FOR THE GAME-RUNNING PAGE */
  onUpdateType = typedLength => {
    const leftOver = this.state.leftOver.slice(1);
    this.setState(prev => ({ leftOver }));

    this.props.gameService.sendProgressUpdate(
      typedLength / this.props.gameService.gameState.text.length
    );
    return leftOver;
  };

  /* CONDITIONAL RENDERING METHODS */
  renderGameLobby = () => {
    // Guard condition against unloaded games
    if (!this.props.gameService.gameState) return;

    const { gameStatus } = this.state;

    if (gameStatus === Status.LOBBY || gameStatus === Status.STARTING) {
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
  };

  renderGame = () => {
    const { gameStatus, leftOver } = this.state;
    if (!(gameStatus === Status.RUNNING || gameStatus === Status.ENDED)) return;

    return (
      <Game
        hasGameEnded={gameStatus === Status.ENDED}
        endingTimeLeft={this.state.endingTimeLeft}
        leftOver={leftOver}
        onUpdateType={this.onUpdateType}
        playerSocketId={this.props.gameService.socketId}
        players={this.props.gameService.gameState.players}
      />
    );
  };

  renderSpinningLoader = () => (
    <Spinner show={this.state.gameStatus === Status.LOADING} />
  );

  render() {
    return (
      <>
        {this.renderGameLobby()}
        {this.renderGame()}
        {this.renderSpinningLoader()}
      </>
    );
  }
}

export default withRouter(withService(GamePage));
