let a_idx = 0;
let ac = null;
let audioBuffer = null;

// 修改音频加载逻辑
function initAudio() {
  // 只在第一次点击时初始化
  if (!ac) {
    ac = new AudioContext();
    // 加载音频
    fetch("./ciallo.aac")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ac.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        audioBuffer = buffer;
        playSound(); // 加载完成后立即播放
      })
      .catch((e) => console.error("音频加载失败:", e));
  } else if (audioBuffer) {
    // 如果已经加载过，直接播放
    playSound();
  }
}

function playSound() {
  if (audioBuffer && ac) {
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

// 移除之前的点击事件处理代码，重新组织
function handleClick(e) {
  // 如果点击的是链接或其内部元素，仍然触发点击效果但不阻止默认行为
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
  initAudio();

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
}

// 移除之前的所有事件监听器，使用新的方式
document.addEventListener("DOMContentLoaded", function () {
  // 为整个文档添加点击事件
  document.addEventListener("click", handleClick);

  // 为链接添加特殊处理
  const link = document.querySelector("a");
  if (link) {
    link.addEventListener("click", function (e) {
      // 不阻止事件传播，让点击效果也能触发
      handleClick(e);
    });
  }
});
