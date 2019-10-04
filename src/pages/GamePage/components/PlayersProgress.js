import React from "react";
import RollByProgress from "./RollByProgress";

const PlayersProgress = ({ socketId, players }) => {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "visible",
        zIndex: 300,
        display: "block",
        position: "relative"
      }}
    >
      {players.map((p, idx) => {
        return (
          <RollByProgress
            color={p.color}
            itsYou={socketId === p.socketId}
            name={p.username}
            progress={p.progress}
            position={p.position}
            wheelRadius={15}
          />
        );
      })}
    </div>
  );
};

export default PlayersProgress;
