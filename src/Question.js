import * as React from "react";
import { Stack, Typography, Grid, Card, TextField } from "@mui/material";
import AutoText from "./AutoText";

export default class Question extends React.Component {
    constructor(props) {
        super(props);
        this.app = {
            state: props.pstate,
            setState: props.setParentState
        }
        this.state = {
            questionOver: true
        }
        this.app.state.game.on("question", (data) => {
            setTimeout((() => {
                [...document.getElementsByClassName("answer-option")].forEach((element, i) => {
                    element.style.backgroundColor = (this.props.question.options[i].id === this.props.question.prompt.id && this.app.state.highlight) ? "darkgreen" : "#282e3e"
                }); 
                this.app.setState({
                    question: {
                        prompt: data.question,
                        options: data.options
                    }
                });
                if (this.app.state.gameMod == "auto") {
                    this.app.state.game.answer(data.question)
                } else {
                    this.setState({
                        questionOver: false
                    })
                }
            }).bind(this), this.app.state.delay*1000) 
        })
    }

    render() {
        return (
            <Stack spacing="10vh" textAlign="center">
                <AutoText
                    minFontSize={1}
                    maxFontSize={100}
                    style={{ fontFamily: "Sarabun", color: "white" }}

                >{this.props.question.prompt[this.app.state.game.gameOptions.promptWith == 2 ? "definition" : "term"].text}</AutoText>
                <Grid
                    container
                    spacing="10"
                    display="flex"
                    justifyContent="center"
                    alignItems="center">
                    {
                        [...Array(4)].map((_item, index) => {
                            return (
                                <Grid item xs={5.5} key={`question-options-${index}`}>
                                    <Card variant="outlined" className="answer-option" sx={{
                                        height: "20vh",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "5px",
                                        color: "white",
                                        backgroundColor: this.props.question.options[index].id == this.props.question.prompt.id ? "darkgreen" : "darkred",
                                        '&:hover': {
                                            borderColor: "yellow",
                                            borderWidth: "5px",
                                            margin: "-5px"
                                        }, 
                                    }} onClick={(event) => {
                                        if (this.state.questionOver) {
                                            return;
                                        }
                                        var isCorrect = this.props.question.options[index].id === this.props.question.prompt.id
                                        this.setState({
                                            questionOver: true
                                        });
                                        [...document.getElementsByClassName("answer-option")].forEach((element, i) => {
                                            element.style.backgroundColor = (this.props.question.options[i].id === this.props.question.prompt.id) ? "darkgreen" : "darkred"
                                        });
                                        event.currentTarget.style.backgroundColor = isCorrect ? "lightgreen" : "red"
                                        
                                        /*
                                            Bug Notice:
                                                Summary:
                                                    We need to answer correctly whether the player got it right or not
                                                Reason:
                                                    When you answer the first question incorrect, the websocket does not process it
                                                    When you answer the last question incorrect, the client freezes
                                                Caused by:
                                                    Unknown

                                        */
                                        if (this.app.state.gameMod == "correct") {
                                            this.app.state.game.answer(this.props.question.prompt)
                                        } else if (this.app.state.gameMod == "death" && !isCorrect) {
                                            this.app.setState({
                                                screen: "lobby",
                                                gameOver: true
                                            })
                                        } else {
                                            this.app.state.game.answer(this.props.question.options[index])
                                        }
                                    }}> 
                                        <AutoText
                                            minFontSize={1}
                                            maxFontSize={50}
                                            style={{ fontFamily: "Sarabun" }}

                                        >{this.props.question.options[index][this.app.state.game.gameOptions.answerWith == 2 ? "definition" : "term"].text}</AutoText>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Stack>
        )
    }
}

// Notes:
// Now, When you get a question wrong on the final question, freeze