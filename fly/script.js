// 建立場景、相機、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 天空背景
scene.background = new THREE.Color(0x87ceeb);

// 平行光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// 建立渲染器
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("canvas") });
renderer.setSize(window.innerWidth, window.innerHeight);

// 雷達 canvas
const radar = document.getElementById('radar');
const radarCtx = radar.getContext('2d');

// 飛機模型
const body = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.3, 3, 12),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
body.rotation.x = Math.PI / 2;

const wing = new THREE.Mesh(
  new THREE.BoxGeometry(3, 0.1, 1),
  new THREE.MeshBasicMaterial({ color: 0x5555ff })
);
wing.position.set(0, 0.3, 0);

const tail = new THREE.Mesh(
  new THREE.BoxGeometry(1, 0.1, 0.5),
  new THREE.MeshBasicMaterial({ color: 0xff5555 })
);
tail.position.set(0, 0.3, -1.2);

const airplane = new THREE.Group();
airplane.add(body);
airplane.add(wing);
airplane.add(tail);
scene.add(airplane);

// 攝影機位置
camera.position.set(0, 5, 10);
camera.lookAt(airplane.position);

// 地面
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshLambertMaterial({ color: 0x228b22 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -5;
scene.add(ground);

const cube = airplane;

// 控制
let speed = 0.02;
const keyState = {};

window.addEventListener("keydown", (e) => {
  keyState[e.code] = true;
});
window.addEventListener("keyup", (e) => {
  keyState[e.code] = false;
});

// 雷達
function drawRadar() {
  radarCtx.clearRect(0, 0, radar.width, radar.height);

  const radarSize = 150;
  const scale = 0.2;
  const centerX = radarSize / 2;
  const centerY = radarSize / 2;

  const x = cube.position.x * scale;
  const z = cube.position.z * scale;

  radarCtx.fillStyle = 'lime';
  radarCtx.beginPath();
  radarCtx.arc(centerX + x, centerY + z, 5, 0, 2 * Math.PI);
  radarCtx.fill();

  radarCtx.strokeStyle = 'white';
  radarCtx.strokeRect(0, 0, radarSize, radarSize);
}

// 動畫循環
function animate() {
  requestAnimationFrame(animate);

  if (keyState["ArrowLeft"]) cube.rotation.y += 0.03;
  if (keyState["ArrowRight"]) cube.rotation.y -= 0.03;
  if (keyState["ArrowUp"]) cube.position.y += 0.1;
  if (keyState["ArrowDown"]) cube.position.y -= 0.1;

  if (keyState["Space"]) {
    speed = Math.min(speed + 0.0005, 0.02);
  } else {
    speed = Math.max(speed - 0.0001, 0.005);
  }

  const direction = new THREE.Vector3();
  cube.getWorldDirection(direction);
  cube.position.addScaledVector(direction, speed);

  wing.rotation.z = Math.sin(Date.now() * 0.005) * 0.1;

  renderer.render(scene, camera);
  drawRadar();
}
animate();
