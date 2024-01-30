document.addEventListener('DOMContentLoaded', function() {
    let sketch1Instance = new p5(sketch1, 'container1');
    let sketch2Instance = new p5(sketch2, 'container2');

    createControls(sketch1Instance, 'container1-controls');
    createControls(sketch2Instance, 'container2-controls');

    // Add event listener for the Restart button
    document.getElementById('restart-sketch2').addEventListener('click', function() {
        sketch2Instance.initializeParticles(); // Call the method to reinitialize particles
        sketch2Instance.redraw();
    });

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
                    adjustContainerHeight(controlsContainerId, sketchInstance.parameters["h"].value);
                }

                sketchInstance.redraw();
            });
        }

        adjustContainerHeight(controlsContainerId, sketchInstance.parameters["h"].value);
    }

    function adjustContainerHeight(containerId, newHeight) {
        let container = document.getElementById(containerId).parentNode;
        if (container && container.classList.contains('sketch-container')) {
            container.style.height = newHeight + 'px';
        }
    }
});
