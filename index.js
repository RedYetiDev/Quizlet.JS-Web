"use strict";

function shuffle(array) {
  let currentIndex = array.length,
      randomIndex; // While there remain elements to shuffle...

  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--; // And swap it with the current element.

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

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
var blockIncorrect = false;
var shuffleAnswers = false;
var showDetails = false;

function runGame() {
  ReactDOM.render(loadingScreen, document.getElementById('root'));
  var pin = document.getElementById('pin').value;

  if (!parseInt(pin) || pin.length != 6) {
    alert('The PIN must be a 6 digit number');
    location.reload();
  }

  var name = document.getElementById('name').value;
  autoCorrect = document.getElementById('autoCorrect').checked;
  showCorrect = document.getElementById('showCorrect').checked;
  blockIncorrect = document.getElementById('blockIncorrect').checked;
  shuffleAnswers = document.getElementById('shuffleAnswers').checked;
  showDetails = document.getElementById('showDetails').checked;

  if (showDetails) {
    var details = /*#__PURE__*/React.createElement("nav", {
      className: "navbar navbar-expand-lg navbar-light bg-light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-fluid"
    }, /*#__PURE__*/React.createElement("span", {
      className: "navbar-brand"
    }, pin), /*#__PURE__*/React.createElement("span", {
      className: "navbar-brand navbar-center"
    }, name || "Quizlet.JS Bot"), /*#__PURE__*/React.createElement("span", {
      className: "navbar-brand",
      id: "teamName"
    }, "Await Team Selection")));
    ReactDOM.render(details, document.getElementById('gameInfo'));
  }

  try {
    Game = new Quizlet(pin, name);
  } catch (e) {
    alert(e);
    location.reload();
  }

  Game.on('error', error => {
    alert(error);
    location.reload();
  });
  Game.joinGame();
  Game.on('connect', () => {
    ReactDOM.render(waitingScreen, document.getElementById('root'));
  });
  Game.on('teamAssignments', (teamName, playerNames) => {
    delete playerNames[playerNames.indexOf(Game.name)];
    var teamScreen = /*#__PURE__*/React.createElement("div", {
      className: "container text-center"
    }, /*#__PURE__*/React.createElement("h1", null, "You're In!"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h4", {
      className: "text-secondary"
    }, "The Host has assigned teams!"), /*#__PURE__*/React.createElement("h4", null, "You are on the ", animalNames[teamName], " with ", playerNames.join(', ')));
    ReactDOM.render(teamScreen, document.getElementById('root'));

    if (showDetails) {
      ReactDOM.render(animalNames[teamName], document.getElementById('teamName'));
    }
  });
  Game.on('question', (questionName, possibleAnswers, correctAnswer) => {
    renderQuestionInfo(questionName, possibleAnswers, correctAnswer);

    if (autoCorrect) {
      Game.answer(correctAnswer);
    }
  });
  Game.on('teamQuestion', (questionName, possibleAnswers, correctAnswer) => {
    renderQuestionInfo(questionName, possibleAnswers, correctAnswer);
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
  Game.on('replay', () => {
    ReactDOM.render(waitingScreen, document.getElementById('root'));
  });
}

function renderQuestionInfo(name, choices, answer) {
  var questionScreenPart = /*#__PURE__*/React.createElement("h2", null, name);
  var choiceCards = [];

  if (shuffleAnswers) {
    shuffle(choices);
  }

  choices.forEach((choice, idx) => {
    choiceCards.push(choiceTemplate(choice, idx, choice == answer));
  });
  var choiceScreenPart = /*#__PURE__*/React.createElement("div", {
    className: "d-grid gap-2"
  }, choiceCards);
  var questionScreen = /*#__PURE__*/React.createElement("div", {
    className: "container text-center"
  }, questionScreenPart, choiceScreenPart);
  ReactDOM.render(questionScreen, document.getElementById("root"));
}

function choiceTemplate(choice, key, isCorrect) {
  if (!choice) return "";

  if (autoCorrect) {
    if (isCorrect) {
      return /*#__PURE__*/React.createElement("button", {
        className: "btn btn-block btn-success",
        key: key,
        disabled: true
      }, choice);
    } else {
      return /*#__PURE__*/React.createElement("button", {
        className: "btn btn-block btn-danger",
        key: key,
        disabled: true
      }, choice);
    }
  }

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
      key: key,
      disabled: blockIncorrect
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
}, "Loading...")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h1", null, "Loading"));
const pinScreen = /*#__PURE__*/React.createElement("div", {
  className: "container"
}, /*#__PURE__*/React.createElement("div", {
  className: "text-center container"
}, /*#__PURE__*/React.createElement("h1", null, /*#__PURE__*/React.createElement("a", {
  style: {
    textDecoration: 'none'
  },
  className: "text-primary",
  href: "//github.com/RedYetiDev/Quizlet.JS"
}, "Quizlet.JS"), " Web Version"), /*#__PURE__*/React.createElement("h4", null, "Made possible by ", /*#__PURE__*/React.createElement("a", {
  style: {
    textDecoration: 'none'
  },
  className: "text-primary",
  href: "//github.com/RedYetiDev/"
}, "RedYetiDev")), /*#__PURE__*/React.createElement("h6", null, "Thank you to ", /*#__PURE__*/React.createElement("a", {
  style: {
    textDecoration: 'none'
  },
  className: "text-primary",
  href: "//github.com/netnr"
}, "netnr"), " for ", /*#__PURE__*/React.createElement("a", {
  style: {
    textDecoration: 'none'
  },
  className: "text-primary",
  href: "//cors.eu.org"
}, "cors.eu.org"), ". This project would not have been possible without it")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
  className: "form-label"
}, "Game Options"), /*#__PURE__*/React.createElement("div", {
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
})), /*#__PURE__*/React.createElement("label", {
  className: "form-label"
}, "Bot Options"), /*#__PURE__*/React.createElement("div", {
  className: "mb-3 btn-group form-control"
}, /*#__PURE__*/React.createElement("input", {
  id: "autoCorrect",
  className: "btn-check",
  type: "checkbox",
  onChange: () => {
    if (document.getElementById('autoCorrect').checked) {
      document.getElementById('blockIncorrect').disabled = true;
      document.getElementById('showCorrect').disabled = true;
      document.getElementById('showCorrect').checked = true;
      document.getElementById('blockIncorrect').checked = true;
      document.getElementById('bil').classList.add('btn-outline-success');
      document.getElementById('bil').classList.remove('btn-outline-danger');
    } else {
      document.getElementById('bil').classList.remove('btn-outline-success');
      document.getElementById('bil').classList.add('btn-outline-danger');
      document.getElementById('blockIncorrect').disabled = true;
      document.getElementById('showCorrect').disabled = false;
      document.getElementById('showCorrect').checked = false;
      document.getElementById('blockIncorrect').checked = false;
    }
  }
}), /*#__PURE__*/React.createElement("label", {
  className: "btn btn-outline-success",
  htmlFor: "autoCorrect"
}, "Auto Answer Correctly"), /*#__PURE__*/React.createElement("input", {
  id: "showCorrect",
  className: "btn-check",
  type: "checkbox",
  onChange: () => {
    if (!document.getElementById('showCorrect').checked) {
      document.getElementById('blockIncorrect').checked = false;
      document.getElementById('bil').classList.remove('btn-outline-success');
      document.getElementById('bil').classList.add('btn-outline-danger');
      document.getElementById('blockIncorrect').disabled = true;
    } else {
      document.getElementById('bil').classList.add('btn-outline-success');
      document.getElementById('bil').classList.remove('btn-outline-danger');
      document.getElementById('blockIncorrect').disabled = false;
    }
  }
}), /*#__PURE__*/React.createElement("label", {
  className: "btn btn-outline-success",
  htmlFor: "showCorrect"
}, "Show Correct Answers"), /*#__PURE__*/React.createElement("input", {
  id: "blockIncorrect",
  className: "btn-check",
  type: "checkbox",
  disabled: true,
  onChange: () => {
    if (!document.getElementById('showCorrect').checked) {
      document.getElementById('blockIncorrect').checked = false;
      document.getElementById('bil').classList.remove('btn-outline-success');
      document.getElementById('bil').classList.add('btn-outline-danger');
      document.getElementById('blockIncorrect').disabled = true;
    } else {
      document.getElementById('bil').classList.add('btn-outline-success');
      document.getElementById('bil').classList.remove('btn-outline-danger');
      document.getElementById('blockIncorrect').disabled = false;
    }
  }
}), /*#__PURE__*/React.createElement("label", {
  className: "btn btn-outline-danger",
  id: "bil",
  htmlFor: "blockIncorrect"
}, "Disable Incorrect Answers")), /*#__PURE__*/React.createElement("label", {
  className: "form-label"
}, "Display Options"), /*#__PURE__*/React.createElement("div", {
  className: "mb-3 btn-group form-control"
}, /*#__PURE__*/React.createElement("input", {
  id: "shuffleAnswers",
  className: "btn-check",
  type: "checkbox"
}), /*#__PURE__*/React.createElement("label", {
  className: "btn btn-outline-success",
  htmlFor: "shuffleAnswers"
}, "Shuffle Answer Order"), /*#__PURE__*/React.createElement("input", {
  id: "showDetails",
  className: "btn-check",
  type: "checkbox"
}), /*#__PURE__*/React.createElement("label", {
  className: "btn btn-outline-success",
  htmlFor: "showDetails"
}, "Show Game Details")), /*#__PURE__*/React.createElement("button", {
  className: "btn btn-primary form-control",
  onClick: runGame
}, "Join Game"));
const waitingScreen = /*#__PURE__*/React.createElement("div", {
  className: "container text-center"
}, /*#__PURE__*/React.createElement("h1", null, "You're In!"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h4", {
  className: "text-secondary"
}, "Waiting for the host to start the game"));
ReactDOM.render(pinScreen, document.getElementById('root'));