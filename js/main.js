import { STATE } from "./state.js";
import { updateRotation } from "./physics.js";
import { drawWheel } from "./wheel.js";
import { updateBall } from "./physics.js";
import { drawBall } from "./ball.js";
import { updateDrop } from "./physics.js";

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
  ballRadiusRatio = 1;

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

    // 球が一定以下で落下開始
    if(ballVelocity < 0.15){
      currentState = STATE.DROPPING;
    }
  }

  if(currentState === STATE.DROPPING){

    const ballResult = updateBall(ballAngle, ballVelocity);
    ballAngle = ballResult.angle;
    ballVelocity = ballResult.velocity;

    radiusRatio = updateDrop(radiusRatio);

    // 落ちきったら停止準備
    if(radiusRatio <= 0.55 && ballVelocity < 0.02){
      currentState = STATE.IDLE;
      ballVelocity = 0;
      velocity = 0;
    }
  }

  drawWheel(ctx, canvas, rotation);
  drawBall(ctx, canvas, ballAngle, radiusRatio);

  requestAnimationFrame(loop);
}

loop();


