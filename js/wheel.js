const numbers = [
0,
32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,
5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26
];

const redNumbers = new Set([
1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
]);

export function drawWheel(ctx, canvas, rotation){

  const R = canvas.width / 2;
  const center = R;
  const slice = (Math.PI * 2) / numbers.length;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(center, center);

  // ==============================
  // 外枠（回転しない）
  // ==============================
  const outerR = R * 1.05;
  const outerGrad = ctx.createRadialGradient(0,0,R*0.95,0,0,outerR);
  outerGrad.addColorStop(0,"#5a3b1e");
  outerGrad.addColorStop(1,"#2b160b");

  ctx.beginPath();
  ctx.arc(0,0,outerR,0,Math.PI*2);
  ctx.fillStyle = outerGrad;
  ctx.fill();

  // ==============================
  // 回転開始
  // ==============================
  ctx.rotate(rotation);

  // ------------------------------
  // 木製回転部（無地）
  // ------------------------------
  const woodR = R * 0.95;
  const woodGrad = ctx.createRadialGradient(0,0,R*0.4,0,0,woodR);
  woodGrad.addColorStop(0,"#7a4d26");
  woodGrad.addColorStop(1,"#3a1f0f");

  ctx.beginPath();
  ctx.arc(0,0,woodR,0,Math.PI*2);
  ctx.fillStyle = woodGrad;
  ctx.fill();

  // ------------------------------
  // 数字リング
  // ------------------------------
  const numOuter = R * 0.75;
  const numInner = R * 0.55;

  for(let i=0;i<numbers.length;i++){

    const start = i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.arc(0,0,numOuter,start,end);
    ctx.arc(0,0,numInner,end,start,true);
    ctx.closePath();

    if(numbers[i] === 0){
      ctx.fillStyle = "#0b7a2f";
    } else if(redNumbers.has(numbers[i])){
      ctx.fillStyle = "#b30000";
    } else {
      ctx.fillStyle = "#111";
    }

    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#aaa";
    ctx.stroke();

    // 数字描画（中央配置）
    ctx.save();
    ctx.rotate(start + slice/2);
    ctx.fillStyle = "white";
    ctx.font = (R*0.07) + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(numbers[i], 0, -((numOuter+numInner)/2));
    ctx.restore();
  }

  // ------------------------------
  // ポケットリング
  // ------------------------------
  const pocketOuter = R * 0.55;
  const pocketInner = R * 0.25;

  ctx.beginPath();
  ctx.arc(0,0,pocketOuter,0,Math.PI*2);
  ctx.fillStyle = "#222";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0,0,pocketInner,0,Math.PI*2);
  ctx.fillStyle = "#111";
  ctx.fill();

  // ポケット仕切り
  ctx.strokeStyle = "#777";
  ctx.lineWidth = 3;

  for(let i=0;i<numbers.length;i++){
    const angle = i * slice;
    ctx.beginPath();
    ctx.moveTo(
      Math.cos(angle) * pocketInner,
      Math.sin(angle) * pocketInner
    );
    ctx.lineTo(
      Math.cos(angle) * pocketOuter,
      Math.sin(angle) * pocketOuter
    );
    ctx.stroke();
  }

  // ------------------------------
  // 軸部分
  // ------------------------------
  const spindleR = R * 0.12;
  const grad = ctx.createRadialGradient(0,0,0,0,0,spindleR);
  grad.addColorStop(0,"#eee");
  grad.addColorStop(1,"#777");

  ctx.beginPath();
  ctx.arc(0,0,spindleR,0,Math.PI*2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();
}
