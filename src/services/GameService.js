import React from "react";
import axios from "axios";
import { sleep } from "../util/timer";
import socketIOClient from "socket.io-client";

// const ENDPOINT = "http://192.168.137.1:8090";
const ENDPOINT = "localhost:8090";

class GameService {
  constructor() {
    console.log("WARNING: THIS SHOULD ONLY BE CALLED ONCE");
    this.socket = socketIOClient(ENDPOINT);
    this.gameState = null;
    this.socketId = null;
  }

  sendGameRequest = async (gameId, username) => {
    return new Promise((resolve, reject) => {
      this.socket.emit("join", { gameId, username });
      this.socket.on("init", message => {
        console.log("Received Init Message:", message);
        this.gameState = message;
        this.socketId = message.socketId;
        resolve(message);
      });
    });
  };

  readyGame = ready => {
    return new Promise((resolve, reject) => {
      this.socket.emit("ready", { ready });
    });
  };

  listenForStart = callback => {
    this.socket.on("start", message => {
      console.log("Game started!", message);
      this.hasGameEnded = false;
      this.gameState = message;
      callback();
    });
  };

  listenForMessages = callback => {
    this.socket.on("message", message => {
      console.log("Received Update: ", message);
      this.gameState = message;
      callback();
    });
  };

  listenForGameEnd = callback => {
    this.socket.on("end", message => {
      this.hasGameEnded = true;
      callback();
    });
  };

  sendProgressUpdate = progress => {
    this.socket.emit("update", { progress });
  };

  sendColorChange = color => {
    this.socket.emit("changeColor", { color });
  };
}

const ServiceContext = React.createContext(null);

export const ServiceContextProvider = props => {
  return (
    <ServiceContext.Provider value={new GameService()}>
      {props.children}
    </ServiceContext.Provider>
  );
};

export const withService = Component => props => {
  return (
    <ServiceContext.Consumer>
      {service => <Component gameService={service} {...props} />}
    </ServiceContext.Consumer>
  );
};

export default GameService;
