import React, { Component } from "react";
import Fireworks from "./components/Fireworks";
import PlayersProgress from "./components/PlayersProgress";
import Stats from "./components/Stats";
import TextArea from "./components/TextArea";
import Spinner from "../../components/Spinner";
import "./GamePage.css";

const textToType = `Tom Olsson was thinking about Raymond Donaldson again. Raymond was a virtuous brute with`; // sticky warts and sloppy ankles. Tom walked over to the window and reflected on his cold surroundings.`; //He had always loved deprived Sludgeside with its grotesque, grated gates. It was a place that encouraged his tendency to feel sparkly. Then he saw something in the distance, or rather someone. It was the a virtuous figure of Raymond Donaldson. Tom gulped. He glanced at his own reflection. He was an intuitive, stingy, tea drinker with pink warts and fragile ankles. His friends saw him as a blushing, bumpy brute. Once, he had even helped a tall chicken cross the road. But not even an intuitive person who had once helped a tall chicken cross the road, was prepared for what Raymond had in store today.`;

const defaultState = {
  typed: "",
  leftOver: "",
  error: false,
  errorCount: 0,
  time: -1
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = { ...defaultState };
    this.autoMeasureInterval = null;
  }

  componentDidMount() {
    this.loadGame();
    // console.log("Received this state", this.props.gameService.gameState);
  }

  loadGame = async () => {
    if (!this.props.gameService.gameState) {
      await this.props.gameService.sendGameRequest(
        this.props.match.params.id,
        ""
      );
    }

    this.setState({
      leftOver: this.props.gameService.gameState.text,
      hasGameLoaded: true
    });

    this.props.gameService.listenForMessages(() => this.setState({}));
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

  resetGameState = () => {
    this.setState();
  };

  render() {
    const { typed, leftOver, error, gameStatus } = this.state;

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

export default Game;
