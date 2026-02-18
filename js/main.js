import { updateRotation, updateBall, applyDeflectorBounce, updateHeight } from "./physics.js";
import { drawWheel } from "./wheel.js";
import { drawBall } from "./ball.js";
import { getWinningNumber } from "./result.js";

const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultEl = document.getElementById("result");

let rotation = 0;
let velocity = 0;

let ballAngle = 0;
let ballVelocity = 0;
let ballRadiusRatio = 1;
let ballHeight = 0;

let resultNumber = null;
let settleVibration = 0;

let isLocked = false;
let lockedOffset = 0;

// ===== リサイズ =====
function resize(){
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  canvas.width = size;
  canvas.height = size;
}
resize();
window.addEventListener("resize", resize);

// ===== スピン開始 =====
spinBtn.onclick = () => {

  velocity = 0.3 + Math.random()*0.05;
  ballVelocity = 0.6 + Math.random()*0.1;

  ballAngle = 0;
  ballRadiusRatio = 1;
  ballHeight = 0;

  resultNumber = null;
  settleVibration = 0;

  if(resultEl) resultEl.textContent = "";
};

// ===== メインループ =====
function loop(){

  // ---- 回転更新 ----
  const wheelResult = updateRotation(rotation, velocity);
  rotation = wheelResult.rotation;
  velocity = wheelResult.velocity;

  // ==============================
  // ロックしていない時だけ物理更新
  // ==============================
  if(!isLocked){

    const ballResult = updateBall(ballAngle, ballVelocity);
    ballAngle = ballResult.angle;
    ballVelocity = ballResult.velocity;

    // ---- 落下処理 ----
    if(ballVelocity < 0.15 && ballRadiusRatio > 0.55){
      ballRadiusRatio -= 0.01;
    }

    // ---- ディフレクター判定 ----
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

    // ---- ポケット壁衝突 ----
    const total = 37;
    const slice = (Math.PI * 2) / total;
    const distanceFromEdge = modAngle % slice;

    if(
      ballRadiusRatio <= 0.56 &&
      distanceFromEdge < 0.02 &&
      Math.abs(ballVelocity) > 0.01
    ){
      ballVelocity = -ballVelocity * 0.6;
    }

    // ---- 高さ更新 ----
    ballHeight = updateHeight(ballHeight, ballVelocity);

    // ---- ロック判定 ----
    if(
      Math.abs(ballVelocity) < 0.0005 &&
      ballRadiusRatio <= 0.55
    ){

      ballVelocity = 0;

      resultNumber = getWinningNumber(ballAngle, rotation);

      if(resultEl) resultEl.textContent = "Result: " + resultNumber;

      lockedOffset = ballAngle + rotation;
      isLocked = true;

      settleVibration = 0.01; // ← ここ重要
    }

  } else {

    // ==============================
    // ロック後はポケット追従
    // ==============================
    ballAngle = lockedOffset - rotation;

    // 微振動
    if(settleVibration > 0.0001){
      ballAngle += (Math.random() - 0.5) * settleVibration;
      settleVibration *= 0.95;
    }
  }

  // ---- 描画 ----
  drawWheel(ctx, canvas, rotation);
  drawBall(ctx, canvas, ballAngle, ballRadiusRatio, ballHeight);

  requestAnimationFrame(loop);
}

loop();




