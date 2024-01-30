document.addEventListener('DOMContentLoaded', function() {
    let sketch1Instance = new p5(sketch1, 'container1');
    let sketch2Instance = new p5(sketch2, 'container2');

    createControls(sketch1Instance, 'container1-controls');
    // Assuming you'll add createControls for sketch2Instance too if needed

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
            slider.addEventListener('input', function() {
                sketchInstance.parameters[paramName].value = parseFloat(this.value);
                
                if (paramName === "w" || paramName === "h" || paramName === "width" || paramName === "height") {
                    sketchInstance.resizeCanvas(sketchInstance.parameters["w"].value, sketchInstance.parameters["h"].value);
                    adjustControlsContainerHeight(controlsContainerId, sketchInstance.parameters["h"].value);
                }

                sketchInstance.redraw();
            });
        }
    }

    function adjustControlsContainerHeight(containerId, newHeight) {
        let container = document.getElementById(containerId);
        container.style.maxHeight = newHeight + 'px'; // Adjust 50px for additional padding/spacing
    }
});
