import { STATE } from "./state.js";
import { updateRotation } from "./physics.js";
import { drawWheel } from "./wheel.js";

const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

let rotation = 0;
let velocity = 0;
let currentState = STATE.IDLE;

function resize(){
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  canvas.width = size;
  canvas.height = size;
}
resize();
window.addEventListener("resize", resize);

spinBtn.onclick = () => {
  if(currentState !== STATE.IDLE) return;
  velocity = 0.3 + Math.random()*0.05;
  currentState = STATE.SPINNING;
};

function loop(){
  if(currentState === STATE.SPINNING){
    const result = updateRotation(rotation, velocity);
    rotation = result.rotation;
    velocity = result.velocity;

    if(velocity < 0.002){
      velocity = 0;
      currentState = STATE.IDLE;
    }
  }

  drawWheel(ctx, canvas, rotation);
  requestAnimationFrame(loop);
}

loop();
