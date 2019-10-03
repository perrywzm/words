import React from "react";
import { getRandomLightColor } from "../../util/colors";
import Car from "./components/Car";
import "./GamePage.css";
import "./GameLobby.css";
import { TwitterPicker as ColorPicker } from "react-color";
import Colors from "../../util/colors";
import Modal from "../../components/Modal";

const GameLobby = ({
  gameId,
  isPlayerReady,
  player,
  players,
  onStart,
  startingCounter,
  onColorChange
}) => {
  React.useEffect(() => {
    let singlePressCheck = false;

    const handleKeydown = e => {
      if (e.key === " " && !singlePressCheck) {
        e.preventDefault();
        singlePressCheck = true;
        onStart();
      }
    };

    const resetSinglePressCheck = () => (singlePressCheck = false);

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", resetSinglePressCheck);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", resetSinglePressCheck);
    };
  }, []);

  const updatePlayerColor = color => {
    onColorChange(color.hex);
  };

  return (
    <div className="game-container">
      {renderTitle(gameId)}
      {renderReadyText()}
      {renderPlayerCard(player.username, isPlayerReady, player.color, updatePlayerColor)}
      {renderPlayerGrid(players)}
      {renderStartingModal(startingCounter)}
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

const renderPlayerCard = (name, isPlayerReady, color, updatePlayerColor) => (
  <div className="user-player-card">
    <div style={{ display: "flex" }}>
      <div className="lobby-car-container">
        <Car color={color} />
      </div>
      <div className="player-title-card">
        <p className="player-title">{name}</p>
        <p style={{ color: isPlayerReady ? "#15ff00" : "transparent" }}>
          READY
        </p>
      </div>
    </div>
    {renderSwatchPicker(updatePlayerColor)}
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
    {players.map(p => renderPlayerEntry(p.username, p.ready, p.color))}
  </div>
);

const renderPlayerEntry = (name, ready, color) => (
  <div className="player-card">
    <div className="lobby-car-container">
      <Car color={color} />
    </div>
    <div className="player-title-card">
      <p className="player-title">{name}</p>
      <p style={{ color: ready ? "#15ff00" : "transparent" }}>READY</p>
    </div>
  </div>
);

const renderSwatchPicker = onSelectColor => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <h3>Color:</h3>
    <ColorPicker
      onChangeComplete={onSelectColor}
      className="color-picker"
      width="100%"
      triangle="hide"
    />
  </div>
);

const renderStartingModal = counter => {
  if (counter === -1) return null;

  return (
    <Modal show>
      <p style={{ fontSize: "2em" }}>Game starting in</p>
      <div style={{ fontSize: "3em", marginBottom: "0.75em" }}>{counter}</div>
    </Modal>
  );
};

export default GameLobby;
