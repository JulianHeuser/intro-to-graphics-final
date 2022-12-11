
class TerrainGen{
    indices = [];
    vertices = [];

    vertexBuffer = null;
    indexBuffer = null;

    program;

    currentOrigin = [0, 0]

    planeHeight = -15;
    subdivisions = 100;
    size = 100;
    textCoordSize = 10;

    constructor(){}

    createPlane(){
        let dist = this.size/this.subdivisions;

        let currentIndex = 0;

        this.vertices = [];
        this.indices = [];
        this.textCoords = [];
        
        for(let i = 0; i < this.subdivisions; i++){
            for(let j = 0; j < this.subdivisions; j++){
                
                // Get relative offsets
                let x0 = this.currentOrigin[0] - (this.size/2) + (dist * i);
                let x1 = x0 + dist;
                let z0 = this.currentOrigin[1] - (this.size/2) + (dist * j);
                let z1 = z0 + dist;
                
                // Triangle configurations for one quad
                this.vertices.push( x0, this.planeHeight, z0, x0 / this.size * this.textCoordSize, z0 / this.size * this.textCoordSize,
                                    x0, this.planeHeight, z1, x0 / this.size * this.textCoordSize, z1 / this.size * this.textCoordSize,
                                    x1, this.planeHeight, z0, x1 / this.size * this.textCoordSize, z0 / this.size * this.textCoordSize,
                                    x1, this.planeHeight, z1, x1 / this.size * this.textCoordSize, z1 / this.size * this.textCoordSize);
                
                this.indices.push(currentIndex + 0, currentIndex + 1, currentIndex + 2);
                this.indices.push(currentIndex + 3, currentIndex + 2, currentIndex + 1);
                currentIndex += 4;
            }
        }
    }

    bufferPlaneData(x, z){
        this.currentOrigin = [x, z];

        // create points and indices
        this.createPlane();

        // create and bind vertex buffer
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(this.program.aVertexPosition);

        // bind textcoord buffer
        gl.enableVertexAttribArray(this.program.aTextCoord);
        this.bindVertexAttribPointers();

        // Setting up the index buffer
        if (this.indexBuffer == null) this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.DYNAMIC_DRAW);
    }

    bindVertexAttribPointers(){
        gl.vertexAttribPointer(this.program.aVertexPosition, 3, gl.FLOAT, false, 5 * 4, 0);
        gl.vertexAttribPointer(this.program.aTextCoord, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
    }

    planeUpdate(x, z){

        let factor = (this.size/this.subdivisions)
        x = -Math.floor(x / factor) * factor;
        z = -Math.floor(z / factor) * factor;
        
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