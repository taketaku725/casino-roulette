export function drawBall(ctx, canvas, angle, radiusRatio, height){

  const center = canvas.width / 2;
  const outerRadius = center * 0.95;
  const baseRadius = center * 0.03;

  const r = outerRadius * radiusRatio;
  const x = center + Math.cos(angle) * r;
  const y = center + Math.sin(angle) * r;

  const ballRadius = baseRadius * (1 + height*0.3);

  // 影（高さで拡散）
  ctx.beginPath();
  ctx.arc(x, y+height*10, ballRadius*1.2, 0, Math.PI*2);
  ctx.fillStyle = `rgba(0,0,0,${0.3 - height*0.2})`;
  ctx.fill();

  // 球
  const grad = ctx.createRadialGradient(
    x-ballRadius*0.3,
    y-ballRadius*0.3,
    ballRadius*0.1,
    x,
    y,
    ballRadius
  );

  grad.addColorStop(0,"#fff");
  grad.addColorStop(1,"#ccc");

  ctx.beginPath();
  ctx.arc(x, y - height*5, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = grad;
  ctx.fill();
}
