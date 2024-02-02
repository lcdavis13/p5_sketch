// This class describes the properties of a single particle.
class Particle {
  constructor(p) {
    this.p = p;
    this.x = p.random(0, p.parameters.w.value);
    this.y = p.random(0, p.parameters.h.value);
    this.mass = p.random(p.parameters.particleMinMass.value, p.parameters.particleMaxMass.value);
    this.r = 10 * this.mass ** 0.333;
    this.charge = p.random(-p.parameters.particleChargeRange.value, p.parameters.particleChargeRange.value);
    this.xSpeed = p.random(-p.parameters.particleMaxSpeed.value, p.parameters.particleMaxSpeed.value);
    this.ySpeed = p.random(-p.parameters.particleMaxSpeed.value, p.parameters.particleMaxSpeed.value);
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
        const force = 1 / distance ** 4 - 5 * this.charge * other.charge / distance ** 2;
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
    w: { label: 'Canvas Width', min: 32, max: 1024, step: 2, value: 720 },
    h: { label: 'Canvas Height', min: 32, max: 1024, step: 2, value: 400 },
    particleCount: { label: 'Particle Count', min: 1, max: 100, step: 1, value: 10 },
    particleMaxSpeed: { label: 'Max Particle Speed', min: 0.1, max: 1.0, step: 0.05, value: 0.3 },
    particleMinMass: { label: 'Min Particle Mass', min: 1, max: 10, step: 1, value: 1 },
    particleMaxMass: { label: 'Max Particle Mass', min: 1, max: 10, step: 1, value: 8 },
    particleChargeRange: { label: 'Max Particle Charge', min: 0, max: 1, step: 0.1, value: 1 },
    linkDistance: { label: 'Link Distance', min: 10, max: 100, step: 5, value: 40 },
  }

  let particles = [];
    let isPaused = false;

    p.setup = function() {
        p.createCanvas(p.parameters.w.value, p.parameters.h.value);
        p.initializeParticles();

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

  // Method to reinitialize particles
  function initializeParticles() {
      particles = [];
      for (let i = 0; i < p.parameters.particleCount.value; i++) {
          particles.push(new Particle(p));
      }
  };
  
  p.restart = function() {initializeParticles();}

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
