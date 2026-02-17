import { STATE } from "./state.js";
import { updateRotation, updateBall, updateDrop } from "./physics.js";
import { drawWheel } from "./wheel.js";
import { drawBall } from "./ball.js";
import { updateBounce } from "./physics.js";
import { numbers, getWinningNumber } from "./result.js";

const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

let rotation = 0;
let velocity = 0;

let ballAngle = 0;
let ballVelocity = 0;
let ballRadiusRatio = 1;

let bounceCount = 0;
let resultNumber = null;

let currentState = STATE.IDLE;

// リサイズ対応
function resize(){
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  canvas.width = size;
  canvas.height = size;
}
resize();
window.addEventListener("resize", resize);

// スピン開始
spinBtn.onclick = () => {
  if(currentState !== STATE.IDLE) return;

  velocity = 0.3 + Math.random() * 0.05;
  ballVelocity = 0.6 + Math.random() * 0.1;

  ballAngle = 0;
  ballRadiusRatio = 1;

  bounceCount = 3 + Math.floor(Math.random()*2); // 3〜4回
  resultNumber = null;
  document.getElementById("result").textContent = "";

  currentState = STATE.SPINNING;
};

// メインループ
function loop(){

  if(currentState === STATE.SPINNING){

    // ホイール更新
    const wheelResult = updateRotation(rotation, velocity);
    rotation = wheelResult.rotation;
    velocity = wheelResult.velocity;

    // 球更新
    const ballResult = updateBall(ballAngle, ballVelocity);
    ballAngle = ballResult.angle;
    ballVelocity = ballResult.velocity;

    // 一定以下で落下開始
    if(ballVelocity < 0.15){
      currentState = STATE.DROPPING;
    }
  }

  if(currentState === STATE.DROPPING){

    const ballResult = updateBall(ballAngle, ballVelocity);
    ballAngle = ballResult.angle;
    ballVelocity = ballResult.velocity;

    ballRadiusRatio = updateDrop(ballRadiusRatio);

    // 内側到達＋減速で停止
    if(ballRadiusRatio <= 0.55 && ballVelocity < 0.02){
      currentState = STATE.IDLE;
      velocity = 0;
      ballVelocity = 0;
    }
  }

  // 描画
  drawWheel(ctx, canvas, rotation);
  drawBall(ctx, canvas, ballAngle, ballRadiusRatio);

  requestAnimationFrame(loop);
}

loop();

