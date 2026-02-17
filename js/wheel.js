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

  // ===== 外木枠 =====
  const woodGrad = ctx.createRadialGradient(0,0,radius*0.9,0,0,radius*1.05);
  woodGrad.addColorStop(0,"#6b4423");
  woodGrad.addColorStop(1,"#2c160a");

  ctx.beginPath();
  ctx.arc(0,0,radius*1.05,0,Math.PI*2);
  ctx.fillStyle = woodGrad;
  ctx.fill();

  // ===== 金属縁 =====
  ctx.beginPath();
  ctx.arc(0,0,radius*0.98,0,Math.PI*2);
  ctx.lineWidth = radius*0.05;
  ctx.strokeStyle = "#c0c0c0";
  ctx.stroke();

  // ===== 回転部 =====
  ctx.rotate(rotation);

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

    // ===== ポケット立体感（内側影）=====
    ctx.beginPath();
    ctx.arc(0,0,radius*0.55,start,end);
    ctx.lineTo(0,0);
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fill();

    // ===== 仕切り立体線 =====
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#999";
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

  // ===== 内リング =====
  ctx.beginPath();
  ctx.arc(0,0,radius*0.55,0,Math.PI*2);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#444";
  ctx.stroke();

  // ===== 中央コーン =====
  const coneR = radius*0.25;
  const grad = ctx.createRadialGradient(0,0,0,0,0,coneR);
  grad.addColorStop(0,"#eee");
  grad.addColorStop(1,"#777");

  ctx.beginPath();
  ctx.arc(0,0,coneR,0,Math.PI*2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();
}
