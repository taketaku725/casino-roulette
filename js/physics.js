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

export function updateBounce(angle, velocity, bounceCount){

  if(bounceCount <= 0){
    return { angle, velocity, bounceCount };
  }

  // 小さくランダム反射
  angle += (Math.random() - 0.5) * 0.4;

  velocity *= 0.7;
  bounceCount--;

  return { angle, velocity, bounceCount };
}
