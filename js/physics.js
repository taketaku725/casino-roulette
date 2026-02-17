export function updateRotation(rotation, velocity) {
  rotation += velocity;

  // 粘る減速
  if (velocity > 0.002) {
    velocity *= 0.995;
  } else {
    velocity *= 0.98;
  }

  if (velocity < 0.0003) velocity = 0;

  return { rotation, velocity };
}

export function updateBall(angle, velocity){
  angle -= velocity;

  if (velocity > 0.02) {
    velocity *= 0.992;
  } else {
    velocity *= 0.96;
  }

  if (Math.abs(velocity) < 0.0005) velocity = 0;

  return { angle, velocity };
}

export function applyWallBounce(ballVelocity){
  // 壁反射（反転＋減衰）
  return -ballVelocity * 0.6;
}
