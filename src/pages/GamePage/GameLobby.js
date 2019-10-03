import React from "react";
import { getRandomLightColor } from "../../util/colors";
import Car from "./components/Car";
import "./GamePage.css";
import "./GameLobby.css";
import { TwitterPicker as ColorPicker } from "react-color";
import Colors from "../../util/colors";

const GameLobby = ({ gameId, players }) => {
  const [playerColor, setPlayerColor] = React.useState()
  return (
    <div className="game-container">
      {renderTitle(gameId)}
      {renderReadyText()}
      {renderPlayerCard()}
      {renderPlayerGrid(players)}
      {renderSwatchPicker()}
    </div>
  );
};

const renderTitle = gameId => (
  <h2 style={{ color: getRandomLightColor() }}>Lobby ID: {gameId}</h2>
);

const renderReadyText = isReady => {
  if (isReady) {
    return (
      <h2 className="ready-text">
        Please wait for the other players to get ready.
      </h2>
    );
  } else {
    return <h2 className="ready-text flash">Press space to get ready.</h2>;
  }
};

const renderPlayerCard = color => (
  <div className="user-player-card">
    <div style={{ display: "flex" }}>
      <div onClick={() => console.log("CAR'D")}>
        <div className="lobby-car-container">
          <Car color={color} />
        </div>
      </div>
      <div className="player-title-card">
        <p className="player-title">Player </p>
        <p>READY</p>
      </div>
    </div>
    {renderSwatchPicker()}
  </div>
);

const renderPlayerGrid = players => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr) )",
      justifyItems: "center"
    }}
  >
    {[...Array(10)].map((_, idx) =>
      // renderPlayerEntry(Colors[idx % Colors.length])
      renderPlayerEntry(getRandomLightColor(0.2))
    )}
  </div>
);

const renderPlayerEntry = color => (
  <div className="player-card">
    <div onClick={() => console.log("CAR'D")}>
      <div className="lobby-car-container">
        <Car color={color} />
      </div>
    </div>
    <div className="player-title-card">
      <p className="player-title">Player </p>
      <p>READY</p>
    </div>
  </div>
);

const renderSwatchPicker = () => (
  <div style={{display: "flex", alignItems: "center"}}><h3>Color:</h3><ColorPicker className="color-picker" width="100%" triangle="hide" />
</div>);

export default GameLobby;
