class Pacman {
  constructor(positionX, positionY, width, height, speed, direction) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = direction;
    this.currentFrameAnimation = 0;
    this.desiredDirection = DIRECCION.DERECHA;

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") this.desiredDirection = DIRECCION.ARRIBA;
      if (event.key === "ArrowDown") this.desiredDirection = DIRECCION.ABAJO;
      if (event.key === "ArrowLeft") this.desiredDirection = DIRECCION.IZQUIERDA;
      if (event.key === "ArrowRight") this.desiredDirection = DIRECCION.DERECHA;
    });
  }

  move() {
    if (this.desiredDirection != this.direction && this.intentarGirar()) this.girar();
    else this.moveForward(this.direction);
    if (this.checkColission()) {
      this.moveBackward(this.direction);
    }
    this.eat();
  }

  moveForward(direction) {
    switch (direction) {
      case DIRECCION.ARRIBA:
        this.positionY -= this.speed;
        break;
      case DIRECCION.ABAJO:
        this.positionY += this.speed;
        break;
      case DIRECCION.IZQUIERDA:
        this.positionX -= this.speed;
        break;
      case DIRECCION.DERECHA:
        this.positionX += this.speed;
        break;
    }
  }

  checkColission() {
    const initialX = Math.floor(this.positionX / boxSize);
    const initialY = Math.floor(this.positionY / boxSize);
    const forwardedX = Math.floor((this.positionX + this.width) / boxSize);
    const forwardedY = Math.floor((this.positionY + this.height) / boxSize);
    if (map[forwardedY][forwardedX] === 1 || map[initialY][initialX] === 1 || map[forwardedY][initialX] === 1 || map[initialY][forwardedX] === 1) {
      return true;
    } else return false;
  }

  intentarGirar() {
    this.moveForward(this.desiredDirection);
    if (this.checkColission()) {
      this.moveBackward(this.desiredDirection);
    } else {
      this.direction = this.desiredDirection;
    }
  }

  moveBackward(direction) {
    switch (direction) {
      case DIRECCION.ARRIBA:
        this.positionY += this.speed;
        break;
      case DIRECCION.ABAJO:
        this.positionY -= this.speed;
        break;
      case DIRECCION.IZQUIERDA:
        this.positionX += this.speed;
        break;
      case DIRECCION.DERECHA:
        this.positionX -= this.speed;
        break;
    }
  }

  changeFrameAnimation() {
    this.currentFrameAnimation = this.currentFrameAnimation === 6 ? 0 : this.currentFrameAnimation + 1;
  }

  draw() {
    canvasContext.save();

    canvasContext.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);

    canvasContext.rotate((this.direction * 90 * Math.PI) / 180);

    canvasContext.translate(-this.positionX - this.width / 2, -this.positionY - this.height / 2);

    canvasContext.drawImage(pacmanFrames, this.currentFrameAnimation * this.width, 0, this.width, this.height, this.positionX, this.positionY, this.width, this.height);

    canvasContext.restore();
    this.changeFrameAnimation();
  }

  eat() {
    const initialX = Math.floor(this.positionX / boxSize);
    const initialY = Math.floor(this.positionY / boxSize);
    const forwardedX = Math.floor((this.positionX + this.width) / boxSize);
    const forwardedY = Math.floor((this.positionY + this.height) / boxSize);

    if (map[initialY][initialX] === 0) {
      map[initialY][initialX] = 2;
      this.actualizarScore();
    } else if (map[forwardedY][initialX] === 0) {
      map[forwardedY][initialX] = 2;
      this.actualizarScore();
    } else if (map[initialY][forwardedX] === 0) {
      map[initialY][forwardedX] = 2;
      this.actualizarScore();
    } else if (map[forwardedY][forwardedX] === 0) {
      map[forwardedY][forwardedX] = 2;
      this.actualizarScore();
    }
  }

  actualizarScore() {
    SCORE_COUNT++;
    document.getElementById("score").innerHTML = 'Score: '+ SCORE_COUNT;
  }


  
}
