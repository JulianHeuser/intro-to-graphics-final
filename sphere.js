/*
 * author: Renee Veit and Julian Heuser
 *
 */

// need vertex buffers for sphere

class Sphere{

    // keep track of indices to reuse what you have vs recreating points
    indices = [];
    vertices = [];

    vertexBuffer = null;
    sphereIndexBuffer = null;

    constructor(){}

    /*
    * creates triangles for a sphere with a diameter of 1
    * (centered at the origin) with number of slides (longitude) given by
    * slices and the number of stacks (lattitude) given by stacks.
    * code based on Julian's implementation of the sphere
    */
    makeSphere(slices, stacks){
        this.vertices = [];
        this.indices = [];


        let radius = 0.5;
        let sliceSize = (Math.PI * 2) / slices;
        let stackSize = (Math.PI * 2) / stacks;
        // console.log("sliceSize: " + sliceSize + " stackSize: " + stackSize);

        // 2D array for vertex points
        let points = Array.from(Array(slices + 1), ()=> Array(stacks + 1));
        let x, y, z, theta, phi;

        // create every single point on the squere
        for(let i = 0; i < slices + 1; i++){
  
            // the first and last vertices have the same position and normal, but diff tex coordinates
            for(let j = 0; j < stacks + 1; j++){

                // going from 0 to 360
                theta = i * sliceSize;
                // starting at PI/2, going to -PI/2
                phi = j * stackSize / 2;

                // spherical --> cartesian coords
                x = radius * Math.cos(theta) * Math.sin(phi);
                y = radius * Math.sin(theta) * Math.sin(phi);
                z = radius * Math.cos(phi);

                // console.log("i: " + i + " j: " + j + " theta: " + theta + " phi: " + phi + " x: " + x + " y: " + y + " z: " + z);
                points[i][j] = [x,y,z];
            }
        }

        // loop through the sphere quads and call sphere Buffer
        for(let i = 0; i < slices; i++){
            for(let j = 0; j < stacks; j++){

                let p0 = points[i][j];
                let p1 = points[i][j+1];
                let p2 = points[i+1][j+1];
                let p3 = points[i+1][j];
                // console.log("p0: " + p0 + " p1: " + p1 + " p2: " + p2 + " p3: " + p3);

                this.sphereBuffer(p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
                this.sphereBuffer(p0[0], p0[1], p0[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
            }
        }
    }

    sphereBuffer(x0,y0,z0,x1,y1,z1,x2,y2,z2){

        let numVertices = this.vertices.length / 4;

        // vertex 1
        this.vertices.push(x0);
        this.vertices.push(y0);
        this.vertices.push(z0);
        // push u and v for texture coordinates
        //vertices.push(1.0); // not sure about this
        this.indices.push(numVertices);
        numVertices++;

        // vertex 2
        this.vertices.push(x1);
        this.vertices.push(y1);
        this.vertices.push(z1);
        //vertices.push(1.0); // not sure about this
        this.indices.push(numVertices);
        numVertices++;

        // vertex 3
        this.vertices.push(x2);
        this.vertices.push(y2);
        this.vertices.push(z2);
        //vertices.push(1.0); // not sure about this
        this.indices.push(numVertices);
        numVertices++;
    }

    bufferSphereData(x, z){
        this.currentOrigin = [x, z];

        // create points and indices
        this.makeSphere(10, 10); 

        // create and bind vertex buffer
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(this.program.aVertexPosition);
        gl.vertexAttribPointer(this.program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        // Setting up the IBO
        if (this.sphereIndexBuffer == null) this.sphereIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sphereIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.DYNAMIC_DRAW);
    }
}

