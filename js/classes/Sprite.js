class Sprite {
  constructor({ position, imgSrc, frameRate = 1, frameBuffer = 3, scale = 1 }) {
    this.position = position;
    this.scale = scale;
    this.frameRate = frameRate;
    this.loaded = false;
    this.img = new Image();
    this.img.src = imgSrc;
    this.img.onload = () => {
      this.width = (this.img.width / this.frameRate) * this.scale;
      this.height = this.img.height * this.scale;
      this.loaded = true;
    };
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;
  }

  draw(context) {
    if (!this.img) {
      return;
    }
    const cropbox = {
      position: {
        x: this.currentFrame * (this.img.width / this.frameRate),
        y: 0,
      },
      width: this.img.width / this.frameRate,
      height: this.img.height,
    };
    context.drawImage(
      this.img,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(context) {
    this.draw(context);
    this.updateFrames();
  }

  updateFrames() {
    this.elapsedFrames++;

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
}
