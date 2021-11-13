"use strict";

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
};
var Game;
var autoCorrect = false;
var showCorrect = false;

function runGame() {
  ReactDOM.render(loadingScreen, document.getElementById('root'));
  var pin = document.getElementById('pin').value;
  var name = document.getElementById('name').value;
  autoCorrect = document.getElementById('autoCorrect').checked;
  showCorrect = document.getElementById('showCorrect').checked;

  try {
    Game = new Quizlet(pin, name);
  } catch (e) {
    alert(e);
    location.reload();
  }

  delete Game.callbacks.error[0];
  Game.on('error', error => {
    alert(error);
    location.reload();
  });
  Game.joinGame();
  Game.on('connect', () => {
    ReactDOM.render(waitingScreen, document.getElementById('root'));
  });
  Game.on('teamAssignments', (teamName, playerNames) => {
    var teamScreen = /*#__PURE__*/React.createElement("div", {
      className: "container text-center"
    }, /*#__PURE__*/React.createElement("h1", null, "You're In!"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h4", {
      className: "text-secondary"
    }, "The Host has assigned teams!"), /*#__PURE__*/React.createElement("h4", null, "You are on the ", animalNames[teamName], " with ", playerNames.join(', ')));
    ReactDOM.render(teamScreen, document.getElementById('root'));
  });
  Game.on('question', (questionName, possibleAnswers, correctAnswer) => {
    renderQuestionInfo(questionName, possibleAnswers, correctAnswer);

    if (autoCorrect) {
      Game.answer(correctAnswer);
    }
  });
  Game.on('gameOver', didWin => {
    var gameOverScreen = /*#__PURE__*/React.createElement("h1", {
      className: "text-center"
    }, "Game Over! ", didWin ? "You Won!" : "You Lost!");
    ReactDOM.render(gameOverScreen, document.getElementById("root"));
  });
  Game.on('answer', (isCorrect, answerer) => {
    var nextQuestionScreen = /*#__PURE__*/React.createElement("div", {
      className: "container text-center"
    }, /*#__PURE__*/React.createElement("h1", null, "Waiting Next Question"), /*#__PURE__*/React.createElement("h2", null, answerer, " answered ", /*#__PURE__*/React.createElement("span", {
      className: isCorrect ? "text-success" : "text-danger"
    }, isCorrect ? "correctly" : "incorrectly")));
    ReactDOM.render(nextQuestionScreen, document.getElementById('root'));
  });
}

function renderQuestionInfo(name, choices, answer) {
  var questionScreenPart = /*#__PURE__*/React.createElement("h2", null, name);
  var choiceCards = [];
  choices.forEach((choice, idx) => {
    choiceCards.push(choiceTemplate(choice, idx, choice == answer, false));
  });
  var choiceScreenPart = /*#__PURE__*/React.createElement("div", {
    className: "d-grid gap-2"
  }, choiceCards);
  var questionScreen = /*#__PURE__*/React.createElement("div", {
    className: "container text-center"
  }, questionScreenPart, choiceScreenPart);
  ReactDOM.render(questionScreen, document.getElementById("root"));
}

function choiceTemplate(choice, key, isCorrect, isDisabled) {
  if (!choice) return "";

  if (isCorrect && showCorrect) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => Game.answer(choice),
      className: "btn btn-block btn-success",
      key: key
    }, choice);
  } else if (!isCorrect && showCorrect) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => Game.answer(choice),
      className: "btn btn-block btn-danger",
      key: key
    }, choice);
  } else {
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => Game.answer(choice),
      className: "btn btn-block btn-primary",
      key: key
    }, choice);
  }
}

const loadingScreen = /*#__PURE__*/React.createElement("div", {
  className: "text-center"
}, /*#__PURE__*/React.createElement("div", {
  className: "spinner-border",
  style: {
    width: "25rem",
    height: "25rem"
  },
  role: "status"
}, /*#__PURE__*/React.createElement("span", {
  className: "visually-hidden"
}, "Loading...")));
const pinScreen = /*#__PURE__*/React.createElement("div", {
  className: "container text-center"
}, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
  className: "mb-3"
}, /*#__PURE__*/React.createElement("input", {
  id: "pin",
  className: "form-control",
  type: "text",
  maxLength: "6",
  placeholder: "Game PIN"
})), /*#__PURE__*/React.createElement("div", {
  className: "mb-3"
}, /*#__PURE__*/React.createElement("input", {
  id: "name",
  className: "form-control",
  type: "text",
  placeholder: "Display Name"
})), /*#__PURE__*/React.createElement("div", {
  className: "mb-3 btn-group form-control"
}, /*#__PURE__*/React.createElement("input", {
  id: "autoCorrect",
  className: "btn-check",
  type: "checkbox"
}), /*#__PURE__*/React.createElement("label", {
  className: "btn btn-outline-success",
  htmlFor: "autoCorrect"
}, "Auto Answer Correctly"), /*#__PURE__*/React.createElement("input", {
  id: "showCorrect",
  className: "btn-check",
  type: "checkbox"
}), /*#__PURE__*/React.createElement("label", {
  className: "btn btn-outline-success",
  htmlFor: "showCorrect"
}, "Show Correct Answers")), /*#__PURE__*/React.createElement("button", {
  className: "btn btn-primary form-control",
  onClick: runGame
}, "Join Game"));
const waitingScreen = /*#__PURE__*/React.createElement("div", {
  className: "container text-center"
}, /*#__PURE__*/React.createElement("h1", null, "You're In!"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h4", {
  className: "text-secondary"
}, "Waiting for the host to start the game"));
ReactDOM.render(pinScreen, document.getElementById('root'));