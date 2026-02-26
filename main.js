const canvas = document.getElementById("rouletteCanvas");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const modeSelect = document.getElementById("modeSelect");
const resultDiv = document.getElementById("result");

let width, height, radius;

let wheelRotation = 0;
let wheelSpeed = 0;

let ballAngle = 0;
let ballSpeed = 0;

let ballRadius = 0;
let radialSpeed = 0;

let pocketOuterR, pocketInnerR;
let ballVisualRadius;
let outerWallR;

let spinning = false;
let state = "idle";
// idle → outer → fall → bounce → settle → stop

let bounceCount = 0;
let bounceMax = 0;

let numbers = [];
let currentIndex = 0;
let lockedAngle = 0;

// ===== 履歴 =====
let resultHistory = [];

// ======================
// 数字色
// ======================
function getNumberColor(num) {
  if (num === 0 || num === "00") return "green";

  const index = numbers.indexOf(num);
  return (index % 2 === 0) ? "red" : "black";
}

// ======================
// サイズ
// ======================
function resize() {
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  canvas.width = size;
  canvas.height = size;
  width = size;
  height = size;
  radius = size / 2;

  pocketOuterR = radius * 0.6;
  pocketInnerR = radius * 0.4;
  ballVisualRadius = radius * 0.035;

  outerWallR = radius * 0.85 - ballVisualRadius;
}
window.addEventListener("resize", resize);
resize();

// ======================
// 数字配列
// ======================
function getEuropean() {
  return [
    0,32,15,19,4,21,2,25,17,34,6,
    27,13,36,11,30,8,23,10,5,24,
    16,33,1,20,14,31,9,22,18,29,
    7,28,12,35,3,26
  ];
}

function getAmerican() {
  return [
    0,28,9,26,30,11,7,20,32,17,
    5,22,34,15,3,24,36,13,1,"00",
    27,10,25,29,12,8,19,31,18,
    6,21,33,16,4,23,35,14,2
  ];
}

function setMode() {
  numbers = modeSelect.value === "european"
    ? getEuropean()
    : getAmerican();
}
setMode();

modeSelect.addEventListener("change", () => {
  if (!spinning) setMode();
});

// ======================
// SPIN
// ======================
spinBtn.addEventListener("click", () => {
  if (spinning) return;

  spinning = true;
  state = "outer";
  resultDiv.textContent = "";

  wheelSpeed = 0.03 + Math.random() * 0.01;
  ballSpeed = -0.55 - Math.random() * 0.1;

  ballRadius = outerWallR;
  radialSpeed = 0;

  bounceMax = Math.floor(Math.random() * 5) + 1;
  bounceCount = 0;
});

// ======================
// 描画
// ======================
function drawWheel() {
  const slice = (Math.PI * 2) / numbers.length;

  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(wheelRotation);

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = "#111";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
  ctx.fillStyle = "#0b3d2e";
  ctx.fill();

  for (let i = 0; i < numbers.length; i++) {
    const angle = i * slice;

    ctx.beginPath();
    ctx.moveTo(
      Math.cos(angle) * pocketInnerR,
      Math.sin(angle) * pocketInnerR
    );
    ctx.arc(0, 0, pocketOuterR, angle, angle + slice);
    ctx.lineTo(
      Math.cos(angle + slice) * pocketInnerR,
      Math.sin(angle + slice) * pocketInnerR
    );
    ctx.arc(0, 0, pocketInnerR, angle + slice, angle, true);
    ctx.closePath();

    const num = numbers[i];
    if (num === 0 || num === "00") {
      ctx.fillStyle = "green";
    } else {
      ctx.fillStyle = (i % 2 === 0) ? "red" : "black";
    }

    ctx.fill();
    ctx.strokeStyle = "#c9a44b";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.rotate(angle + slice / 2);
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = `${radius * 0.06}px sans-serif`;
    const textOffset = radius * 0.02; // 余白（好みで調整）
    ctx.fillText(num, pocketOuterR - textOffset, 0);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = "#555";
  ctx.fill();

  ctx.restore();
}

function drawBall() {
  const x = radius + Math.cos(ballAngle) * ballRadius;
  const y = radius + Math.sin(ballAngle) * ballRadius;

  ctx.beginPath();
  ctx.arc(x, y, ballVisualRadius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
}

// ======================
// メインループ
// ======================
function loop() {

  if (spinning) {

    wheelRotation += wheelSpeed;
    ballAngle += ballSpeed;

    wheelSpeed *= 0.9999;
    ballSpeed *= 0.995;

    if (state === "outer") {

      if (Math.abs(ballSpeed) < 0.5) {
        state = "fall";
      }
    }

    else if (state === "fall") {

      radialSpeed -= 0.001;
      ballRadius += radialSpeed;

      if (ballRadius <= pocketOuterR - ballVisualRadius) {
        ballRadius = pocketOuterR - ballVisualRadius;
        radialSpeed = 3.5;
        state = "bounce";
      }
    }

    else if (state === "bounce") {

      radialSpeed -= 0.05;
      ballRadius += radialSpeed;

      if (ballRadius <= pocketOuterR - ballVisualRadius) {

        ballRadius = pocketOuterR - ballVisualRadius;
        radialSpeed *= -0.7;
        ballSpeed *= 0.05;

        bounceCount++;

        if (bounceCount >= bounceMax) {

          const slice = (Math.PI * 2) / numbers.length;

          const relative =
            (ballAngle - wheelRotation) % (Math.PI * 2);

          const adjusted =
            relative < 0 ? relative + Math.PI * 2 : relative;

          currentIndex = Math.floor(adjusted / slice);

          lockedAngle = currentIndex * slice + slice / 2;

          state = "settle";
        }
      }
    }

    else if (state === "settle") {

      const target =
        (pocketOuterR + pocketInnerR) / 2 - ballVisualRadius;

      radialSpeed += (target - ballRadius) * 0.02;
      radialSpeed *= 0.9;
      ballRadius += radialSpeed;

      // 🔥 追従した瞬間に角度補正
      ballSpeed = wheelSpeed;
      ballAngle = wheelRotation + lockedAngle;

      if (Math.abs(ballRadius - target) < 0.3) {
        ballRadius = target;
        state = "stop";
      }
    }

    else if (state === "stop") {

      wheelSpeed *= 0.95;
      ballAngle = wheelRotation + lockedAngle;

      if (Math.abs(wheelSpeed) < 0.003) {
        spinning = false;
        const result = numbers[currentIndex];
        const color = getNumberColor(result);

        resultDiv.innerHTML =
          `結果：<span class="result-number" style="color:${color}">${result}</span>`;

        // ===== 履歴追加 =====
        addHistory(result, color);

        state = "idle";
      }
    }

    if (ballRadius > outerWallR) {
      ballRadius = outerWallR;
      if (radialSpeed > 0) radialSpeed = 0;
    }
  }

  drawWheel();
  drawBall();

  requestAnimationFrame(loop);
}

function addHistory(num, color) {
  resultHistory.unshift({ num, color });

  const historyContainer =
    document.getElementById("history");

  historyContainer.innerHTML = resultHistory
    .slice(0, 20) // 最新20件
    .map(item =>
      `<span class="history-item" style="color:${item.color}">
         ${item.num}
       </span>`
    )
    .join("");
}

loop();
