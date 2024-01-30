document.addEventListener('DOMContentLoaded', function() {
    let sketch1Instance = new p5(sketch1, 'container1');
    let sketch2Instance = new p5(sketch2, 'container2');

    // Assuming you have sliders with IDs like 'bar-num-slider', 'bar-w-min-slider', etc.
    document.getElementById('bar-num-slider').addEventListener('input', function() {
        updateSketches();
    });
    document.getElementById('bar-w-min-slider').addEventListener('input', function() {
        updateSketches();
    });
    document.getElementById('bar-w-max-slider').addEventListener('input', function() {
        updateSketches();
    });

    function updateSketches() {
        let barNum = parseInt(document.getElementById('bar-num-slider').value);
        let barWMin = parseFloat(document.getElementById('bar-w-min-slider').value);
        let barWMax = parseFloat(document.getElementById('bar-w-max-slider').value);

        sketch1Instance.updateParameters(barNum, barWMin, barWMax);
    }
});
