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
  };

  // Helper function to destructure parameters
  function params() {
    return Object.keys(p.parameters).reduce((values, key) => {
      values[key] = p.parameters[key].value;
      return values;
    }, {});
  }

  class Particle {
    constructor() {
      const { w, h, particleMinMass, particleMaxMass, particleChargeRange, particleMaxSpeed } = params();
      this.x = p.random(0, w);
      this.y = p.random(0, h);
      this.mass = p.random(particleMinMass, particleMaxMass);
      this.r = 10 * this.mass ** 0.333;
      this.charge = p.random(-particleChargeRange, particleChargeRange);
      this.xSpeed = p.random(-particleMaxSpeed, particleMaxSpeed);
      this.ySpeed = p.random(-particleMaxSpeed, particleMaxSpeed);
    }

    drawParticle() {
      p.noStroke();
      p.fill(`rgba(${p.int(255 * (1 + this.charge / 2))}, ${p.int(255 * (1 - this.charge / 2))}, 0, 0.5)`);
      p.circle(this.x, this.y, this.r);
    }

    ApplyForce(particles) {
      particles.forEach(other => {
        const distance = p.dist(this.x, this.y, other.x, other.y);
        if (distance > 0.0) {
          const force = 1 / distance ** 4 - 5 * this.charge * other.charge / distance ** 2;
          this.xSpeed += force * (other.x - this.x) / distance / this.mass;
          this.ySpeed += force * (other.y - this.y) / distance / this.mass;
        }
      });
    }

    moveParticle() {
      if (this.x < 0 || this.x > p.width) {
        this.xSpeed *= -1;
      }
      if (this.y < 0 || this.y > p.height) {
        this.ySpeed *= -1;
      }
      this.x += this.xSpeed;
      this.y += this.ySpeed;
    }

    drawLinks(particles) {
      const { linkDistance } = params();
      particles.forEach(element => {
        let dis = p.dist(this.x, this.y, element.x, element.y);
        if (dis < linkDistance) {
          p.stroke('rgba(255,255,255,0.4)');
          p.line(this.x, this.y, element.x, element.y);
        }
      });
    }
  }

  let particles = [];
  let isPaused = false;

  p.setup = function() {
    const { w, h } = params();
    p.createCanvas(w, h);
    initializeParticles();

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

  function initializeParticles() {
    const { particleCount } = params();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
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
