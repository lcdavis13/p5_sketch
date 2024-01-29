var sketch2 = function(p) {
  //Canvas
let w = 500;
let h = 320;
let x_margin = 25;
let y_margin = x_margin;

// Bar width
let bar_num = 15;
let bar_w_min = 0.05;
let bar_w_max = 0.6;
let bar_phi_0 = 0.0;
let bar_phi_1 = Math.PI;
let bar_alpha_0 = 1.0;
let bar_alpha_1 = 0.5;

// Bar displacement
let disp_mag = 1.0/6.0;
let disp_theta0 = 0.025*Math.PI;
let disp_theta1 = 0.975*Math.PI;
let disp_rho0 = 0.0;
let disp_rho1 = 1.0*Math.PI;

function setup() {
  createCanvas(w, h);
}

function convert(x, x0, x1, y0, y1)
{
  return y0 + (x - x0)*(y1 - y0)/(x1 - x0);
}

function draw() {

  //define draw area
  let x0 = x_margin;
  let x1 = w - x_margin;
  let y0 = y_margin;
  let y1 = h - y_margin;
  let bar_interval = (x1 - x0)/bar_num;
  
  background(0, 0, 0);
  strokeWeight(2);
  
  for (let i = 0; i < bar_num+1; i++) 
  {
    stroke(255, 255, 255, 255*convert(i, 0, bar_num, bar_alpha_0, bar_alpha_1));

    let phi = convert(i, 0, bar_num, bar_phi_0, bar_phi_1)
    let bar_cos = cos(phi);
    let bar_w = int(convert(bar_cos, -1.0, 1.0, bar_w_min*bar_interval, bar_w_max*bar_interval));

    let base_x = convert(i, 0, bar_num, x0, x1)
    for (let y = y0; y < y1; y += 1) 
    {
      let theta = convert(y, y0, y1, disp_theta0, disp_theta1);
      let rho = convert(i, 0, bar_num, disp_rho0, disp_rho1);
      
      let x = base_x + sin(theta) ** 2 * sin(rho) ** 2 * disp_mag*(x1 - x0);

      line(x, y, x + bar_w, y);

    }
  }

}

// createCanvasInContainer(() => {
//   setup();
//   draw();
// });


};