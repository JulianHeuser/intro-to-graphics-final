'use strict';

    // Global variables that are set and used
    // across the application
    let gl,
    program,
    verticesSize,
    vertexBuffer,
    vertices,
    drawingTop,
    drawingLeft,
    canvas;

    // Given an id, extract the content's of a shader script
    // from the DOM and return the compiled shader
function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();

    // Assign shader depending on the type of shader
    let shader;
    if (script.type === 'x-shader/x-vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (script.type === 'x-shader/x-fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
        return null;
    }

    // Compile the shader using the supplied shader code

    gl.shaderSource(shader, shaderString);

    gl.compileShader(shader);



    // Ensure the shader is valid

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        console.error(gl.getShaderInfoLog(shader));
        return null;

    }



    return shader;

}

// Create a program with the appropriate vertex and fragment shaders
function initProgram() {

    const vertexShader = getShader('vertex-shader');

    const fragmentShader = getShader('fragment-shader');



    // Create a program

    program = gl.createProgram();

    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

        console.error('Could not initialize shaders');

    }



    // Use this program instance

    gl.useProgram(program);

    // We attach the location of these shader values to the program instance
    // for easy access later in the code

    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');

}

    // Set up the buffers
function initBuffers() {

    

    // Setting up the VBO

    vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);



    // Clean

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

}

    // We call draw to render to our canvas
function draw() {

    // Clear the scene

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);



    // Use the buffers we've constructed

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(program.aVertexPosition);



    // Draw to the scene using an array of points

    gl.drawArrays(gl.POINTS, 0, verticesSize);



    // Clean

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

// Entry point to our application
function init() {
   

    // Retrieve the canvas

    canvas = utils.getCanvas('webgl-canvas');

    // Set the canvas to the size of the screen

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

    canvas.onmouseup = function (ev) { addMousePoint(ev, gl, canvas) };


    // array for buffering data

    vertices = new Float32Array(canvas.width*canvas.height*3);
    verticesSize = 0;



    // figure out the top and left of our particular window

    drawingTop = 0;

    drawingLeft = 0;

    let tmpCanvas = canvas;

    while (tmpCanvas && tmpCanvas.tagName !== 'BODY') {

        drawingTop += tmpCanvas.offsetTop;
        drawingLeft += tmpCanvas.offsetLeft;

        tmpCanvas = tmpCanvas.offsetParent;

    }

    drawingLeft += window.pageXOffset;

    drawingTop -= window.pageYOffset;



    // Retrieve a WebGL context

    gl = utils.getGLContext(canvas);

    // Set the clear color to be black

    gl.clearColor(0, 0, 0, 1);

    // Call the functions in an appropriate order
    initProgram();

    //setDataForPolygon();

    initBuffers();
    draw();

}

window.onload = init;