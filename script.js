let a_idx = 0;

// 创建一个全局的 AudioContext
const ac = new AudioContext();
let audioBuffer = null;

// 预加载音频
window.addEventListener("load", function () {
  fetch("./ciallo.aac")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => ac.decodeAudioData(arrayBuffer))
    .then((buffer) => {
      audioBuffer = buffer;
    })
    .catch((e) => console.error("音频加载失败:", e));
});

function playSound() {
  if (audioBuffer) {
    const source = ac.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ac.destination);
    source.start(0);
  }
}

function color16() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

// 点击效果
document.body.addEventListener("click", function (e) {
  const texts = ["Ciallo～(∠・ω< )⌒★", "Ciallo～(∠・ω< )⌒☆"];
  const span = document.createElement("span");
  span.textContent = texts[a_idx];
  a_idx = (a_idx + 1) % texts.length;

  span.style.cssText = `
    position: absolute;
    z-index: 721;
    top: ${e.pageY - 20}px;
    left: ${e.pageX}px;
    font-weight: bold;
    color: ${color16()};
    pointer-events: none;
  `;

  document.body.appendChild(span);
  playSound();

  // 动画效果
  let opacity = 1;
  let top = e.pageY - 20;
  const targetTop = e.pageY - 180;

  function animate() {
    opacity -= 0.01;
    top -= 1.5;

    span.style.opacity = opacity;
    span.style.top = `${top}px`;

    if (opacity > 0 && top > targetTop) {
      requestAnimationFrame(animate);
    } else {
      span.remove();
    }
  }

  requestAnimationFrame(animate);
});
