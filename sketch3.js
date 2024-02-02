var sketch3 = function(p) {
  var grid, next;
  var diagonal_rate = 0.709; // 1/sqrt(2)

  p.parameters = {
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
      for (var x = 0; x < p.width; x++) {
          grid[x] = [];
          next[x] = [];
          for (var y = 0; y < p.height; y++) {
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

      for (var x = 0; x < p.width; x++) {
          for (var y = 0; y < p.height; y++) {
              var a = grid[x][y].a;
              var b = grid[x][y].b;
              next[x][y].a = a + p.parameters.dt.value *
                  ((p.parameters.dA.value * laplaceA(x, y)) -
                  (a * b * b) +
                  (p.parameters.feed.value * (1 - a)));
              next[x][y].b = b + p.parameters.dt.value *
                  ((p.parameters.dB.value * laplaceB(x, y)) +
                  (a * b * b) -
                  ((p.parameters.k.value + p.parameters.feed.value) * b));

              next[x][y].a = p.constrain(next[x][y].a, 0, 1);
              next[x][y].b = p.constrain(next[x][y].b, 0, 1);
          }
      }

      p.loadPixels();
      for (var x = 0; x < p.width; x++) {
          for (var y = 0; y < p.height; y++) {
              var pix = (x + y * p.width) * 4;
              var a = next[x][y].a;
              var b = next[x][y].b;
              var c = p.floor((a - b) * 255);
              c = p.constrain(c, 0, 255);
              p.pixels[pix + 0] = c;
              p.pixels[pix + 1] = c;
              p.pixels[pix + 2] = c;
              p.pixels[pix + 3] = 255;
          }
      }
      p.updatePixels();

      swap();
  };

  function getxy(x, y) {
    let nx, ny;
    if (x < 0)
    {
      nx = width + x;
    }
    else if (x >= width)
    {
      nx = x - width;
    }
    else
    {
      nx = x;
    }  
    if (y < 0)
    {
      ny = height + y;
    }
    else if (y >= height)
    {
      ny = y - height;
    }
    else
    {
      ny = y;
    }
    return grid[nx][ny];
    
    
    if (x < 0) {
      nx = x-(x%width)
    }
    else
    {
      nx = x%width;
    }
    if (y < 0) {
      ny = y-(y%height)
    }
    else
    {
      ny = y%height;
    }
    return grid[nx][ny];
  }
  
  
  function laplaceA(x, y) {
    var sumA = 0;
    var rate = 0.146;
    sumA += grid[x][y].a * -1;
    sumA += getxy(x - 1, y).a * rate;
    sumA += getxy(x + 1, y).a * rate;
    sumA += getxy(x, y + 1).a * rate;
    sumA += getxy(x, y - 1).a * rate;
    sumA += getxy(x - 1, y - 1).a * rate*diagonal_rate;
    sumA += getxy(x + 1, y - 1).a * rate*diagonal_rate;
    sumA += getxy(x + 1, y + 1).a * rate*diagonal_rate;
    sumA += getxy(x - 1, y + 1).a * rate*diagonal_rate;
    return sumA;
  }
  
  function laplaceB(x, y) {
    var sumB = 0;
    var rate = 0.146;
    sumB += grid[x][y].b * -1;
    sumB += getxy(x - 1, y).b * rate;
    sumB += getxy(x + 1, y).b * rate;
    sumB += getxy(x, y + 1).b * rate;
    sumB += getxy(x, y - 1).b * rate;
    sumB += getxy(x - 1, y - 1).b * rate*diagonal_rate;
    sumB += getxy(x + 1, y - 1).b * rate*diagonal_rate;
    sumB += getxy(x + 1, y + 1).b * rate*diagonal_rate;
    sumB += getxy(x - 1, y + 1).b * rate*diagonal_rate;
    return sumB;
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
