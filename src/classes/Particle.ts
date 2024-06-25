import { ctx } from "../components/canvas";

class Particle {
  lifetime: number;
  color: string;
  radius: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  constructor(
    position: { x: number; y: number },
    velocity: { x: number; y: number },
    radius: number,
    color: string
  ) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.radius = radius;
    this.lifetime = 100; // Time in frames for particle to disappear
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.radius *= 0.95; // Shrink particle over time
    this.lifetime -= 1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  isAlive() {
    return this.lifetime > 0;
  }
}

export default Particle;
