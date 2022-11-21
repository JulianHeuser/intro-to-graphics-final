
class TerrainGen{
    indices = [];
    vertices = [];

    vertexBuffer = null;
    indexBuffer = null;


    planeHeight = -5;

    currentOrigin = [0 ,0]

    constructor(){}

    createPlane(subdivisions, size){
        let dist = size/subdivisions;

        let currentIndex = 0;

        let lod = 0;

        this.vertices = [];
        this.indices = [];
        
        for(let i = 0; i < subdivisions; i++){
            for(let j = 0; j < subdivisions; j++){
                
                // Get relative offsets
                let x0 = this.currentOrigin[0] - (size/2) + (dist * i);
                let x1 = x0 + dist;
                let z0 = this.currentOrigin[1] - (size/2) + (dist * j);
                let z1 = z0 + dist;
                
                // Triangle configurations for one quad
                this.vertices.push(x0, this.planeHeight, z0, x0, this.planeHeight, z1, x1, this.planeHeight, z0, x1, this.planeHeight, z1);
                
                this.indices.push(currentIndex + 0, currentIndex + 1, currentIndex + 2);
                this.indices.push(currentIndex + 3, currentIndex + 2, currentIndex + 1);
                currentIndex += 4;
            }
        }
    }

    bufferPlaneData(x, z){
        this.currentOrigin = [x, z];

        // create points and indices
        this.createPlane(100, 100);

        // create and bind vertex buffer
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        // Setting up the IBO
        if (this.indexBuffer == null) this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.DYNAMIC_DRAW);
    }

    bindPlaneData(){
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    planeUpdate(x, z){

        x = -Math.floor(x);
        z = -Math.floor(z);
        
        if (this.dist(x, z, this.currentOrigin[0], this.currentOrigin[1]) < 10){
            return;
        }

        this.bufferPlaneData(x, z);

        // Clean
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    dist(x0, z0, x1, z1){
        return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(z0 - z1, 2));
    }
}