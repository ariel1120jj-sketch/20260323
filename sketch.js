let grasses = [];
let bubbles = [];

function setup() {
  let iframe = createElement('iframe');
  iframe.attribute('src', 'https://www.et.tku.edu.tw');
  iframe.style('position', 'fixed');
  iframe.style('top', '0');
  iframe.style('left', '0');
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.style('border', 'none');
  iframe.style('z-index', '1');

  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('position', 'fixed');
  cnv.style('top', '0');
  cnv.style('left', '0');
  cnv.style('z-index', '2');
  cnv.style('pointer-events', 'none');

  let colors = ['#d8f3dc', '#b7e4c7', '#95d5b2', '#74c69d', '#52b788', '#40916c', '#2d6a4f', '#1b4332'];
  for (let i = 0; i < 50; i++) {
    grasses.push({
      x: random(width),
      stopY: random(height * 0.34, height * 0.8),
      color: random(colors),
      w: random(30, 60),
      speed: random(0.002, 0.02),
      noiseOffset: random(1000)
    });
  }
}

function draw() {
  clear(); // 清除上一幀的畫布，確保背景完全透明，不遮擋下方 iframe
  background(168, 218, 220, 13); // 背景透明度改為 0.05 (13/255)
  blendMode(BLEND); // 設定混合模式，這是預設值，但能確保透明度混合運作正常

  noFill();
  
  for (let i = 0; i < grasses.length; i++) {
    let g = grasses[i];
    let c = color(g.color);
    c.setAlpha(150); // 設定透明度 (0-255)，產生重疊的透明效果
    stroke(c);
    strokeWeight(g.w);
    
    beginShape();
    curveVertex(g.x, height);
    for (let y = height; y > g.stopY; y -= 10) {
      let progress = map(y, height, g.stopY, 0, 1);
      let xOffset = map(noise(frameCount * g.speed + g.noiseOffset, y * 0.005), 0, 1, -50, 50) * progress;
      curveVertex(g.x + xOffset, y);
    }
    endShape();
  }

  // 產生氣泡
  if (random(1) < 0.05) { // 隨機產生機率
    bubbles.push(new Bubble());
  }

  // 更新與顯示氣泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.update();
    b.display();
    if (b.isFinished()) {
      bubbles.splice(i, 1);
    }
  }
}

class Bubble {
  constructor() {
    this.x = random(width);
    this.y = height + 20; // 從視窗底部下方開始
    this.size = random(10, 20);
    this.speed = random(2, 4);
    this.popY = random(height * 0.2, height * 0.8); // 隨機破掉的高度
    this.popped = false;
    this.popTimer = 0;
  }

  update() {
    if (!this.popped) {
      this.y -= this.speed;
      this.x += sin(this.y * 0.05) * 0.5; // 輕微左右搖晃
      if (this.y < this.popY) {
        this.popped = true;
      }
    } else {
      this.popTimer++;
    }
  }

  display() {
    if (this.popped) {
      // 破掉的效果：產生一個擴大的圓圈並漸漸消失
      noFill();
      stroke(255, map(this.popTimer, 0, 10, 255, 0));
      strokeWeight(2);
      ellipse(this.x, this.y, this.size + this.popTimer * 2);
    } else {
      // 水泡本體
      noStroke();
      fill(255, 127); // 白色，透明度 0.5 (127/255)
      ellipse(this.x, this.y, this.size);
      
      // 水泡上方的白色圓圈 (亮點)
      fill(255, 178); // 白色，透明度 0.7 (178/255)
      ellipse(this.x + this.size * 0.25, this.y - this.size * 0.25, this.size * 0.3);
    }
  }

  isFinished() {
    return this.popped && this.popTimer > 10;
  }
}
