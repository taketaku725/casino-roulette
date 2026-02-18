export function drawWheel(ctx, canvas, rotation, numbers){

  const R = canvas.width / 2;
  const center = R;
  const slice = (Math.PI * 2) / numbers.length;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(center, center);

  // 外枠（固定）
  const outerR = R * 1.05;
  ctx.beginPath();
  ctx.arc(0,0,outerR,0,Math.PI*2);
  ctx.fillStyle = "#4a2f18";
  ctx.fill();

  // 回転開始
  ctx.rotate(rotation);

  // 木部
  ctx.beginPath();
  ctx.arc(0,0,R*0.95,0,Math.PI*2);
  ctx.fillStyle = "#5a3b1e";
  ctx.fill();

  // 数字リング
  const numOuter = R * 0.75;
  const numInner = R * 0.55;

  for(let i=0;i<numbers.length;i++){

    const start = i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.arc(0,0,numOuter,start,end);
    ctx.arc(0,0,numInner,end,start,true);
    ctx.closePath();

    const n = numbers[i];

    if(n === 0 || n === "00"){
      ctx.fillStyle = "#0b7a2f";
    } else if(
      [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n)
    ){
      ctx.fillStyle = "#b30000";
    } else {
      ctx.fillStyle = "#111";
    }

    ctx.fill();
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.rotate(start + slice/2);
    ctx.fillStyle = "white";
    ctx.font = (R*0.07) + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(n, 0, -((numOuter+numInner)/2));
    ctx.restore();
  }

  // ポケットリング
  ctx.beginPath();
  ctx.arc(0,0,R*0.55,0,Math.PI*2);
  ctx.fillStyle = "#222";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0,0,R*0.25,0,Math.PI*2);
  ctx.fillStyle = "#111";
  ctx.fill();

  const pocketOuter = R * 0.55;
  const pocketInner = R * 0.25;

  ctx.strokeStyle = "#888";
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

  // 軸
  ctx.beginPath();
  ctx.arc(0,0,R*0.12,0,Math.PI*2);
  ctx.fillStyle = "#ccc";
  ctx.fill();

  ctx.restore();
}

