/*
 * author: Renee Veit and Julian Heuser
 *
 */

class Sphere{

    // keep track of indices to reuse what you have vs recreating points
    indices = [];
    vertices = [];

    vertexBuffer = null;
    indexBuffer = null;

    program;

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

        const radius = 200.0;
        const sliceSize = (Math.PI * 2) / slices;
        const stackSize = (Math.PI * 2) / stacks;
        // console.log("sliceSize: " + sliceSize + " stackSize: " + stackSize);

        // 2D array for vertex points
        let points = Array.from(Array(slices + 1), ()=> Array(stacks + 1));

        // create every single point on the squere
        // plus one duplicates the last point
        for(let i = 0; i < slices + 1; i++){
  
            // the first and last vertices have the same position and normal, but diff tex coordinates
            for(let j = 0; j < stacks + 1; j++){

                // going from 0 to 360
                let theta = i * sliceSize;
                // starting at PI/2, going to -PI/2
                let phi = j * stackSize / 2;

                // spherical --> cartesian coords
                let x = radius * Math.cos(theta) * Math.sin(phi);
                let y = radius * Math.sin(theta) * Math.sin(phi);
                let z = radius * Math.cos(phi);

                // console.log("i: " + i + " j: " + j + " theta: " + theta + " phi: " + phi + " x: " + x + " y: " + y + " z: " + z);
                points[i][j] = [x, y, z, 1 - (theta / Math.PI), phi / (2 * Math.PI)];
            }
        }

        let currentIndex = 0;

        // loop through the sphere quads and call sphere Buffer
        for(let i = 0; i < slices; i++){
            for(let j = 0; j < stacks; j++){

                let p0 = points[i][j];
                let p1 = points[i][j+1];
                let p2 = points[i+1][j+1];
                let p3 = points[i+1][j];
                // console.log("p0: " + p0 + " p1: " + p1 + " p2: " + p2 + " p3: " + p3);

                // make sure to draw ccw
                this.vertices.push( p0[0], p0[1], p0[2], p0[3], p0[4],
                                    p1[0], p1[1], p1[2], p1[3], p1[4],
                                    p2[0], p2[1], p2[2], p2[3], p2[4],
                                    p3[0], p3[1], p3[2], p3[3], p3[4]);

                this.indices.push(currentIndex + 0, currentIndex + 1, currentIndex + 2);
                this.indices.push(currentIndex + 0, currentIndex + 2, currentIndex + 3);
                currentIndex += 4;
            }
        }

        // debugging
        // for(let j = 0; j < stacks; j++){

        //     let p0 = points[8][j];
        //     let p1 = points[8][j+1];
        //     let p2 = points[8+1][j+1];
        //     let p3 = points[8+1][j];
        //     // console.log("p0: " + p0 + " p1: " + p1 + " p2: " + p2 + " p3: " + p3);

        //     this.sphereBuffer(p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
        //     this.sphereBuffer(p0[0], p0[1], p0[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
        // }
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

        // bind textcoord buffer
        gl.enableVertexAttribArray(this.program.aTextCoord);
        this.bindVertexAttribPointers();

        // Setting up the IBO
        if (this.indexBuffer == null) this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.DYNAMIC_DRAW);
    }

    bindVertexAttribPointers(){
        gl.vertexAttribPointer(this.program.aVertexPosition, 3, gl.FLOAT, false, 5 * 4, 0);
        gl.vertexAttribPointer(this.program.aTextCoord, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
    }
}

