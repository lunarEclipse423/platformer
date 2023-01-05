class Player extends Sprite {
  gravity = 0.2;

  constructor({
    canvas,
    position = {
      x: 0,
      y: 0,
    },
    collisionBlocks,
    platformCollisionBlocks,
    imgSrc,
    frameRate,
    scale = 0.5,
    animations,
  }) {
    super({ imgSrc, frameRate, scale });
    this.canvas = canvas;
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };
    this.animations = animations;
    for (let key in this.animations) {
      const img = new Image();
      img.src = this.animations[key].imgSrc;
      this.animations[key].img = img;
    }

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  shouldPanCameraToTheLeft({ canvas, camera, mapWidth }) {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
    const scaledDownCanvasWidth = canvas.width / 4;

    if (cameraboxRightSide >= mapWidth) {
      return;
    }
    if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight({ camera }) {
    if (this.camerabox.position.x <= 0) {
      return;
    }
    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraDown({ camera }) {
    if (this.camerabox.position.y + this.velocity.y <= 0) {
      return;
    }
    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  shouldPanCameraUp({ camera, canvas, mapHeight }) {
    if (
      this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
      mapHeight
    ) {
      return;
    }
    const scaledDownCanvasHeight = canvas.height / 4;
    if (
      this.camerabox.position.y + this.camerabox.height >=
      Math.abs(camera.position.y) + scaledDownCanvasHeight
    ) {
      camera.position.y -= this.velocity.y;
    }
  }

  switchSprite(key) {
    if (this.img !== this.animations[key].img && this.loaded) {
      this.currentFrame = 0;
      this.img = this.animations[key].img;
      this.frameBuffer = this.animations[key].frameBuffer;
      this.frameRate = this.animations[key].frameRate;
    }
  }

  update(context) {
    this.updateFrames();
    this.updateHitbox();
    this.updateCamerabox();
    // context.fillStyle = "rgba(0, 0, 255, 0.3)";
    // context.fillRect(
    //   this.camerabox.position.x,
    //   this.camerabox.position.y,
    //   this.camerabox.width,
    //   this.camerabox.height
    // );

    // context.fillStyle = "rgba(255, 0, 0, 0.3)";
    // context.fillRect(
    //   this.hitbox.position.x,
    //   this.hitbox.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // );
    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVertivalCollisions();
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: 14,
      height: 27,
    };
  }

  checkForHorizontalCanvasCollision({ mapWidth }) {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x >= mapWidth ||
      this.hitbox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0;
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (collision({ firstObj: this.hitbox, secondObj: collisionBlock })) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.position.y += this.velocity.y;
  }

  checkForVertivalCollisions() {
    // ground collision blocks detection
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (collision({ firstObj: this.hitbox, secondObj: collisionBlock })) {
        if (this.velocity.y > 0) {
          const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    // platform collision blocks detection
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];
      if (
        platformCollision({ firstObj: this.hitbox, secondObj: platformCollisionBlock })
      ) {
        if (this.velocity.y > 0) {
          const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.velocity.y = 0;
          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
