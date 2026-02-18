import { updateRotation, updateBall, applyDeflectorBounce, updateHeight } from "./physics.js";
import { drawWheel } from "./wheel.js";
import { drawBall } from "./ball.js";
import { getWinningNumber } from "./result.js";

const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultEl = document.getElementById("result");

// ==============================
// 定数（構造に合わせる）
// ==============================
const POCKET_OUTER_RATIO = 0.55;     // ポケット外縁
const POCKET_CENTER_RATIO = 0.40;    // ポケット中央（最終位置）
const POCKET_EDGE_BAND_MIN = 0.52;   // 外縁跳ね帯
const POCKET_EDGE_BAND_MAX = 0.56;

const DEFLECTORS = 12;

// ==============================
// 状態
// ==============================
let rotation = 0;
let velocity = 0;

let ballAngle = 0;
let ballVelocity = 0;
let ballRadiusRatio = 1;   // 1 = 外周
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

  if(isSpinning) return; // 連打防止

  isSpinning = true;
  isLocked = false;

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
// メインループ
// ==============================
function loop() {

  // まずホイール描画（SPIN前はこれだけ）
  drawWheel(ctx, canvas, rotation);

  if(!isSpinning){
    requestAnimationFrame(loop);
    return;
  }

  // ---- ホイール更新 ----
  const wheelResult = updateRotation(rotation, velocity);
  rotation = wheelResult.rotation;
  velocity = wheelResult.velocity;

  if (!isLocked) {

    // ---- ボール更新 ----
    const ballResult = updateBall(ballAngle, ballVelocity);
    ballAngle = ballResult.angle;
    ballVelocity = ballResult.velocity;

    // =====================================
    // 落下（ポケット中央まで）
    // =====================================
    if (ballRadiusRatio > POCKET_CENTER_RATIO) {
      if (Math.abs(ballVelocity) < 0.3) {
        ballRadiusRatio -= 0.004;
      }
    }

    // ---- ディフレクター ----
    const deflectorSlice = (Math.PI * 2) / DEFLECTORS;

    const adjusted = (ballAngle + rotation) % (Math.PI * 2);
    const modAngle = adjusted < 0 ? adjusted + Math.PI * 2 : adjusted;
    const distanceFromDeflector = modAngle % deflectorSlice;

    if (
      ballRadiusRatio < 0.8 &&
      ballRadiusRatio > 0.6 &&
      distanceFromDeflector < 0.02 &&
      Math.abs(ballVelocity) > 0.02
    ){
      ballVelocity = applyDeflectorBounce(ballVelocity);
    }

    // ---- ポケット外縁跳ね ----
    const total = 37;
    const slice = (Math.PI * 2) / total;
    const distanceFromEdge = modAngle % slice;

    if (
      ballRadiusRatio <= POCKET_EDGE_BAND_MAX &&
      ballRadiusRatio >= POCKET_EDGE_BAND_MIN &&
      distanceFromEdge < 0.02 &&
      Math.abs(ballVelocity) > 0.01
    ){
      ballVelocity = -ballVelocity * 0.6;
    }

    // ---- 高さ更新 ----
    ballHeight = updateHeight(ballHeight, ballVelocity);

    // ---- ロック判定（中央到達）----
    if (
      Math.abs(ballVelocity) < 0.0005 &&
      ballRadiusRatio <= POCKET_CENTER_RATIO
    ){
      ballVelocity = 0;
      ballRadiusRatio = POCKET_CENTER_RATIO;

      resultNumber = getWinningNumber(ballAngle, rotation);
      if(resultEl) resultEl.textContent = "Result: " + resultNumber;

      lockedOffset = ballAngle + rotation;
      isLocked = true;
      settleVibration = 0.01;
    }

  } else {

    // =====================================
    // ロック後：ポケット追従
    // =====================================
    ballAngle = lockedOffset - rotation;

    if (settleVibration > 0.0001) {
      ballAngle += (Math.random() - 0.5) * settleVibration;
      settleVibration *= 0.95;
    }

    // ホイール停止でSPIN終了
    if(Math.abs(velocity) < 0.0005){
      isSpinning = false;
    }
  }

  drawBall(ctx, canvas, ballAngle, ballRadiusRatio, ballHeight);

  requestAnimationFrame(loop);
}

loop();
