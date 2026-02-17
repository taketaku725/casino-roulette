export function drawBall(ctx, canvas, angle, radiusRatio){
  const center = canvas.width / 2;
  const outerRadius = center * 0.95; // 外周
  const ballRadius = center * 0.03;

  const r = outerRadius * radiusRatio;

  const x = center + Math.cos(angle) * r;
  const y = center + Math.sin(angle) * r;

  // 影
  ctx.beginPath();
  ctx.arc(x+2, y+2, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fill();

  // 球
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "white";
  ctx.fill();
}
