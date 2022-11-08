import * as React from "react"
import { Dialog, DialogContent, DialogContentText, ToggleButton, ToggleButtonGroup, Alert, AlertTitle, Typography, Button } from "@mui/material"

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
    }

    save() {
        console.log(this)
        this.props.setState({ settings: false })
    }

    render() {
        return (
            <Dialog
                fullWidth
                PaperProps={{
                    style: {
                        backgroundColor: '#0d042d',
                        textAlign: "center"
                    },
                }}
                open={this.props.state.settings}
            >
                <DialogContent>
                    <DialogContentText color="question">Game Modifiers</DialogContentText>
                    <ToggleButtonGroup
                        exclusive
                        orientation="vertical"
                        value={this.props.state.gameMod}
                        onChange={(_e, change) => {
                            if (change === null) return;
                            this.props.setState({
                                gameMod: change
                            })
                        }}
                    >
                        <ToggleButton value="normal" disabled>Normal</ToggleButton>

                        <ToggleButton color="primary" value="correct">Autocorrect</ToggleButton>
                        <ToggleButton color="primary" value="auto">Automatic Answering</ToggleButton>
                        <ToggleButton color="primary" value="death">Sudden Death</ToggleButton>
                    </ToggleButtonGroup>
                    <br /><br />
                    <Alert
                        severity={this.props.state.gameMod == "normal" ? "error" : "info"}>
                        <AlertTitle sx={{ color: "black" }}>{(() => {
                            switch (this.props.state.gameMod) {
                                case "correct":
                                    return "Auto-Correct"
                                case "auto":
                                    return "Automatic Answering"
                                case "death":
                                    return "Sudden Death"
                                case "normal":
                                    return "Normal Mode"
                            }
                        })()}</AlertTitle>
                        <Typography sx={{ color: "black" }} textAlign="start">{(() => {
                            switch (this.props.state.gameMod) {
                                case "normal":
                                    return "Normal mode is not working right now"
                                case "correct":
                                    return "In this mode, the client will transmit the correct answer, regardless of what answer you actually chose"
                                case "auto":
                                    return "In this mode, the client will automatically answer the question correctly, without requiring any user input"
                                case "death":
                                    return "In this mode, you have one life. Once you get a question wrong, it is game over"
                            }
                        })()}</Typography>
                    </Alert>
                    <br /><br />
                    <DialogContentText color="question">Delay between questions</DialogContentText>
                    <ToggleButtonGroup
                        aria-required
                        fullWidth
                        color="primary"
                        exclusive
                        aria-label="Platform"
                        value={this.props.state.delay}
                        onChange={(_e, change) => {
                            if (change === null) return;
                            this.props.setState({
                                delay: change
                            })
                        }}
                    >
                        <ToggleButton value="0">0<br />seconds</ToggleButton>
                        <ToggleButton value="1">1<br />second</ToggleButton>
                        <ToggleButton value="2">2<br />seconds</ToggleButton>
                        <ToggleButton value="3">3<br />seconds</ToggleButton>
                        <ToggleButton value="4">4<br />seconds</ToggleButton>
                        <ToggleButton value="5">5<br />seconds</ToggleButton>
                    </ToggleButtonGroup>
                    <br /><br />
                    <Button fullWidth variant="contained" size="large" sx={{
                        fontSize: "20px", padding: "25px",
                        bgcolor: "#3ccfcf"
                    }} onClick={this.save.bind(this)}>Save</Button>
                </DialogContent>
            </Dialog>
        )
    }
}