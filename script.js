let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let pvpBtn = document.querySelector("#pvp-mode");
let aiBtn = document.querySelector("#ai-mode");
let mainGame = document.querySelector("#main-game");
let modeSelection = document.querySelector(".mode-selection");
let backBtn = document.querySelector("#back-btn"); // 🔹 Select the back button

let isPvP = true;
let turnO = true;
let gameOver = false;

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8]
];

// Mode Selection
pvpBtn.addEventListener("click", () => {
  isPvP = true;
  startGame();
});

aiBtn.addEventListener("click", () => {
  isPvP = false;
  startGame();
});

function startGame() {
  mainGame.classList.remove("hide");
  modeSelection.classList.add("hide");
  resetGame();
}

// 🔹 Back Button Event
backBtn.addEventListener("click", () => {
  mainGame.classList.add("hide");
  modeSelection.classList.remove("hide");
  resetGame(); // Optional: clear board when returning
});

// Game Reset
function resetGame() {
  turnO = true;
  gameOver = false;
  enableBoxes();
  msgContainer.classList.add("hide");
  boxes.forEach(box => box.classList.remove("win-box"));
}

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "" || gameOver) return;

    if (isPvP) {
      // Player vs Player Mode
      box.innerText = turnO ? "O" : "X";
      box.disabled = true;
      checkWinner();
      if (!gameOver) {
        turnO = !turnO;
      }
    } else {
      // Player vs AI Mode
      if (!turnO) return;

      box.innerText = "O";
      box.disabled = true;
      checkWinner();

      if (!gameOver) {
        turnO = false;
        setTimeout(() => {
          aiMove();
          if (!gameOver) turnO = true;
        }, 500);
      }
    }
  });
});

// AI Move (Smart)
function aiMove() {
  if (gameOver) return;

  let bestMove = getBestMove();
  if (bestMove !== -1) {
    boxes[bestMove].innerText = "X";
    boxes[bestMove].disabled = true;
  }

  checkWinner();
  if (!gameOver) turnO = true;
}

function getBestMove() {
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].innerText === "") {
      boxes[i].innerText = "X";
      if (isWinner("X")) {
        boxes[i].innerText = "";
        return i;
      }
      boxes[i].innerText = "";
    }
  }

  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].innerText === "") {
      boxes[i].innerText = "O";
      if (isWinner("O")) {
        boxes[i].innerText = "";
        return i;
      }
      boxes[i].innerText = "";
    }
  }

  if (boxes[4].innerText === "") return 4;

  let corners = [0, 2, 6, 8];
  for (let idx of corners) {
    if (boxes[idx].innerText === "") return idx;
  }

  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].innerText === "") return i;
  }

  return -1;
}

function isWinner(player) {
  return winPatterns.some(pattern => {
    return pattern.every(index => boxes[index].innerText === player);
  });
}

function disableBoxes() {
  boxes.forEach((box) => (box.disabled = true));
}

function enableBoxes() {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
}

function showWinner(winner) {
  let message = "It's a Draw!";
  if (winner === "O") {
    message = isPvP ? "🎉 Winner is Player O!" : "🎉 Winner is Player!";
  } else if (winner === "X") {
    message = isPvP ? "🎉 Winner is Player X!" : "💻 Winner is AI!";
  }
  msg.innerText = message;
  msgContainer.classList.remove("hide");
  disableBoxes();
  gameOver = true;
}

function checkWinner() {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let val1 = boxes[a].innerText;
    let val2 = boxes[b].innerText;
    let val3 = boxes[c].innerText;

    if (val1 && val1 === val2 && val2 === val3) {
      boxes[a].classList.add("win-box");
      boxes[b].classList.add("win-box");
      boxes[c].classList.add("win-box");
      showWinner(val1);
      return;
    }
  }

  let allFilled = Array.from(boxes).every((box) => box.innerText !== "");
  if (allFilled && !gameOver) {
    showWinner("Draw");
  }
}

// Reset buttons
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
