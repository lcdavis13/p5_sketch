var sketch1 = function(p) {
  // Parameters metadata
  p.parameters = {
    w: {label: 'Width', min: 32, max: 1024, step: 2, value: 500},
    h: {label: 'Height', min: 32, max: 1024, step: 2, value: 320},
    xMargin: { label: 'X Margin', min: 0, max: 100, step: 1, value: 25 },
    yMargin: { label: 'Y Margin', min: 0, max: 100, step: 1, value: 25 },
    barNum: { label: 'Number of Bars', min: 1, max: 100, step: 1, value: 25 },
    barWMin: { label: 'Minimum Bar Width', min: 0, max: 1, step: 0.01, value: 0.05 },
    barWMax: { label: 'Maximum Bar Width', min: 0, max: 1, step: 0.1, value: 0.6 },
    barPhi0: { label: 'Bar Phi Start', min: 0, max: 2 * p.PI, step: 0.05 * p.PI, value: 0.0 },
    barPhi1: { label: 'Bar Phi End', min: 0, max: 2 * p.PI, step: 0.05 * p.PI, value: p.PI },
    barAlpha0: { label: 'Bar Alpha Start', min: 0, max: 1, step: 0.1, value: 1.0 },
    barAlpha1: { label: 'Bar Alpha End', min: 0, max: 1, step: 0.1, value: 0.5 },
    dispMag: { label: 'Displacement Magnitude', min: -1, max: 1, step: 0.01, value: 1.0 / 6.0 },
    dispTheta0: { label: 'Displacement Theta Start', min: 0, max: 2 * p.PI, step: 0.05 * p.PI, value: 0.025 * p.PI },
    dispTheta1: { label: 'Displacement Theta End', min: 0, max: 2 * p.PI, step: 0.05 * p.PI, value: 0.975 * p.PI },
    dispRho0: { label: 'Displacement Rho Start', min: 0, max: 2 * p.PI, step: 0.05 * p.PI, value: 0.0 },
    dispRho1: { label: 'Displacement Rho End', min: 0, max: 2 * p.PI, step: 0.05 * p.PI, value: p.PI },
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
    p.noLoop();
  };

  function convert(x, x0, x1, y0, y1) {
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
  }

  p.draw = function() {
    const {
      xMargin, w, yMargin, h, barNum, barWMin, barWMax, barPhi0,
      barPhi1, barAlpha0, barAlpha1, dispMag, dispTheta0, dispTheta1,
      dispRho0, dispRho1
    } = params();

    let x0 = xMargin;
    let x1 = w - xMargin;
    let y0 = yMargin;
    let y1 = h - yMargin;
    let bar_interval = (x1 - x0) / barNum;

    p.background(0, 0, 0);
    p.strokeWeight(2);

    for (let i = 0; i < barNum + 1; i++) {
      p.stroke(255, 255, 255, 255 * convert(i, 0, barNum, barAlpha0, barAlpha1));

      let phi = convert(i, 0, barNum, barPhi0, barPhi1);
      let bar_cos = p.cos(phi);
      let bar_w = p.int(convert(bar_cos, -1.0, 1.0, barWMin * bar_interval, barWMax * bar_interval));

      let base_x = convert(i, 0, barNum, x0, x1);
      for (let y = y0; y < y1; y += 1) {
        let theta = convert(y, y0, y1, dispTheta0, dispTheta1);
        let rho = convert(i, 0, barNum, dispRho0, dispRho1);

        let x = base_x + p.sin(theta) ** 2 * p.sin(rho) ** 2 * dispMag * (x1 - x0);

        p.line(x, y, x + bar_w, y);
      }
    }
  };
};
