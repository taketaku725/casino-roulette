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

  // --- 回転更新 ---
  const wheelResult = updateRotation(rotation, velocity);
  rotation = wheelResult.rotation;
  velocity = wheelResult.velocity;

  const ballResult = updateBall(ballAngle, ballVelocity);
  ballAngle = ballResult.angle;
  ballVelocity = ballResult.velocity;

  // --- 落下判定 ---
  if(ballVelocity < 0.15 && ballRadiusRatio > 0.55){
    ballRadiusRatio -= 0.01;
  }

  // --- ポケット壁衝突判定 ---
  const deflectors = 12;
  const deflectorSlice = (Math.PI * 2) / deflectors;

  const adjusted = (ballAngle + rotation) % (Math.PI*2);
  const modAngle = adjusted < 0 ? adjusted + Math.PI*2 : adjusted;

  const distanceFromDeflector = modAngle % deflectorSlice;

  if(
    ballRadiusRatio < 0.75 &&
    ballRadiusRatio > 0.6 &&
    distanceFromDeflector < 0.02 &&
    Math.abs(ballVelocity) > 0.02
  ){
    ballVelocity = applyDeflectorBounce(ballVelocity);
  }

  // --- 完全停止判定 ---
  if(ballVelocity === 0 && velocity === 0 && ballRadiusRatio <= 0.55){
    if(resultNumber === null){
      resultNumber = getWinningNumber(ballAngle, rotation);
      document.getElementById("result").textContent = "Result: " + resultNumber;
    }
  }

  drawWheel(ctx, canvas, rotation);
  drawBall(ctx, canvas, ballAngle, ballRadiusRatio);

  requestAnimationFrame(loop);
}

loop();




