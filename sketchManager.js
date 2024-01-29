// sketchManager.js

function createCanvasInContainer(sketchFunction) {
    const container = document.createElement("div"); // Create a new container
    document.body.appendChild(container); // Append it to the body or another parent container
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
  
    return new p5(sketchFunction, canvas);
  }
  