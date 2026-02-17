const numbers = [
0,
32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,
5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26
];

const redNumbers = new Set([
1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
]);

export function drawWheel(ctx, canvas, rotation){

  const radius = canvas.width / 2;
  const center = radius;
  const slice = (Math.PI * 2) / numbers.length;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  // ===== 外周ポケット =====
  for(let i=0;i<numbers.length;i++){

    const start = i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,radius,start,end);
    ctx.closePath();

    if(numbers[i] === 0){
      ctx.fillStyle = "#0b7a2f";
    }else if(redNumbers.has(numbers[i])){
      ctx.fillStyle = "#b30000";
    }else{
      ctx.fillStyle = "#111";
    }

    ctx.fill();

    // 仕切り線（太くする）
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#888";
    ctx.stroke();

    // 数字
    ctx.save();
    ctx.rotate(start + slice/2);
    ctx.fillStyle="white";
    ctx.font = radius*0.08 + "px Arial";
    ctx.textAlign="right";
    ctx.fillText(numbers[i], radius*0.92, 5);
    ctx.restore();
  }

  // ===== 内側ポケットリング =====
  const innerRingRadius = radius * 0.55;

  ctx.beginPath();
  ctx.arc(0,0,innerRingRadius,0,Math.PI*2);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#555";
  ctx.stroke();

  // ===== 中央コーン =====
  const coneRadius = radius * 0.25;

  const gradient = ctx.createRadialGradient(
    0,0,0,
    0,0,coneRadius
  );

  gradient.addColorStop(0,"#ddd");
  gradient.addColorStop(1,"#777");

  ctx.beginPath();
  ctx.arc(0,0,coneRadius,0,Math.PI*2);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();
}
