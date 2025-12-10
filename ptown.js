const wrapper = document.getElementById("compare-wrapper");
const leftHandle = document.getElementById("handle-left");
const rightHandle = document.getElementById("handle-right");

const layer0 = document.querySelector(".layer-0");
const layer1 = document.querySelector(".layer-1");
const layer2 = document.querySelector(".layer-2");

let activeHandle = null;

function setPositions(leftX, rightX) {
  const rect = wrapper.getBoundingClientRect();
  const w = rect.width;

  const leftPercent = Math.max(0, Math.min(leftX / w, 1));
  const rightPercent = Math.max(leftPercent + 0.05, Math.min(rightX / w, 1));

  /* update handles */
  leftHandle.style.left = (leftPercent * 100) + "%";
  rightHandle.style.left = (rightPercent * 100) + "%";

  /* update layer masks */
  layer0.style.clipPath = `inset(0 ${(1 - leftPercent) * 100}% 0 0)`;
  layer1.style.clipPath = `inset(0 ${(1 - rightPercent) * 100}% 0 ${leftPercent * 100}%)`;
  layer2.style.clipPath = `inset(0 0 0 ${rightPercent * 100}%)`;
}

function pointerDown(handle) {
  activeHandle = handle;
}

function pointerUp() {
  activeHandle = null;
}

function pointerMove(e) {
  if (!activeHandle) return;
  const rect = wrapper.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;

  const leftPos = parseFloat(leftHandle.style.left) / 100 * rect.width;
  const rightPos = parseFloat(rightHandle.style.left) / 100 * rect.width;

  if (activeHandle === leftHandle) {
    setPositions(x, rightPos);
  } else {
    setPositions(leftPos, x);
  }
}

leftHandle.addEventListener("mousedown", () => pointerDown(leftHandle));
rightHandle.addEventListener("mousedown", () => pointerDown(rightHandle));
window.addEventListener("mouseup", pointerUp);
window.addEventListener("mousemove", pointerMove);

/* Touch support */
leftHandle.addEventListener("touchstart", () => pointerDown(leftHandle));
rightHandle.addEventListener("touchstart", () => pointerDown(rightHandle));
window.addEventListener("touchend", pointerUp);
window.addEventListener("touchmove", pointerMove);
