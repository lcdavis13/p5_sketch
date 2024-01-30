// This class describes the properties of a single particle.
class Particle {
  constructor(p) {
    this.p = p;
    this.x = p.random(0, p.width);
    this.y = p.random(0, p.height);
    this.mass = p.random(1, 8);
    this.r = 10 * this.mass ** 0.333;
    this.charge = p.random(-1, 1);
    this.xSpeed = p.random(-0.3, 0.3);
    this.ySpeed = p.random(-0.3, 0.3);
  }

  // Creation of a particle.
  drawParticle() {
    this.p.noStroke();
    this.p.fill(`rgba(${this.p.int(255 * (1 + this.charge / 2))}, ${this.p.int(255 * (1 - this.charge / 2))}, 0, 0.5)`);
    this.p.circle(this.x, this.y, this.r);
  }

  ApplyForce(particles) {
    particles.forEach(other => {
      const distance = this.p.dist(this.x, this.y, other.x, other.y);
      if (distance > 0.0) {
        const force = 1 / distance ** 4 + 5 * this.charge * other.charge / distance ** 2;
        this.xSpeed += force * (other.x - this.x) / distance / this.mass;
        this.ySpeed += force * (other.y - this.y) / distance / this.mass;
      }
    });
  }

  // Setting the particle in motion.
  moveParticle() {
    if (this.x < 0 || this.x > this.p.width) {
      this.xSpeed *= -1;
    }
    if (this.y < 0 || this.y > this.p.height) {
      this.ySpeed *= -1;
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  // Creates the connections (lines) between particles within a certain distance.
  drawLinks(particles) {
    particles.forEach(element => {
      let dis = this.p.dist(this.x, this.y, element.x, element.y);
      if (dis < 40) {
        this.p.stroke('rgba(255,255,255,0.4)');
        this.p.line(this.x, this.y, element.x, element.y);
      }
    });
  }
}

// Instance mode sketch.
var sketch2 = function(p) {
  p.parameters = {
    w: { label: 'Canvas Width', min: 100, max: 1024, step: 10, value: 720 },
    h: { label: 'Canvas Height', min: 100, max: 1024, step: 10, value: 400 },
  }

  let particles = [];
  let isPaused = false; // Variable to track pause state

  p.setup = function() {
    p.createCanvas(720, 400);
    for (let i = 0; i < p.width / 200; i++) {
      particles.push(new Particle(p));
    }

    // Button event listener
    document.getElementById('pause-resume').addEventListener('click', function() {
      if (isPaused) {
        p.loop();
        this.innerHTML = 'Pause'; // Change button text to 'Pause'
      } else {
        p.noLoop();
        this.innerHTML = 'Resume'; // Change button text to 'Resume'
      }
      isPaused = !isPaused; // Toggle the pause state
    });
  };

  p.draw = function() {
    p.background('#0f0f0f');
    for (let i = 0; i < particles.length; i++) {
      particles[i].ApplyForce(particles.slice(i));
      particles[i].moveParticle();
      particles[i].drawParticle();
      particles[i].drawLinks(particles.slice(i));
    }
  };
};
