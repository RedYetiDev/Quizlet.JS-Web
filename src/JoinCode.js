import * as React from 'react'
import Classic from './quizlet.js-mod/classic.js'
import Checkpoint from './quizlet.js-mod/checkpoint.js'
import { Typography, Box, Stack, TextField, Button, LinearProgress, Alert, Snackbar, AlertTitle } from '@mui/material';
const tfCSS = {
  width: '0.5ch',

  '& .MuiInput-underline:before': {
    borderBottom: `2px solid white`
  },

  '& .MuiInput-underline:after': {
    borderBottom: `4px solid yellow`
  },

  input: {
    color: 'white',
    textAlign: 'center',
  },

  fontWeight: "bold"
}

function getIndex(event) {
  var elements = event.nativeEvent.path[3].querySelectorAll("input");
  var index = elements[0].value.length
    + elements[1].value.length
    + elements[2].value.length
    + elements[3].value.length
    + elements[4].value.length
    + elements[5].value.length
  return { elements, index }
}


class JoinCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { disabled: true, loading: false }
    window.tempSetState = this.setState.bind(this)
  }

  handleChange(event) {
    if (event.nativeEvent.inputType === "insertText") {
      event.target.value = ""
      var { elements, index } = getIndex(event);
      elements[index].value = event.nativeEvent.data.toUpperCase()
      if (index >= 5) {
        this.setState({ disabled: false })
      } else {
        elements[index + 1].focus()
      }
    }
  }

  handleKeyDown(event) {
    if (event.code === "Backspace") {
      var { elements, index } = getIndex(event)
      elements[Math.max(index - 1, 0)].focus()
      if (index === 6) {
        this.setState({ disabled: true })
      }
    }
  }

  handlePaste(event) {
    event.preventDefault();

    var { elements, index } = getIndex(event);
    var ti = 0;
    var data = event.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "");
    while (ti < data.length && index + ti <= 5) {
      elements[index + ti].value = data[ti].toUpperCase();
      ti++;
    }
    if (index + ti >= 5) {
      this.setState({ disabled: false })
    } else {
      elements[Math.min(index + ti, 5)].focus()
    }
  }

  async handleContinue(event) {
    // initiate loading screen
    this.setState({ loading: true })

    // get game PIN
    var elements = event.nativeEvent.path[3].querySelectorAll("input");
    var code = elements[0].value
      + elements[1].value
      + elements[2].value
      + elements[3].value
      + elements[4].value
      + elements[5].value

    // check game type
    if (code.startsWith("C")) {
      // checkpoint
    } else {
      // classic
      // check if game exists
      try {
        await Classic.getGame(code)
        this.props.setParentState({
          screen: "join",
          gameCode: code.toUpperCase()
        })
      } catch (e) {
        this.setState({
          error: e, loading: false
        })
      }
    }
  }

  render() {
    return (
      <Stack textAlign="center">
        <Typography variant="h4" fontSize="1.5rem">
          Enter Join Code
        </Typography>
        <Box id="inputCode" sx={{ fontSize: "150px" }} display="flex"
          justifyContent="center"
          alignItems="center"
          onInput={this.handleChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          onPaste={this.handlePaste.bind(this)}
        >
          <TextField variant="standard" sx={tfCSS} placeholder="0" id="c1" inputProps={{ maxLength: 1 }} />
          <TextField variant="standard" sx={tfCSS} placeholder="0" id="c2" inputProps={{ maxLength: 1 }} />
          <TextField variant="standard" sx={tfCSS} placeholder="0" id="c3" inputProps={{ maxLength: 1 }} />
          <Typography variant="h2" marginBottom={3} marginLeft={1} marginRight={1}>-</Typography>
          <TextField variant="standard" sx={tfCSS} placeholder="0" id="c4" inputProps={{ maxLength: 1 }} />
          <TextField variant="standard" sx={tfCSS} placeholder="0" id="c5" inputProps={{ maxLength: 1 }} />
          <TextField variant="standard" sx={tfCSS} placeholder="0" id="c6" inputProps={{ maxLength: 1 }} />
        </Box>
        <Button disabled={this.state.loading || this.state.disabled} variant="contained" size="large" sx={{
          fontSize: "20px", padding: "25px",
          bgcolor: "#3ccfcf",
          "&:hover": {
            bgcolor: "#89dddc"
          },
          "&:disabled": {
            bgcolor: "#c3c7d5"
          },
        }} onClick={this.handleContinue.bind(this)}>Continue</Button>
        {this.state.loading && <LinearProgress />}
        {this.state.error &&
          <Snackbar open={true} autoHideDuration={6000}>
            <Alert severity="error" sx={{ width: '100%' }}>
              <AlertTitle color="error">Something went wrong</AlertTitle>
              Please check your join code and try again
              <br />
              <Typography variant="caption" color="secondary">
                "{this.state.error.message}"
              </Typography>
            </Alert>
          </Snackbar>
        }
      </Stack>
    );
  }
}

export default JoinCode;
