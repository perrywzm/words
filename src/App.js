import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import GamePage from "./pages/GamePage/GamePage";
import { ServiceContextProvider } from "./services/GameService";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ServiceContextProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact>
              <MainPage />
            </Route>
            <Route path="/game/:id">
              <GamePage />
            </Route>
          </Switch>
        </BrowserRouter>
      </ServiceContextProvider>
    );
  }
}

export default App;
