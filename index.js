const animalNames = {
    alligator: "Alligators",
    alpaca: "Alpacas",
    bear: "Bears",
    bison: "Bison",
    camel: "Camels",
    chameleon: "Chameleons",
    cheetah: "Cheetahs",
    dolphin: "Dolphins",
    eagle: "Bald Eagles",
    fox: "Foxes",
    frog: "Frogs",
    giraffe: "Giraffes",
    hedgehog: "Hedgehogs",
    kangaroo: "Kangaroos",
    koala: "Koalas",
    lion: "Lions",
    lynx: "Lynx",
    mantaray: "Stingrays",
    mountainlion: "Pumas",
    mustang: "Mustangs",
    orca: "Orcas",
    ostrich: "Ostriches",
    ox: "Oxen",
    panda: "Pandas",
    peacock: "Peacocks",
    penguin: "Penguins",
    puffin: "Puffins",
    reindeer: "Reindeer",
    rhino: "Rhinos",
    seadragon: "Sea Dragons",
    shark: "Sharks",
    siberiantiger: "Siberian Tigers",
    trex: "T-Rexes",
    tiger: "Tigers",
    turtle: "Sea Turtles",
    unicorn: "Unicorns",
    wolf: "Wolves",
    zebra: "Zebras"
}

var Game;
var autoCorrect = false;
var showCorrect = false;

window.addEventListener('unhandledrejection', function(event) {
    if (event.reason == 'SyntaxError: JSON Parse error: Unexpected identifier "html"') return;
    alert(event.reason)
    location.reload()
});

function runGame() {
    ReactDOM.render(loadingScreen, document.getElementById('root'))
    var pin = document.getElementById('pin').value
    var name = document.getElementById('name').value
    autoCorrect = document.getElementById('autoCorrect').checked
    showCorrect = document.getElementById('showCorrect').checked
    try {
        Game = new Quizlet(pin, name);
    } catch(e) {
        alert(e);
        location.reload()
    }
    Game.joinGame()
    Game.on('connect', () => {
        ReactDOM.render(waitingScreen, document.getElementById('root'))
    })
    Game.on('teamAssignments', (teamName, playerNames) => {
        var teamScreen = (
            <div className="container text-center">
                <h1>You're In!</h1>
                <br />
                <h4 className="text-secondary">The Host has assigned teams!</h4>
                <h4>You are on the {animalNames[teamName]} with {playerNames.join(', ')}</h4>
            </div>
        )
        ReactDOM.render(teamScreen, document.getElementById('root'))
    })
    Game.on('question', (questionName, possibleAnswers, correctAnswer) => {
        renderQuestionInfo(questionName, possibleAnswers, correctAnswer)
        if (autoCorrect) {
            Game.answer(correctAnswer)
        }
    })
    Game.on('gameOver', (didWin) => {
        var gameOverScreen = <h1 className="text-center">Game Over! {didWin ? "You Won!" : "You Lost!" }</h1>
        ReactDOM.render(gameOverScreen, document.getElementById("root"))
    })
    Game.on('answer', (isCorrect, answerer) => {
        var nextQuestionScreen = (
            <div className="container text-center">
                <h1>Waiting Next Question</h1>
                <h2>{answerer} answered <span className={isCorrect ? "text-success" : "text-danger"}>{isCorrect ? "correctly" : "incorrectly"}</span></h2>
            </div>
        )
        ReactDOM.render(nextQuestionScreen, document.getElementById('root'))
    })
}

function renderQuestionInfo(name,choices,answer) {
    var questionScreenPart =  <h2>{name}</h2>
    var choiceCards = []
    choices.forEach((choice, idx) => {
        choiceCards.push(choiceTemplate(choice, idx, choice == answer, false))
    })
    var choiceScreenPart = (
        <div className="d-grid gap-2">
            {choiceCards}
        </div>
    )
    var questionScreen = (
        <div className="container text-center">
            {questionScreenPart}
            {choiceScreenPart}
        </div>
    )
    ReactDOM.render(questionScreen, document.getElementById("root"))
}

function choiceTemplate(choice, key, isCorrect, isDisabled) {
    if (!choice) return ""
    if (isCorrect && showCorrect) {
        return <button onClick={() => Game.answer(choice)} className="btn btn-block btn-success" key={key}>{choice}</button>
    } else if (!isCorrect && showCorrect) {
        return <button onClick={() => Game.answer(choice)} className="btn btn-block btn-danger" key={key}>{choice}</button>
    } else {
        return <button onClick={() => Game.answer(choice)} className="btn btn-block btn-primary" key={key}>{choice}</button>
    }
}

const loadingScreen = (
    <div className="text-center">
        <div className="spinner-border" style={{width: "25rem", height: "25rem"}} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
)

const pinScreen = (
    <div className="container text-center">
        <br />
        <div className="mb-3">
            <input id="pin" className="form-control" type="text" maxLength="6" placeholder="Game PIN"></input>
        </div>
        <div className="mb-3">
            <input id="name" className="form-control" type="text" placeholder="Display Name"></input>
        </div>
        <div className="mb-3 btn-group form-control">
            <input id="autoCorrect" className="btn-check" type="checkbox"></input>
            <label className="btn btn-outline-success" htmlFor="autoCorrect">Auto Answer Correctly</label>
            <input id="showCorrect" className="btn-check" type="checkbox"></input>
            <label className="btn btn-outline-success" htmlFor="showCorrect">Show Correct Answers</label>
        </div>
        <button className="btn btn-primary form-control" onClick={runGame}>Join Game</button>
    </div>
)
const waitingScreen = (
    <div className="container text-center">
        <h1>You're In!</h1>
        <br />
        <h4 className="text-secondary">Waiting for the host to start the game</h4>
    </div>
)

ReactDOM.render(pinScreen, document.getElementById('root'))
