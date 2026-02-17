export function updateRotation(rotation, velocity) {
  rotation += velocity;
  velocity *= 0.995;
  return { rotation, velocity };
}

export function updateBall(angle, velocity){
  angle -= velocity;
  velocity *= 0.992;
  return { angle, velocity };
}

export function updateDrop(radiusRatio){
  // 半径をゆっくり縮める
  radiusRatio -= 0.01;

  if(radiusRatio < 0.55){
    radiusRatio = 0.55; // 内側限界
  }

  return radiusRatio;
}
