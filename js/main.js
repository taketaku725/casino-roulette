import { updateRotation, updateBall, applyDeflectorBounce, updateHeight } from "./physics.js";
import { drawWheel } from "./wheel.js";
import { drawBall } from "./ball.js";
import { getWinningNumber } from "./result.js";
import { layouts } from "./layout.js";

const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultEl = document.getElementById("result");
const typeButtons = document.querySelectorAll(".typeBtn");

// ==============================
// 定数（構造一致版）
// ==============================
const POCKET_OUTER_RATIO = 0.55;
const POCKET_CENTER_RATIO = 0.40;
const POCKET_EDGE_BAND_MIN = 0.52;
const POCKET_EDGE_BAND_MAX = 0.56;
const DEFLECTORS = 12;

// ==============================
// ルーレットタイプ
// ==============================
let rouletteType = "EU";
let numbers = layouts[rouletteType];

// ==============================
// 状態
// ==============================
let rotation = 0;
let velocity = 0;

let ballAngle = 0;
let ballVelocity = 0;
let ballRadiusRatio = 1;
let ballHeight = 0;

let resultNumber = null;
let settleVibration = 0;

let isSpinning = false;
let isLocked = false;
let lockedOffset = 0;

// ==============================
// リサイズ
// ==============================
function resize(){
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  canvas.width = size;
  canvas.height = size;
}
resize();
window.addEventListener("resize", resize);

// ==============================
// SPIN開始
// ==============================
spinBtn.onclick = () => {

  if(isSpinning) return;

  isSpinning = true;
  isLocked = false;

  setButtonsDisabled(true);

  velocity = 0.3 + Math.random()*0.05;
  ballVelocity = 0.6 + Math.random()*0.1;

  ballAngle = 0;
  ballRadiusRatio = 1;
  ballHeight = 0;

  resultNumber = null;
  settleVibration = 0;

  if(resultEl) resultEl.textContent = "";
};

// ==============================
// タイプ切替
// ==============================
function switchRoulette(type){
  if(isSpinning) return;
  rouletteType = type;
  numbers = layouts[type];
  if(resultEl) resultEl.textContent = "";
}
window.switchRoulette = switchRoulette;

// ==============================
// メインループ
// ==============================
function loop(){

  drawWheel(ctx, canvas, rotation, numbers);

  if(!isSpinning){
    requestAnimationFrame(loop);
    return;
  }

  // ---- ホイール ----
  const wheelResult = updateRotation(rotation, velocity);
  rotation = wheelResult.rotation;
  velocity = wheelResult.velocity;

  if(!isLocked){

    const ballResult = updateBall(ballAngle, ballVelocity);
    ballAngle = ballResult.angle;
    ballVelocity = ballResult.velocity;

    // 落下（中央まで）
    if(ballRadiusRatio > POCKET_CENTER_RATIO){
      if(Math.abs(ballVelocity) < 0.3){
        ballRadiusRatio -= 0.0025;
      }
    }

    // ディフレクター
    const deflectorSlice = (Math.PI * 2) / DEFLECTORS;
    const adjusted = (ballAngle + rotation) % (Math.PI*2);
    const modAngle = adjusted < 0 ? adjusted + Math.PI*2 : adjusted;
    const distanceFromDeflector = modAngle % deflectorSlice;

    if(
      ballRadiusRatio < 0.8 &&
      ballRadiusRatio > 0.6 &&
      distanceFromDeflector < 0.02 &&
      Math.abs(ballVelocity) > 0.02
    ){
      ballVelocity = applyDeflectorBounce(ballVelocity);
    }

    // ポケット縁
    const total = numbers.length;
    const slice = (Math.PI * 2) / total;
    const distanceFromEdge = modAngle % slice;

    if(
      ballRadiusRatio <= POCKET_EDGE_BAND_MAX &&
      ballRadiusRatio >= POCKET_EDGE_BAND_MIN &&
      distanceFromEdge < 0.02 &&
      Math.abs(ballVelocity) > 0.01
    ){
      ballVelocity = -ballVelocity * 0.6;
    }

    // 高さ
    ballHeight = updateHeight(ballHeight, ballVelocity);

    // ロック
    if(
      Math.abs(ballVelocity) < 0.0005 &&
      ballRadiusRatio <= POCKET_CENTER_RATIO
    ){
      ballVelocity = 0;
      ballRadiusRatio = POCKET_CENTER_RATIO;

      resultNumber = getWinningNumber(ballAngle, rotation, numbers);
      if(resultEl) resultEl.textContent = "Result: " + resultNumber;

      lockedOffset = ballAngle + rotation;
      isLocked = true;
      settleVibration = 0.01;
    }

  } else {

    // ポケット追従
    ballAngle = lockedOffset - rotation;

    if(settleVibration > 0.0001){
      ballAngle += (Math.random() - 0.5) * settleVibration;
      settleVibration *= 0.95;
    }

    if(Math.abs(velocity) < 0.0005){
      isSpinning = false;
      setButtonsDisabled(false); 
    }
  }

  drawBall(ctx, canvas, ballAngle, ballRadiusRatio, ballHeight);
  requestAnimationFrame(loop);
}

loop();


function setButtonsDisabled(state){
  spinBtn.disabled = state;
  typeButtons.forEach(btn => btn.disabled = state);
}


