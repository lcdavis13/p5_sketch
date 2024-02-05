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

  p.setup = function() {
      p.createCanvas(200, 200);
      p.pixelDensity(1);
      initializeGrid();
  };

  function initializeGrid() {
    grid = [];
    next = [];
    for (var x = 0; x < p.parameters.w.value; x++) {
        grid[x] = [];
        next[x] = [];
        for (var y = 0; y < p.parameters.h.value; y++) {
            grid[x][y] = { a: 1, b: 0 };
            next[x][y] = { a: 1, b: 0 };
        }
    }

    for (var i = 150; i < 160; i++) {
        for (var j = 150; j < 160; j++) {
            grid[i][j].b = 0.5 + 0.5 * p.random();
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
      for (var x = 0; x < p.parameters.w.value; x++) {
          for (var y = 0; y < p.parameters.h.value; y++) {
              var laplaceAVal = laplace(x, y, 'a');
              var laplaceBVal = laplace(x, y, 'b');
              var a = grid[x][y].a;
              var b = grid[x][y].b;

              next[x][y].a = updateConcentration(a, laplaceAVal, b, 'a');
              next[x][y].b = updateConcentration(b, laplaceBVal, a, 'b');
          }
      }
  }

  function updateConcentration(conc, laplaceVal, otherConc, type) {
      var rate = type === 'a' ? p.parameters.dA.value : p.parameters.dB.value;
      var reactionTerm = type === 'a' ? -conc * otherConc * otherConc + p.parameters.feed.value * (1 - conc) 
                                      : conc * otherConc * otherConc - (p.parameters.k.value + p.parameters.feed.value) * conc;
      var diffusionTerm = rate * laplaceVal;
      var updatedConc = conc + p.parameters.dt.value * (diffusionTerm + reactionTerm);
      return p.constrain(updatedConc, 0, 1);
  }

  function laplace(x, y, type) {
      var sum = 0;
      var rate = 0.146; // Direct neighbor rate

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
      var nx = (x + p.parameters.w.value) % p.parameters.w.value;
      var ny = (y + p.parameters.h.value) % p.parameters.h.value;
      return grid[nx][ny][type];
  }

  function drawGrid() {
      p.loadPixels();
      for (var x = 0; x < p.parameters.w.value; x++) {
          for (var y = 0; y < p.parameters.h.value; y++) {
              var pix = (x + y * p.parameters.w.value) * 4;
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
      p.pixels[pixelIndex + 0] = colorVal;
      p.pixels[pixelIndex + 1]
