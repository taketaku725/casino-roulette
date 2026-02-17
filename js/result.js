export const numbers = [
0,
32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,
5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26
];

export function getWinningNumber(ballAngle, wheelRotation){
  const total = numbers.length;
  const slice = (Math.PI * 2) / total;

  // ホイール回転を考慮
  const adjusted = (ballAngle + wheelRotation) % (Math.PI*2);

  let index = Math.floor((adjusted < 0 ? adjusted + Math.PI*2 : adjusted) / slice);

  return numbers[index];
}
