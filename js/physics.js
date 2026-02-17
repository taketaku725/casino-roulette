export function updateRotation(rotation, velocity) {
  rotation += velocity;
  velocity *= 0.995;
  return { rotation, velocity };
}

export function updateBall(angle, velocity){
  angle -= velocity; // 逆方向
  velocity *= 0.992;
  return { angle, velocity };
}

