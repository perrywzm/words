import React from "react";
import "./TextArea.css";

class TextArea extends React.Component {
  ref = React.createRef();

  constructor(props) {
    super(props);
    this.state = { focused: false };
  }

  componentDidMount() {
    this.ref.current.addEventListener("keydown", this.props.handleKeyDown);
    this.ref.current.focus();
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener("keydown", this.props.handleKeyDown);
  }

  handleOnFocus = () => this.setState({ focused: true });
  handleOnBlur = () => this.setState({ focused: false });

  render() {
    const { typed, leftOver, error } = this.props;
    return (
      <div
        tabIndex="0"
        ref={this.ref}
        style={{
          width: "calc(100% - 48px)",
          fontSize: "2em",
          flex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "24px"
        }}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
      >
        <span
          style={{ color: "cyan" }}
          className={this.state.focused ? "blink" : ""}
        >
          {typed}
        </span>
        <span style={{ backgroundColor: "red" }}>
          {error ? leftOver[0] : ""}
        </span>
        {error ? leftOver.slice(1) : leftOver}
      </div>
    );
  }
}

export default TextArea;
