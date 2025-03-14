// Card Data
const cards = [
  { name: "Florante at Laura", cost: 2, effect: "Deal 10 damage", origin: "Florante is the protagonist of the Philippine epic 'Florante at Laura'.", image: "images/florante.png", attack: 10 },
  { name: "Noli Me Tangere", cost: 3, effect: "Draw +1 card", origin: "Noli Me Tangere is a novel by José Rizal about Philippine society.", image: "images/noli.png", attack: 5 },
  { name: "Hudhud ni Aliguyon", cost: 2, effect: "Damage x2", origin: "Hudhud is an ancient Ifugao chant about heroism and tradition.", image: "images/hudhud.png", attack: 10 },
  { name: "Ibong Adarna", cost: 1, effect: "Heal +10 HP and gain +5 mana", origin: "Ibong Adarna is a mythical bird from Philippine folklore.", image: "images/ibon.png", attack: 0 }
];

// Game State
let playerHP = 100;
let botHP = 100;
let playerMana = 5;
let playerHand = [];
let isPlayerTurn = true;
let gameOver = false;
let selectedCardIndex = null;

// DOM Elements
const playerHPEl = document.getElementById("player-health");
const botHPEl = document.getElementById("bot-health");
const playerManaEl = document.getElementById("player-mana");
const playerHandEl = document.getElementById("player-hand");
const playedCardsEl = document.getElementById("played-cards");
const cardNameEl = document.getElementById("card-name");
const cardEffectEl = document.getElementById("card-effect");
const cardOriginEl = document.getElementById("card-origin");
const playCardBtn = document.getElementById("play-card");
const passTurnBtn = document.getElementById("pass-turn");
const restartBtn = document.getElementById("restart-game");
const logEl = document.getElementById("log");

// Initialize Game
function initGame() {
  playerHP = 100;
  botHP = 100;
  playerMana = 5;
  playerHand = [];
  isPlayerTurn = true;
  gameOver = false;
  selectedCardIndex = null;
  logEl.innerHTML = ""; // Clear log
  shuffleDeck();
  dealCards();
  updateUI();
}

// Shuffle Deck
function shuffleDeck() {
  playerHand = [...cards].sort(() => Math.random() - 0.5).slice(0, 3);
}

// Deal Cards
function dealCards() {
  playerHandEl.innerHTML = "";
  playerHand.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");
    cardEl.style.backgroundImage = `url(${card.image})`;
    cardEl.addEventListener("click", () => selectCard(index));
    playerHandEl.appendChild(cardEl);
  });
}

// Select Card
function selectCard(index) {
  selectedCardIndex = index;
  const selectedCard = playerHand[index];
  cardNameEl.textContent = selectedCard.name;
  cardEffectEl.textContent = `Effect: ${selectedCard.effect}`;
  cardOriginEl.textContent = `Origin: ${selectedCard.origin}`;
}

// Play Card
playCardBtn.addEventListener("click", () => {
  if (isPlayerTurn && !gameOver && selectedCardIndex !== null) {
    const selectedCard = playerHand[selectedCardIndex];
    if (playerMana >= selectedCard.cost) {
      playerMana -= selectedCard.cost;
      applyCardEffect(selectedCard);
      playerHand.splice(selectedCardIndex, 1);
      drawCard();
      selectedCardIndex = null;
      updateUI();
      addToLog(`You played ${selectedCard.name} and ${selectedCard.effect}.`);
      endTurn();
    } else {
      alert("Not enough mana!");
    }
  } else {
    alert("Please select a card first!");
  }
});

// Pass Turn
passTurnBtn.addEventListener("click", () => {
  if (isPlayerTurn && !gameOver) {
    playerMana += 2; // Restore 2 mana for passing
    addToLog("You passed your turn and gained +2 mana.");
    endTurn();
  }
});

// Apply Card Effect
function applyCardEffect(card) {
  if (card.name === "Florante at Laura") {
    botHP -= card.attack;
  } else if (card.name === "Ibong Adarna") {
    playerHP += 10;
    playerMana += 5;
  } else if (card.name === "Hudhud ni Aliguyon") {
    botHP -= card.attack * 2;
  } else if (card.name === "Noli Me Tangere") {
    playerHand.push(cards[Math.floor(Math.random() * cards.length)]);
  }
  checkGameOver();
}

// Bot Attack
function botAttack() {
  const damage = 10;
  playerHP -= damage;
  document.getElementById("player-health").classList.add("hit-animation");
  setTimeout(() => {
    document.getElementById("player-health").classList.remove("hit-animation");
  }, 500);
  addToLog(`Bot attacked you for ${damage} damage!`);
  checkGameOver();
}

// End Turn
function endTurn() {
  isPlayerTurn = !isPlayerTurn;
  if (!isPlayerTurn && !gameOver) {
    setTimeout(() => {
      botAttack();
      endTurn();
    }, 1000);
  } else if (isPlayerTurn && !gameOver) {
    playerMana += 2; // Restore 2 mana at the start of the Player's turn
    drawCard();
    addToLog("Your turn started. You gained +2 mana and drew a card.");
  }
  updateUI();
}

// Draw Card
function drawCard() {
  if (playerHand.length < 5) {
    playerHand.push(cards[Math.floor(Math.random() * cards.length)]);
  }
}

// Check Game Over
function checkGameOver() {
  if (playerHP <= 0) {
    gameOver = true;
    addToLog("Bot wins!");
    alert("Bot wins!");
  } else if (botHP <= 0) {
    gameOver = true;
    addToLog("You win!");
    alert("You win!");
  }
}

// Update UI
function updateUI() {
  playerHPEl.style.width = `${(playerHP / 100) * 200}px`;
  botHPEl.style.width = `${(botHP / 100) * 200}px`;

  document.getElementById("player-hp-text").textContent = playerHP;
  document.getElementById("bot-hp-text").textContent = botHP;

  playerManaEl.textContent = playerMana;

  dealCards();
}

// Add to Game Log
function addToLog(message) {
  const logEntry = document.createElement("p");
  logEntry.textContent = message;
  logEl.appendChild(logEntry);
  logEl.scrollTop = logEl.scrollHeight;
}

// Restart Game
restartBtn.addEventListener("click", () => {
  initGame();
  addToLog("Game restarted!");
});

// Start Game
initGame();