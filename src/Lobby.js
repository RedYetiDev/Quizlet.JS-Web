import * as React from "react";
import { Snackbar, Alert, AlertTitle, Typography } from "@mui/material";

import Classic from "./quizlet.js-mod/classic.js";
import AutoText from "./AutoText.js";

export default class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.app = {
            state: props.pstate,
            setState: props.setParentState
        }
        this.state = {
            message: this.app.state.gameOver ? "Game Over" : "Joining the game..."
        }

        if (!this.app.state.inited) {
            this.initGame();
            this.app.state.inited = true;
        }
        
    }

    initGame() {
        if (this.app.state.gameCode.startsWith("C")) {

        } else {
            var game = new Classic();
            this.app.setState({
                game
            })
        }

        // Setup events

        game.on("lobby", () => {
            this.setState({
                message: "You're in the lobby!"
            })
        })

        game.on("teams", (teams) => {
            this.setState({
                message: "Teams were just assigned! You are on team " + teams.myTeam.name
            })
        })

        game.once("question", (data) => {
            this.app.setState({
                question: {
                    prompt: data.question,
                    options: data.options
                },
                screen: "question"
            })
            if (this.app.state.gameMod == "auto") {
                this.app.setState({
                    questionOver: true
                })
                game.answer(data.question)
            }
        })

        game.once("ended", () => {
            this.app.setState({
                screen: "lobby",
                gameOver: true
            })
        })

        game.joinGame(this.app.state.gameCode, this.app.state.username, false, this.setState.bind(this))
    }

    render() {
        console.log(this.state)
        return (
            <>
            <AutoText
            minFontSize={1}
            maxFontSize={100}
            style={{ fontFamily: "Sarabun", color: "white", textAlign: "center" }}>
                {this.state.message}
            </AutoText>
            {this.state.error &&
                <Snackbar open={true} autoHideDuration={6000}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        <AlertTitle color="error">Something went wrong</AlertTitle>
                        Has the game already started? Does someone already have your username?
                        <br/>
                        <Typography variant="caption" color="secondary">
                        "{this.state.error.type}"
                        </Typography>
                    </Alert>
                </Snackbar>
            }
            </>
        )
    }
}