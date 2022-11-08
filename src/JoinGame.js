import * as React from "react";
import { Typography, Stack, TextField, LinearProgress, Button } from "@mui/material";
import Settings from "./Settings.js";

class JoinGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.app = {
      state: props.pstate,
      setState: props.setParentState,
    };
  }

  handleContinue() {
    // Load
    this.setState({ loading: true })

    // set game sets
    this.app.setState({ 
      auto: this.state.auto,
      highlight: this.state.show,
      username: document.getElementById("name").value, 
      screen: "lobby"
    })
 
    // Switch mode
  }

  handleOpenSettings() {
    this.app.setState({settings: true})
  }

  render() {
    return (
      <Stack textAlign="center" spacing="10px">
        <Typography variant="h4">Game Code</Typography>
        <Typography
          gutterBottom
          variant="h3"
          fontFamily="sans-serif"
          letterSpacing="0.5rem"
        >
          {this.app.state.gameCode.replace(/(.{3})(.{3})/g, "$1-$2")}
        </Typography>
        <Typography variant="h4">Tell us your name</Typography>
        <TextField
          placeholder="Quizlet.JS Bot"
          inputProps={{ maxLength: 25 }}
          id="name"
          autoFocus
          variant="standard"
          sx={{
            "& .MuiInput-underline:before": {
              borderBottom: `2px solid white`,
            },

            "& .MuiInput-underline:after": {
              borderBottom: `4px solid yellow`,
            },

            input: {
              color: "white",
              fontSize: "50px",
            },
          }}
          size="large"
        />

        <Button disabled={this.state.loading || this.state.disabled} variant="contained" size="large" sx={{
          fontSize: "20px", padding: "25px",
          bgcolor: "#3ccfcf"
        }} onClick={this.handleContinue.bind(this)}>Join Game</Button>
        {this.state.loading && <LinearProgress />}
      </Stack>
    );
  }
}

export default JoinGame;
