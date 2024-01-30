var sketch1 = function(p) {
  // Canvas dimensions
  let w = 500;
  let h = 320;

  // Parameters metadata
  p.parameters = {
    xMargin: { label: 'X Margin', min: 0, max: 100, step: 1, value: 25 },
    yMargin: { label: 'Y Margin', min: 0, max: 100, step: 1, value: 25 },
    barNum: { label: 'Number of Bars', min: 1, max: 100, step: 1, value: 35 },
    barWMin: { label: 'Minimum Bar Width', min: 0.01, max: 1, step: 0.01, value: 0.05 },
    barWMax: { label: 'Maximum Bar Width', min: 0.1, max: 2, step: 0.1, value: 0.6 },
    barPhi0: { label: 'Bar Phi Start', min: 0, max: 2 * p.PI, step: 0.05 * p.PI, value: 0.0 },
    barPhi1: { label: 'Bar Phi End', min: 0, max: 2 * p.PI, step: 0.05 * p.PI, value: p.PI },
    barAlpha0: { label: 'Bar Alpha Start', min: 0, max: 1, step: 0.1, value: 1.0 },
    barAlpha1: { label: 'Bar Alpha End', min: 0, max: 1, step: 0.1, value: 0.5 },
    dispMag: { label: 'Displacement Magnitude', min: 0, max: 1, step: 0.01, value: 1.0 / 6.0 },
    dispTheta0: { label: 'Displacement Theta Start', min: 0, max: p.PI, step: 0.05 * p.PI, value: 0.025 * p.PI },
    dispTheta1: { label: 'Displacement Theta End', min: 0, max: p.PI, step: 0.05 * p.PI, value: 0.975 * p.PI },
    dispRho0: { label: 'Displacement Rho Start', min: 0, max: 2 * p.PI, step: 0.05 * p.PI, value: 0.0 },
    dispRho1: { label: 'Displacement Rho End', min: 0, max: 2 * p.PI, step: 0.05 * p.PI, value: p.PI },
  };

  p.setup = function() {
    p.createCanvas(w, h);
    p.noLoop()
  };

  function convert(x, x0, x1, y0, y1) {
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
  }

  p.draw = function() {
    let x0 = p.parameters.xMargin;
    let x1 = w - p.parameters.xMargin;
    let y0 = p.parameters.yMargin;
    let y1 = h - p.parameters.yMargin;
    let bar_interval = (x1 - x0) / p.parameters.barNum;

    p.background(0, 0, 0);
    p.strokeWeight(2);

    for (let i = 0; i < p.parameters.barNum + 1; i++) {
      p.stroke(255, 255, 255, 255 * convert(i, 0, p.parameters.barNum, p.parameters.barAlpha0, p.parameters.barAlpha1));

      let phi = convert(i, 0, p.parameters.barNum, p.parameters.barPhi0, p.parameters.barPhi1)
      let bar_cos = p.cos(phi);
      let bar_w = p.int(convert(bar_cos, -1.0, 1.0, p.parameters.barWMin * bar_interval, p.parameters.barWMax * bar_interval));

      let base_x = convert(i, 0, p.parameters.barNum, x0, x1)
      for (let y = y0; y < y1; y += 1) {
        let theta = convert(y, y0, y1, p.parameters.dispTheta0, p.parameters.dispTheta1);
        let rho = convert(i, 0, p.parameters.barNum, p.parameters.dispRho0, p.parameters.dispRho1);

        let x = base_x + p.sin(theta) ** 2 * p.sin(rho) ** 2 * p.parameters.dispMag * (x1 - x0);

        p.line(x, y, x + bar_w, y);
      }
    }
  };
};
