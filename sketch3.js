var sketch3 = function(p) {
  var grid, next;
  var diagonal_rate = 0.709; // Weighting for diagonal neighbors (1/sqrt(2))

  // Simulation parameters
  p.parameters = {
    w: {label: 'Width', min: 32, max: 1024, step: 2, value: 200},
    h: {label: 'Height', min: 32, max: 1024, step: 2, value: 200},
    dA: { label: 'Diffusion Rate A', min: 0.8, max: 1.2, step: 0.01, value: 1 },
    dB: { label: 'Diffusion Rate B', min: 0.4, max: 0.6, step: 0.01, value: 0.5 },
    feed: { label: 'Feed Rate', min: 0.03, max: 0.08, step: 0.001, value: 0.055 },
    k: { label: 'Kill Rate', min: 0.05, max: 0.07, step: 0.001, value: 0.062 },
    dt: { label: 'Time Delta', min: 0.8, max: 1.2, step: 0.01, value: 1.0 }
  };

  // Helper function to destructure parameters
  function params() {
    return Object.keys(p.parameters).reduce((values, key) => {
      values[key] = p.parameters[key].value;
      return values;
    }, {});
  }

  p.setup = function() {
    const { w, h } = params();
    p.createCanvas(w, h);
    p.pixelDensity(1);
    initializeGrid();
  };

  function initializeGrid() {
    const { w, h } = params();
    grid = [];
    next = [];
    for (var x = 0; x < w; x++) {
      grid[x] = [];
      next[x] = [];
      for (var y = 0; y < h; y++) {
        grid[x][y] = { a: 1, b: 0 };
        next[x][y] = { a: 1, b: 0 };
      }
    }

    for (var i = 150; i < 160; i++) {
      for (var j = 150; j < 160; j++) {
        grid[i][j].b = 1.0; 
      }
    }
    for (var i = 140; i < 150; i++) {
      for (var j = 140; j < 150; j++) {
        grid[i][j].b = 1.0; 
      }
    }
  }

  p.draw = function() {
    p.background(51);
    updateGrid();
    drawGrid();
    swap();
  };

  function updateGrid() {
    const { w, h } = params();
    for (var x = 0; x < w; x++) {
      for (var y = 0; y < h; y++) {
        var laplaceAVal = laplace(x, y, 'a');
        var laplaceBVal = laplace(x, y, 'b');
        var a = grid[x][y].a;
        var b = grid[x][y].b;

        next[x][y].a = updateConcentrationA(a, b, laplaceAVal);
        next[x][y].b = updateConcentrationB(b, a, laplaceBVal);
      }
    }
  }

  function updateConcentrationA(a, b, laplaceAVal) {
    const { dA, feed, dt } = params();
    var reactionTermA = -a * b * b + feed * (1 - a);
    var diffusionTermA = dA * laplaceAVal;
    var updatedA = a + dt * (diffusionTermA + reactionTermA);
    return p.constrain(updatedA, 0, 1);
  }

  function updateConcentrationB(b, a, laplaceBVal) {
    const { dB, k, feed, dt } = params();
    var reactionTermB = a * b * b - (k + feed) * b;
    var diffusionTermB = dB * laplaceBVal;
    var updatedB = b + dt * (diffusionTermB + reactionTermB);
    return p.constrain(updatedB, 0, 1);
  }

  function laplace(x, y, type) {
    const { w, h } = params();
    var sum = 0;
    var rate = 1.0 / (4.0 * diagonal_rate + 4.0); // Adjust to sum to 1 for all incoming cells

    sum += grid[x][y][type] * -1;
    sum += getNeighborConcentration(x - 1, y, type) * rate;
    sum += getNeighborConcentration(x + 1, y, type) * rate;
    sum += getNeighborConcentration(x, y - 1, type) * rate;
    sum += getNeighborConcentration(x, y + 1, type) * rate;
    sum += getNeighborConcentration(x - 1, y - 1, type) * rate * diagonal_rate;
    sum += getNeighborConcentration(x + 1, y - 1, type) * rate * diagonal_rate;
    sum += getNeighborConcentration(x + 1, y + 1, type) * rate * diagonal_rate;
    sum += getNeighborConcentration(x - 1, y + 1, type) * rate * diagonal_rate;

    return sum;
}

function getNeighborConcentration(x, y, type) {
    const { w, h } = params();
    var nx = (x + w) % w;
    var ny = (y + h) % h;
    return grid[nx][ny][type];
}

function drawGrid() {
    const { w, h } = params();
    p.loadPixels();
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            var pix = (x + y * w) * 4;
            var a = next[x][y].a;
            var b = next[x][y].b;
            var colorVal = p.floor((a - b) * 255);
            colorVal = p.constrain(colorVal, 0, 255);
            setPixelColor(pix, colorVal);
        }
    }
    p.updatePixels();
}

function setPixelColor(pixelIndex, colorVal) {
    p.pixels[pixelIndex + 0] = colorVal; // Red
    p.pixels[pixelIndex + 1] = colorVal; // Green
    p.pixels[pixelIndex + 2] = colorVal; // Blue
    p.pixels[pixelIndex + 3] = 255; // Alpha
}

function swap() {
    var temp = grid;
    grid = next;
    next = temp;
}

// Method to restart the simulation
p.restart = function() {
    initializeGrid();
};
};

new p5(sketch3, 'container2');
