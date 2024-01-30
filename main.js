document.addEventListener('DOMContentLoaded', function() {
    let sketch1Instance = new p5(sketch1, 'container1');
    let sketch2Instance = new p5(sketch2, 'container2');

    createControls(sketch1Instance, 'container1-controls');

    function createControls(sketchInstance, controlsContainerId) {
        let container = document.getElementById(controlsContainerId);

        for (let paramName in sketchInstance.parameters) {
            let param = sketchInstance.parameters[paramName];

            // Create label
            let label = document.createElement('label');
            label.innerHTML = param.label;
            container.appendChild(label);

            // Create slider
            let slider = document.createElement('input');
            slider.type = 'range';
            slider.id = controlsContainerId + '-' + paramName;
            slider.min = param.min;
            slider.max = param.max;
            slider.step = param.step;
            slider.value = param.value;

            container.appendChild(slider);
            container.appendChild(document.createElement('br'));

            // Event listener for slider
            let slideFunc;
            if (paramName == "w" || paramName == "h" || paramName == "width" || paramName == "height") 
                slideFunc = function() {
                    sketchInstance.parameters[paramName].value = parseFloat(this.value);
                    sketchInstance.resizeCanvas(sketchInstance.parameters["w"].value, sketchInstance.parameters["h"].value);
                    sketchInstance.redraw();
                }
            else
                slideFunc = function() {
                    sketchInstance.parameters[paramName].value = parseFloat(this.value);
                    sketchInstance.redraw();
                }
            slider.addEventListener('input', slideFunc);
        }
    }
});
