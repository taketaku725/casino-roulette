const numbers = [
0,
32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,
5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26
];

const redNumbers = new Set([
1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
]);

export function drawWheel(ctx, canvas, rotation){
  const radius = canvas.width/2;
  const center = radius;
  const slice = (Math.PI*2) / numbers.length;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  for(let i=0;i<numbers.length;i++){
    const start = i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,radius,start,end);
    ctx.closePath();

    if(numbers[i] === 0){
      ctx.fillStyle = "green";
    }else if(redNumbers.has(numbers[i])){
      ctx.fillStyle = "red";
    }else{
      ctx.fillStyle = "black";
    }

    ctx.fill();
    ctx.strokeStyle="#111";
    ctx.stroke();

    ctx.save();
    ctx.rotate(start + slice/2);
    ctx.fillStyle="white";
    ctx.font = radius*0.08 + "px Arial";
    ctx.textAlign="right";
    ctx.fillText(numbers[i], radius*0.95, 5);
    ctx.restore();
  }

  ctx.restore();
}
