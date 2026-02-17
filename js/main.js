import { STATE } from "./state.js";
import { updateRotation } from "./physics.js";
import { drawWheel } from "./wheel.js";
import { updateBall } from "./physics.js";
import { drawBall } from "./ball.js";

const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

let rotation = 0;
let velocity = 0;
let currentState = STATE.IDLE;
let ballAngle = 0;
let ballVelocity = 0;
let ballRadiusRatio = 1;

function resize(){
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  canvas.width = size;
  canvas.height = size;
}
resize();
window.addEventListener("resize", resize);

spinBtn.onclick = () => {
  if(currentState !== STATE.IDLE) return;

  velocity = 0.3 + Math.random()*0.05;      // ホイール
  ballVelocity = 0.6 + Math.random()*0.1;  // 球は速く
  ballAngle = 0;

  currentState = STATE.SPINNING;
};

function loop(){
  if(currentState === STATE.SPINNING){

    const wheelResult = updateRotation(rotation, velocity);
    rotation = wheelResult.rotation;
    velocity = wheelResult.velocity;

    const ballResult = updateBall(ballAngle, ballVelocity);
    ballAngle = ballResult.angle;
    ballVelocity = ballResult.velocity;

    if(velocity < 0.002 && ballVelocity < 0.01){
      velocity = 0;
      ballVelocity = 0;
      currentState = STATE.IDLE;
    }
  }

  drawWheel(ctx, canvas, rotation);
  drawBall(ctx, canvas, ballAngle, ballRadiusRatio);

  requestAnimationFrame(loop);
}

loop();

