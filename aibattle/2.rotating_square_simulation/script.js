const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

// 方形設定
const square = {
  cx: W / 2,
  cy: H / 2,
  size: Math.min(W, H) * 0.6,
  angle: 0,
  angularSpeed: 0.5 // 每秒轉速 (rad/s)
};

// 小球設定
const gravity = 500; // px/s^2
const balls = [];
const ballCount = 5;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// 初始化小球
for (let i = 0; i < ballCount; i++) {
  const r = rand(10, 25);
  balls.push({
    x: square.cx + rand(-square.size/2 + r, square.size/2 - r),
    y: square.cy + rand(-square.size/2 + r, square.size/2 - r),
    vx: rand(-200, 200),
    vy: rand(-200, 200),
    r,
    color: `hsl(${rand(0, 360)}, 70%, 60%)`
  });
}

let lastTime = performance.now();

function rotatePoint(x, y, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  };
}

function update(dt) {
  // 更新方形角度
  square.angle += square.angularSpeed * dt;

  // 更新小球位置與速度
  balls.forEach(ball => {
    // 重力
    ball.vy += gravity * dt;
    
    // 移動
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // 相對方形中心位置
    let rx = ball.x - square.cx;
    let ry = ball.y - square.cy;

    // 轉到方形座標系
    const lp = rotatePoint(rx, ry, -square.angle);
    let lv = rotatePoint(ball.vx, ball.vy, -square.angle);

    const half = square.size / 2;
    let collided = false;

    // 左右牆碰撞
    if (lp.x + ball.r > half) {
      lp.x = half - ball.r;
      lv.x *= -1;
      collided = true;
    } else if (lp.x - ball.r < -half) {
      lp.x = -half + ball.r;
      lv.x *= -1;
      collided = true;
    }
    // 上下牆碰撞
    if (lp.y + ball.r > half) {
      lp.y = half - ball.r;
      lv.y *= -1;
      collided = true;
    } else if (lp.y - ball.r < -half) {
      lp.y = -half + ball.r;
      lv.y *= -1;
      collided = true;
    }

    if (collided) {
      // 更新回世界座標
      const wp = rotatePoint(lp.x, lp.y, square.angle);
      const wv = rotatePoint(lv.x, lv.y, square.angle);
      ball.x = square.cx + wp.x;
      ball.y = square.cy + wp.y;
      ball.vx = wv.x;
      ball.vy = wv.y;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // 繪製旋轉方形
  ctx.save();
  ctx.translate(square.cx, square.cy);
  ctx.rotate(square.angle);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.strokeRect(-square.size/2, -square.size/2, square.size, square.size);
  ctx.restore();

  // 繪製小球
  balls.forEach(ball => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
  });
}

function loop(timestamp) {
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);