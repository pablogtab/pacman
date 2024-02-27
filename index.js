/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");

let canvasContext = canvas.getContext("2d");

const pacmanFrames = document.getElementById("pacman");
const ghostsFrames = document.getElementById("ghosts");

const boxSize = 24;
const coinSize = 4;
const lineWidth = 2;
const fps = 50;
let FRAME_COUNT = 0;
let SCORE_COUNT = 0;
let ghostNumber = 6;
let ghosts = [];
let pacman;

document.getElementById("fps").innerHTML = "FPS: " + fps;

const DIRECCION = {
  DERECHA: 0,
  ABAJO: 1,
  IZQUIERDA: 2,
  ARRIBA: 3,
};
const GHOSTS_COLOR = {
  ROJO: 0,
  NARANJA: 1,
  ROSA: 2,
  AZUL: 3,
};

const initialMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let map;

let gameLoopInterval;

const initGame = () => {
  SCORE_COUNT=0;
  map = initialMap.map((x) => Array.from(x));
  pacman = new Pacman(boxSize + 2, boxSize + 2, boxSize - 4, boxSize - 4, 4, DIRECCION.DERECHA);
  ghosts = [];
  for (let i = 0; i < ghostNumber; i++) {
    let color = i % 4;
    let initialColorX = color === 0 || color === 2 ? 0 : 180;
    let initialColorY = color > 1 ? 0 : 125;
    ghosts.push(new Ghost(boxSize * 10 + 2, boxSize * 10 + 2, boxSize - 4, boxSize - 4, 2, DIRECCION.DERECHA, initialColorX, initialColorY, color === 0));
  }
  gameLoopInterval = setInterval(() => {
    gameLoop();
  }, 1000 / fps);
};

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    stopGame()
    initGame();
  }
});

const gameLoop = () => {
  FRAME_COUNT++;
  drawMap();
  ghosts.forEach((ghost) => {
    ghost.draw();
    ghost.move();
    if (ghost.checkPacmanColission(pacman)) stopGame()
  });
  pacman.move();
  pacman.draw();
};

setInterval(() => {
  document.getElementById("fps").innerHTML = "FPS: " + FRAME_COUNT;
  if (FRAME_COUNT) FRAME_COUNT = 0;
}, 1000);

const drawMap = () => {
  map.forEach((fila, i) => {
    fila.forEach((value, j) => {
      dibujarCuadrado(boxSize * j, boxSize * i, boxSize, boxSize, value === 1 ? "blue" : "black");
      dibujarCuadrado(boxSize * j + lineWidth, boxSize * i + lineWidth, boxSize - 2 * lineWidth, boxSize - 2 * lineWidth, "black");
    });
  });
  map.forEach((fila, i) => {
    fila.forEach((value, j) => {
      if (value === 1) {
        if (map[i][j + 1] === 1) dibujarCuadrado(boxSize * (j + 1) - lineWidth, boxSize * i + lineWidth, 2 * lineWidth, boxSize - 2 * lineWidth, "black");
        if (map[i + 1]) {
          if (map[i + 1][j] === 1) dibujarCuadrado(boxSize * j + lineWidth, boxSize * (i + 1) - lineWidth, boxSize - 2 * lineWidth, 2 * lineWidth, "black");
        }
      }
    });
  });
  map.forEach((fila, i) => {
    fila.forEach((value, j) => {
      if (value === 0) dibujarCuadrado(boxSize * j + boxSize / 2 - coinSize / 2, boxSize * i + boxSize / 2 - coinSize, coinSize, coinSize, "yellow");
    });
  });
};

const dibujarCuadrado = (positionX, positionY, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(positionX, positionY, width, height);
};

const stopGame = ()=>{
  clearInterval(gameLoopInterval);
} 

initGame();

