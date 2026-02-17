export function updateRotation(rotation, velocity) {
  rotation += velocity;
  velocity *= 0.995;
  return { rotation, velocity };
}
