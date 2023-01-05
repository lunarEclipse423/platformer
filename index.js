const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const canvasScaleFactor = 4;
const scaledCanvas = {
  width: canvas.width / canvasScaleFactor,
  height: canvas.height / canvasScaleFactor,
};
const collisionSymbol = 202;
const tileSize = 16;
const keys = {
  d: {
    isPressed: false,
  },
  a: {
    isPressed: false,
  },
  lastPressed: "d",
};
const floorCollisions2D = [];
const rowLength = 36;
for (let i = 0; i < floorCollisions.length; i += rowLength) {
  floorCollisions2D.push(floorCollisions.slice(i, i + rowLength));
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === collisionSymbol) {
      collisionBlocks.push(
        new CollisionBlock({ position: { x: x * tileSize, y: y * tileSize } })
      );
    }
  });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += rowLength) {
  platformCollisions2D.push(platformCollisions.slice(i, i + rowLength));
}
const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === collisionSymbol) {
      platformCollisionBlocks.push(
        new CollisionBlock({ position: { x: x * tileSize, y: y * tileSize }, height: 4 })
      );
    }
  });
});

const player = new Player({
  canvas: { width: canvas.width, height: canvas.height },
  position: { x: 100, y: 300 },
  collisionBlocks,
  platformCollisionBlocks,
  imgSrc: "./assets/warrior/Idle.png",
  frameRate: 8,
  animations: {
    Idle: {
      imgSrc: "./assets/warrior/Idle.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    IdleLeft: {
      imgSrc: "./assets/warrior/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    Run: {
      imgSrc: "./assets/warrior/Run.png",
      frameRate: 8,
      frameBuffer: 4,
    },
    RunLeft: {
      imgSrc: "./assets/warrior/RunLeft.png",
      frameRate: 8,
      frameBuffer: 4,
    },
    Jump: {
      imgSrc: "./assets/warrior/Jump.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    JumpLeft: {
      imgSrc: "./assets/warrior/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      imgSrc: "./assets/warrior/Fall.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      imgSrc: "./assets/warrior/FallLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
  },
});
const background = new Sprite({
  position: { x: 0, y: 0 },
  imgSrc: "./assets/bg/background.png",
});

const backgroundImageHeight = 432;
const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

const animate = () => {
  window.requestAnimationFrame(animate);
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.save();
  context.scale(4, 4);
  context.translate(camera.position.x, camera.position.y);
  background.update(context);

  player.draw(context);
  player.checkForHorizontalCanvasCollision({ mapWidth: 576 });
  player.update(context);
  player.velocity.x = 0;
  
  if (keys.d.isPressed) {
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.shouldPanCameraToTheLeft({ canvas, camera, mapWidth: 576 });
  } else if (keys.a.isPressed) {
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
    player.shouldPanCameraToTheRight({ camera });
  } else if (player.velocity.y === 0) {
    if (keys.lastPressed === "d") {
      player.switchSprite("Idle");
    } else if (keys.lastPressed === "a") {
      player.switchSprite("IdleLeft");
    }
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera });
    if (keys.lastPressed === "d") {
      player.switchSprite("Jump");
    } else if (keys.lastPressed === "a") {
      player.switchSprite("JumpLeft");
    }
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas, mapHeight: 432 });
    if (keys.lastPressed === "d") {
      player.switchSprite("Fall");
    } else if (keys.lastPressed === "a") {
      player.switchSprite("FallLeft");
    }
  }
  context.restore();
};

animate();

window.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyD":
      keys.d.isPressed = true;
      keys.lastPressed = "d";
      break;
    case "KeyA":
      keys.a.isPressed = true;
      keys.lastPressed = "a";
      break;
    case "KeyW":
      player.velocity.y = -4;
      break;
    case "Space":
      player.velocity.y = -4;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyD":
      keys.d.isPressed = false;
      break;
    case "KeyA":
      keys.a.isPressed = false;
      break;
  }
});
