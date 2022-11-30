'use strict';

// Global variables that are set and used
// across the application
let gl

// set sphere and terrain
var terrainGen = new TerrainGen();
var sphere = new Sphere();

var fieldOfView = 2.094395;
var nearClippingPlaneDist = 1.0;
var farClippingPlaneDist = 100.0;
var aspectRatio = 0.0;

var camPosition = [0,0,-5];
let camAngle = [0,0,0];

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

    /* terrain */
    const vertexShaderTerrain = getShader('vertex-shader-terrain');
    const fragmentShaderTerrain = getShader('fragment-shader-terrain');

    // Create a program for terrain shader
    terrainGen.program = gl.createProgram();

    // Attach the shaders to this program
    gl.attachShader(terrainGen.program, vertexShaderTerrain);
    gl.attachShader(terrainGen.program, fragmentShaderTerrain);

    gl.linkProgram(terrainGen.program);

    if (!gl.getProgramParameter(terrainGen.program, gl.LINK_STATUS)) {
        console.error('Could not initialize terrain shaders');
    }

    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    terrainGen.program.aVertexPosition = gl.getAttribLocation(terrainGen.program, 'aVertexPosition');
    terrainGen.program.projection = gl.getUniformLocation (terrainGen.program, 'projection');
    terrainGen.program.view = gl.getUniformLocation (terrainGen.program, 'view');

    /* sphere */
    const vertexShaderSphere = getShader('vertex-shader-sphere');
    const fragmentShaderSphere = getShader('fragment-shader-sphere');

    // create program for sphere shaders
    sphere.program = gl.createProgram();

    // attach shaders to this program
    gl.attachShader(sphere.program, vertexShaderSphere);
    gl.attachShader(sphere.program, fragmentShaderSphere);

    gl.linkProgram(sphere.program);

    if (!gl.getProgramParameter(sphere.program, gl.LINK_STATUS)) {
        console.error('Could not initialize sphere shaders');
    }

    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    sphere.program.aVertexPosition = gl.getAttribLocation(sphere.program, 'aVertexPosition');
    sphere.program.projection = gl.getUniformLocation (sphere.program, 'projection');
    sphere.program.view = gl.getUniformLocation (sphere.program, 'view');


}

    // Set up the buffers
function initBuffers() {

    terrainGen.bufferPlaneData(0 , 0);
    sphere.bufferSphereData(0, 0);

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}


// We call draw to render to our canvas
function draw() {
    
    gl.useProgram(terrainGen.program);

    // Move camera
    //camPosition[2] += .1;
    //camPosition[0] += .05;
    const d = new Date();
    //camAngle[1] = Math.sin(d.getTime() / 5000);

    terrainGen.planeUpdate(camPosition[0], camPosition[2]);

    // uniform values
    let verticalFOV = fieldOfView * (aspectRatio);
    // makes closer objs bigger
    let projectionMat4 =[
        Math.atan(fieldOfView/2.0), 0, 0, 0,
        0, Math.atan(verticalFOV), 0, 0,
        0, 0, ((farClippingPlaneDist+nearClippingPlaneDist)/(farClippingPlaneDist-nearClippingPlaneDist)),-((2.0*(nearClippingPlaneDist*farClippingPlaneDist))/(farClippingPlaneDist-nearClippingPlaneDist)),
        0, 0, -1, 0
    ];
    gl.uniformMatrix4fv(terrainGen.program.projection, false, new Float32Array(projectionMat4));

    // Rotation + transformation matrix (transforming (translation) for the camera)
    let viewMat4 = [
        Math.cos(camAngle[1]), 0, -Math.sin(camAngle[1]), 0,
        0, 1, 0, 0,
        Math.sin(camAngle[1]), 0, Math.cos(camAngle[1]), 0,
        camPosition[0], camPosition[1], camPosition[2], 1
    ]
    gl.uniformMatrix4fv(terrainGen.program.view, false, new Float32Array(viewMat4));
    
    // Clear the scene // DONT DO THIS!
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Bind the VAO
    terrainGen.bindPlaneData();

    // Draw to the scene using triangle primitives
    gl.drawElements(gl.TRIANGLES, terrainGen.indices.length, gl.UNSIGNED_SHORT, 0);

    /* sphere */    
    gl.useProgram(sphere.program);

    gl.uniformMatrix4fv(sphere.program.projection, false, new Float32Array(projectionMat4));

    gl.uniformMatrix4fv(sphere.program.view, false, new Float32Array(viewMat4));

    // bind buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.sphereIndexBuffer);

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

// Entry point to our application
function init() {
   
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }

    // Set the canvas to the size of the screen

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    aspectRatio = canvas.width/canvas.height;

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Call the functions in an appropriate order
    initProgram();

    //setDataForPolygon();

    initBuffers();
    

    var f = function() {
        draw();
        window.requestAnimationFrame(f);
    };
    f();

    draw();

}

window.onload = init;