import { Box, AppBar, Toolbar, Typography, Divider, ThemeProvider, createTheme, IconButton, Dialog, DialogTitle, DialogContentText, DialogContent } from "@mui/material"
import SettingsIcon from '@mui/icons-material/Settings';

import React from "react"
import './font.css'

import JoinCode from "./JoinCode"
import JoinGame from "./JoinGame"
import Lobby from "./Lobby"
import Question from "./Question"
import Settings from "./Settings"

const theme = createTheme({
    components: {
        MuiToggleButton: {
            styleOverrides: {
                root: { color: "white", border: "1px solid", "&.Mui-disabled": { color: "grey", border: "1px solid" } },
            }
        }
    },
    typography: {
        fontFamily: "Sarabun",
        allVariants: {
            color: "white"
        },

    },
    palette: {
        secondary: {
            // This is green.A700 as hex.
            main: '#11cb5f',
        },
        join: {
            main: "#0d042d"
        },
        question: {
            main: "#282e3e",
            textContrast: "#c3c7d5",
            progress: "#4257b2"
        }
    }
})

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameCode: "",
            team: "",
            screen: "code",
            delay: "1",
            settings: false,
            gameMod: "auto"
        }
    }

    async componentDidMount() {
        // browser type
        if (navigator.userAgent.indexOf("Chrome") != -1) {
            this.setState({
                browser: "chrome"
            })
        }
        // FIREFOX
        else if (navigator.userAgent.indexOf("Firefox") != -1) {
            this.setState({
                browser: "firefox"
            })
        }
        // EDGE
        else if (navigator.userAgent.indexOf("Edge") != -1) {
            this.setState({
                browser: "edge"
            })
        }
        // SAFARI
        else if (navigator.userAgent.indexOf("Safari") != -1) {
            this.setState({
                browser: "safari"
            })
        }
        // OTHERS
        else {
            this.setState({
                browser: "other"
            })
        }
        // test for cors
        try {
            await fetch("https://quizlet.com");
        } catch (e) {
            // initial request failed, check if works without cors
            try {
                await fetch("https://quizlet.com", { mode: "no-cors" })
                this.setState({ screen: "cors" })
            } catch (e) {
                this.setState({ screen: "neterror", httpError: e })
            }
        }
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                {<Box display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                >
                    <AppBar color={this.state.screen === "question" ? "question" : "join"} sx={{ boxShadow: 0 }}>
                        <Toolbar sx={{ justifyContent: "space-between" }}>
                            <Typography variant="h4">
                                Quizlet.JS
                            </Typography>
                            <Typography variant="h5" color="question.textContrast">
                                {this.state.team}
                            </Typography>
                            <Typography variant="h5" color="question.textContrast">
                                {this.state.game ? this.state.game.index + "/" + this.state.game.terms.length : this.state.gameCode.replace(/(...)(...)/, "$1-$2")}
                            </Typography>
                            <IconButton color="primary" onClick={(() => {
                                this.setState({ settings: true })
                            })}>
                                <SettingsIcon sx={{ color: "white" }} />
                            </IconButton>
                        </Toolbar>
                        <Divider sx={{ bgcolor: (this.state.screen === "join" || this.state.screen === "lobby") ? "question.main" : "question.progress", height: (this.state.screen === "join" || this.state.screen === "lobby") ? "1px" : "12px" }} />
                    </AppBar>
                    <Settings state={this.state} setState={this.setState.bind(this)} />
                    {(() => {
                        switch (this.state.screen) {
                            case "code":
                                return <JoinCode pstate={this.state} setParentState={this.setState.bind(this)} />
                            case "join":
                                return <JoinGame pstate={this.state} setParentState={this.setState.bind(this)} />
                            case "lobby":
                                return <Lobby pstate={this.state} setParentState={this.setState.bind(this)} />
                            case "question":
                                return <Question pstate={this.state} setParentState={this.setState.bind(this)} question={this.state.question} />
                            case "cors":
                                return (
                                    <Dialog open={true} fullWidth
                                        PaperProps={{
                                            style: {
                                                backgroundColor: '#0d042d',
                                                textAlign: "center"
                                            },
                                        }}>
                                        <DialogTitle>CORS Error</DialogTitle>
                                        <DialogContentText color="question">In Order to use <b>Quizlet.JS-Web</b>, you must enable CORS in your browser.</DialogContentText>
                                        <br/>
                                        {(() => {
                                            switch (this.state.browser) {
                                                case "edge":
                                                case "chrome":
                                                    return <a target="_blank" href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf"><img src="https://img.shields.io/badge/Allow%20CORS%3A%20Access--Control--Allow--Origin-Chrome%20Web%20Store-informational?style=for-the-badge&logo=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYGBgYHBgcICAcKCwoLCg8ODAwODxYQERAREBYiFRkVFRkVIh4kHhweJB42KiYmKjY+NDI0PkxERExfWl98fKcBBgYGBgcGBwgIBwoLCgsKDw4MDA4PFhAREBEQFiIVGRUVGRUiHiQeHB4kHjYqJiYqNj40MjQ+TERETF9aX3x8p//CABEIAC4ALgMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAEAAUGBwECCAP/2gAIAQEAAAAA6aWy1y1ovUZJugxU69w+Z3Mx7vSq68DfrBl5QTUTJjv/xAAaAQACAgMAAAAAAAAAAAAAAAAABQYHAQIE/9oACgICEAMQAAAA2wAcT9VKGUNFNiRmkbB//8QAOBAAAgIBAgIHBQMNAAAAAAAAAQIDBAUAEQYxBxIVIVFSkRATMoGhFEFCF0NTVGFicXKTscHR0v/aAAgBAQABPwDtWx5I/Q67VseSP0Ou07X6JPQ6OTtDnGnoddq2PJH6HXatjyx+h9v2x/INSWWdCvUA39g1sfDWTy2OxUIlvWViB+Bebv8AyqO86n6SqQcivi55F8zyKn0AbVPpExczBbNOev8AvAiVfpsdVrEFqFJ68qSxN8LodwdAHw1nsvFhsTZvOvXKd0cfnkbkP96vZC5kbctu5MZJnPex/sPADWM4cz2ThE9PGyyQnlKerGh/gXI31NwpxFWIE+OdN+W7psfrrh08Q4O6JUrM0DkCeHrrs48R3/ENI6uqsrbqwBB/YddJVtvfY2p+ERvKw8Sx6uuHMZVt5kC4hanWgltzp544Rv1PmdZjN5DMWTPakO35uEd0cS/cqLyAGuD89ZrZCtjp5Gko2pBE0bHcRu/crp4EHUsTRyvG3NWKn5awkhegoP4HZf8AOs5wPiM3YhnszWkaOPqARsoBG5P3qdUOjjB0JZ5I7F1ve1pa7h3QgpKNjyUa/JDw1+uZH+pH/wAap9FXDtS5VspZvM0EySKrOhUlDuN9k1Jwrj5JHkaaxuzFj3rzPy1TwtSnGUjaQgsWPWI1/8QAIhEAAQQCAQQDAAAAAAAAAAAAAgEDBBEABRMSITJRcoGR/9oACAECAQE/AKz6yslzEYoRSzXHNlJaDlcNBD2SIg/uQNnFmiXE62Rj5CJIWHF5JQG4lh1pfxyVtdE/BdiE1bRNqKB0ds0Gh2Gu2rjxIKMqBj5WtX2z/8QAKBEAAgEDAQUJAAAAAAAAAAAAAQIDAAQFERIiMTKRBhATFCEjUWNx/9oACAEDAQE/AO/B4Q5Jnd5NiFDo2nMT8U2C7OamHxEWQfdv9Cay2M8hMAkyyxPyMCOhrF3uTx17fvEfauYSnHlYLuMPyocflY7lJw++HBLbXrV9fQXFqqDXbBB4V//Z" alt="CORS Extension"></img></a>
                                                case "firefox":
                                                    return <a target="_blank" href="https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/"><img src="https://img.shields.io/badge/CORS--Everywhere-FireFox-informational?style=for-the-badge&logo=firefox" alt="CORS Extension"></img></a>
                                                case "safari":
                                                    return <DialogContentText color="question">Later versions of Safari allow you to Disable Cross-Origin Restrictions. Just enable the developer menu from <i>Preferences &gt; Advanced</i>, and select <i>Disable Cross-Origin Restrictions</i> from the develop menu.</DialogContentText>
                                            }
                                        })()}
                                    </Dialog>
                                )
                            case "neterror":
                                return (
                                    <Dialog open={true} fullWidth
                                        PaperProps={{
                                            style: {
                                                backgroundColor: '#0d042d',
                                                textAlign: "center"
                                            },
                                        }}>
                                        <DialogTitle>Network Error</DialogTitle>
                                        <DialogContentText color="question"><pre>{this.state.httpError}</pre></DialogContentText>
                                    </Dialog>
                                )
                        }
                    })()}
                </Box>}
            </ThemeProvider>
        )
    }
}
// https://img.shields.io/badge/Allow%20CORS%3A%20Access--Control--Allow--Origin-Chrome%20Web%20Store-informational?style=for-the-badge&logo=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYGBgYHBgcICAcKCwoLCg8ODAwODxYQERAREBYiFRkVFRkVIh4kHhweJB42KiYmKjY+NDI0PkxERExfWl98fKcBBgYGBgcGBwgIBwoLCgsKDw4MDA4PFhAREBEQFiIVGRUVGRUiHiQeHB4kHjYqJiYqNj40MjQ+TERETF9aX3x8p//CABEIAC4ALgMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAEAAUGBwECCAP/2gAIAQEAAAAA6aWy1y1ovUZJugxU69w+Z3Mx7vSq68DfrBl5QTUTJjv/xAAaAQACAgMAAAAAAAAAAAAAAAAABQYHAQIE/9oACgICEAMQAAAA2wAcT9VKGUNFNiRmkbB//8QAOBAAAgIBAgIHBQMNAAAAAAAAAQIDBAUAEQYxBxIVIVFSkRATMoGhFEFCF0NTVGFicXKTscHR0v/aAAgBAQABPwDtWx5I/Q67VseSP0Ou07X6JPQ6OTtDnGnoddq2PJH6HXatjyx+h9v2x/INSWWdCvUA39g1sfDWTy2OxUIlvWViB+Bebv8AyqO86n6SqQcivi55F8zyKn0AbVPpExczBbNOev8AvAiVfpsdVrEFqFJ68qSxN8LodwdAHw1nsvFhsTZvOvXKd0cfnkbkP96vZC5kbctu5MZJnPex/sPADWM4cz2ThE9PGyyQnlKerGh/gXI31NwpxFWIE+OdN+W7psfrrh08Q4O6JUrM0DkCeHrrs48R3/ENI6uqsrbqwBB/YddJVtvfY2p+ERvKw8Sx6uuHMZVt5kC4hanWgltzp544Rv1PmdZjN5DMWTPakO35uEd0cS/cqLyAGuD89ZrZCtjp5Gko2pBE0bHcRu/crp4EHUsTRyvG3NWKn5awkhegoP4HZf8AOs5wPiM3YhnszWkaOPqARsoBG5P3qdUOjjB0JZ5I7F1ve1pa7h3QgpKNjyUa/JDw1+uZH+pH/wAap9FXDtS5VspZvM0EySKrOhUlDuN9k1Jwrj5JHkaaxuzFj3rzPy1TwtSnGUjaQgsWPWI1/8QAIhEAAQQCAQQDAAAAAAAAAAAAAgEDBBEABRMSITJRcoGR/9oACAECAQE/AKz6yslzEYoRSzXHNlJaDlcNBD2SIg/uQNnFmiXE62Rj5CJIWHF5JQG4lh1pfxyVtdE/BdiE1bRNqKB0ds0Gh2Gu2rjxIKMqBj5WtX2z/8QAKBEAAgEDAQUJAAAAAAAAAAAAAQIDAAQFERIiMTKRBhATFCEjUWNx/9oACAEDAQE/AO/B4Q5Jnd5NiFDo2nMT8U2C7OamHxEWQfdv9Cay2M8hMAkyyxPyMCOhrF3uTx17fvEfauYSnHlYLuMPyocflY7lJw++HBLbXrV9fQXFqqDXbBB4V//Z