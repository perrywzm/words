import React from "react";
import { Redirect } from "react-router-dom";
import Spinner from "../../components/Spinner";
import RegExpUtil from "../../util/regexp";
import { withService } from "../../services/GameService";
import "./MainPage.css";

const MainPage = ({ gameService }) => {
  const [isLoading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [game, setGame] = React.useState("");
  const [willRedirect, setRedirect] = React.useState(false);

  const handleNameChange = e => setName(e.target.value);
  const handleGameChange = e => setGame(e.target.value);

  const renderRedirector = () => {
    if (willRedirect) {
      return <Redirect to={`/game/${sanitize(game)}`} />;
    } else {
      return null;
    }
  };

  const testForValidInput = () => {
    if (name.length === 0) {
      return "Please enter a name.";
    }
    if (game.length === 0) {
      return "Please enter a game ID.";
    }
    if (!RegExpUtil.isAlphanumeric(game)) {
      return "Please do not enter non-alphanumeric characters into the game ID.";
    }
    return "";
  };

  const tryToRedirect = async () => {
    const validityTestResult = testForValidInput();
    if (validityTestResult === "") {
      setLoading(true);
      const result = await gameService.sendGameRequest(game, name);
      setLoading(false);

      if (result) {
        setRedirect(true);
      } else {
        window.alert("Game ID does not exist!");
      }
    } else {
      window.alert(validityTestResult);
    }
  };

  return (
    <div className="container">
      <h1>Words</h1>
      <div className="input-container">
        <div className="individual-input">
          <div className="label">Enter your name:</div>
          <input
            className="input"
            value={name}
            onChange={handleNameChange}
            maxLength={16}
          />
        </div>

        <div className="individual-input">
          <div className="label">Enter your game:</div>
          <input
            className="input"
            value={game}
            onChange={handleGameChange}
            maxLength={16}
          />
        </div>

        <button className="submit" onClick={tryToRedirect}>
          Enter Game
        </button>
        {renderRedirector()}
      </div>
      <Spinner show={isLoading} />
    </div>
  );
};

const sanitize = str => RegExpUtil.removeNonAlphanumeric(str);

export default withService(MainPage);
