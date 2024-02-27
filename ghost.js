class Ghost {
  constructor(positionX, positionY, width, height, speed, direction, initialColorX, initialColorY, follower) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = direction;
    this.currentFrameAnimation = 0;
    this.desiredDirection = DIRECCION.DERECHA;
    this.initialColorX = initialColorX;
    this.initialColorY = initialColorY;
    this.follower = follower;
    setInterval(() => {
      if (!this.follower) {
        if (Math.random() > 0.5) this.direccionPerpendicular();
        if (Math.random() > 0.2)
          switch (this.direction) {
            case DIRECCION.ABAJO:
            case DIRECCION.ARRIBA:
              this.desiredDirection = Math.random() > 0.5 ? DIRECCION.IZQUIERDA : DIRECCION.DERECHA;
              break;
            case DIRECCION.DERECHA:
            case DIRECCION.IZQUIERDA:
              this.desiredDirection = Math.random() > 0.5 ? DIRECCION.ARRIBA : DIRECCION.ABAJO;
              break;
          }
      } else {
        this.findPacman()
      }
    }, 1200);
  }

  move() {
    if (this.desiredDirection && this.desiredDirection !== this.direction) this.intentarGirar();

    this.moveForward(this.direction);
    if (this.checkColission()) {
      this.moveBackward(this.direction);
      this.direccionPerpendicular();
    }
  }

  direccionPerpendicular() {
    switch (this.direction) {
      case DIRECCION.ABAJO:
      case DIRECCION.ARRIBA:
        this.direction = Math.random() > 0.5 ? DIRECCION.IZQUIERDA : DIRECCION.DERECHA;
        break;
      case DIRECCION.DERECHA:
      case DIRECCION.IZQUIERDA:
        this.direction = Math.random() > 0.5 ? DIRECCION.ARRIBA : DIRECCION.ABAJO;
        break;
    }
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

  draw() {
    canvasContext.save();

    canvasContext.drawImage(ghostsFrames, this.initialColorX, this.initialColorY, 120, 120, this.positionX, this.positionY, this.width, this.height);

    canvasContext.restore();
  }

  checkPacmanColission(pacman) {
    const pX = Math.floor((pacman.positionX + pacman.width / 2) / boxSize);
    const pY = Math.floor((pacman.positionY + pacman.height / 2) / boxSize);
    const currentX = Math.floor((this.positionX + this.width / 2) / boxSize);
    const currentY = Math.floor((this.positionY + this.height / 2) / boxSize);

    if (pX === currentX && pY === currentY) {
      return true;
    } else return false;
  }

  findPacman() {
    const dX = Math.floor((pacman.positionX + pacman.width / 2) / boxSize) - Math.floor((this.positionX + this.width / 2) / boxSize);
    const dY = Math.floor((pacman.positionY + pacman.height / 2) / boxSize) - Math.floor((this.positionY + this.height / 2) / boxSize);

    if (Math.abs(dX) > Math.abs(dY)) {
      this.desiredDirection = dX > 0 ? DIRECCION.DERECHA : DIRECCION.IZQUIERDA;
    } else {
      this.desiredDirection = dY > 0 ? DIRECCION.ABAJO : DIRECCION.ARRIBA;
    }
  }
}
