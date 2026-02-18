export function getWinningNumber(ballAngle, rotation, numbers){

  const total = numbers.length;
  const slice = (Math.PI * 2) / total;

  const adjusted = (ballAngle + rotation + Math.PI/2) % (Math.PI*2);
  const modAngle = adjusted < 0 ? adjusted + Math.PI*2 : adjusted;

  const index = Math.floor(modAngle / slice);

  return numbers[index];
}
