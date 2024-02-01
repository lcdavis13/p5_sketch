// Reaction-Diffusion
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/13-reaction-diffusion
// https://youtu.be/BV9ny785UNc
// https://nebula.tv/videos/the-coding-train-coding-challenge-13-reaction-diffusion-algorithm-in-p5js

// Code from Challenge: https://editor.p5js.org/codingtrain/sketches/govdEW5aE
// Written entirely based on
// http://www.karlsims.com/rd.html

// Also, for reference
// http://hg.postspectacular.com/toxiclibs/src/44d9932dbc9f9c69a170643e2d459f449562b750/src.sim/toxi/sim/grayscott/GrayScott.java?at=default

var grid;
var next;

var dA = 1;
var dB = 0.5;
var feed = 0.055;
var k = 0.062;
var dt = 1.0;
var diagonal_rate = 0.709; //1/sqrt(2)

function setup() {
  createCanvas(200, 200);
  pixelDensity(1);
  grid = [];
  next = [];
  for (var x = 0; x < width; x++) {
    grid[x] = [];
    next[x] = [];
    for (var y = 0; y < height; y++) {
      grid[x][y] = {
        a: 1,
        b: 0
      };
      next[x][y] = {
        a: 1,
        b: 0
      };
    }
  }

  for (var i = 150; i < 160; i++) {
    for (var j = 150; j < 160; j++) {
      grid[i][j].b = 1;
    }
  }

}

function draw() {
  background(51);

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var a = grid[x][y].a;
      var b = grid[x][y].b;
      next[x][y].a = a + dt*
        ((dA * laplaceA(x, y)) -
        (a * b * b) +
        (feed * (1 - a)));
      next[x][y].b = b + dt*
        ((dB * laplaceB(x, y)) +
        (a * b * b) -
        ((k + feed) * b));

      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);
    }
  }


  loadPixels();
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var pix = (x + y * width) * 4;
      var a = next[x][y].a;
      var b = next[x][y].b;
      var c = floor((a - b) * 255);
      c = constrain(c, 0, 255);
      pixels[pix + 0] = c;
      pixels[pix + 1] = c;
      pixels[pix + 2] = c;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();


  swap();


}

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