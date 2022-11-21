
class TerrainGen{
    indices = [];
    vertices = [];

    constructor(){
        
    }

    createPlane(subdivisions, size, origin = [0,-.5,0]){
        let dist = size/subdivisions;

        let currentIndex = 0;
        
        for(let i = 0; i < subdivisions; i++){
            for(let j = 0; j < subdivisions; j++){
                
                // Get relative offsets
                let x0 = origin[0] -(size/2) + (dist * i);
                let x1 = x0 + dist;
                let z0 = origin[2] + -(size/2) + (dist * j);
                let z1 = z0 + dist;
                
                // Triangle configurations for one quad
                this.vertices.push(x0, origin[1], z0, x0, origin[1], z1, x1, origin[1], z0, x1, origin[1], z1);
                
                this.indices.push(currentIndex + 0, currentIndex + 1, currentIndex + 2);
                this.indices.push(currentIndex + 3, currentIndex + 2, currentIndex + 1);
                currentIndex += 4;
            }
        }
    }

    bufferPlaneData(x, y , z){
        // clear your points and elements
        this.createPlane(100, 50, [x, y, z]);

        // create and bind vertex buffer
        if (myVertexBuffer == null) myVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        // Setting up the IBO
        if (myIndexBuffer == null) myIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }
}