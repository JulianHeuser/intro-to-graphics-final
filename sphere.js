/*
 * author: Renee Veit and Julian Heuser
 *
 */

// need vertex buffers for sphere

class sphere{

    // keep track of indices to reuse what you have vs recreating points
    indices = [];

    vertexBuffer = null;
    indexBuffer = null;

    /*
    * creates triangles for a sphere with a diameter of 1
    * (centered at the origin) with number of slides (longitude) given by
    * slices and the number of stacks (lattitude) given by stacks.
    * code based on: https://www.songho.ca/opengl/gl_sphere.html 
    */
    makeSphere(slices, stacks){

        let radius = 0.5;
        let sliceSize = (Math.PI * 2) / slices;
        let stackSize = (Math.PI * 2) / stacks;
        // 2D array for vertex points
        let vertices = Array.from(Array(slices + 1), ()=> Array(stacks + 1));
        let x, y, z, theta, phi;
        // let normals, textureCoords = new Array();
        // // vertex normal points
        // let xnorm, ynorm, znorm, inverseLen = 1.0 / radius;
        // // texture coordinates
        // let u, v;

        // slice and stack value for each iteration
        // let sliceStep = (Math.PI *2) / sliceCount;
        // let stackStep = Math.PI / stackCount;
        // // stackAngle = theta, sliceAngle = alpha
        // let sliceAngle, stackAngle;

        // create every single point on the squere
        for(let i = 0; i <= slices; ++i){
            // stackAngle = Math.PI / 2 - i * stackStep;
            // rcosTheta = radius * Math.cos(stackAngle);
            // z = radius * Math.sin(stackAngle);

            // add (sliceCount + 1) vertices per stack
            // the first and last vertices have the same position and normal, but diff tex coordinates
            for(let j = 0; j <= sliceCount; ++j){

                // going from 0 to 360
                theta = i * sliceSize;
                // starting at PI/2, going to -PI/2
                phi = j * stackSize / 2;

                // spherical --> cartesian coords
                x = radius * Math.cos(theta) * Math.sin(phi);
                y = radius * Math.sin(theta) * Math.sin(phi);
                z = radius * Math.cos(phi);

                points[i][j] = [x,y,z];

            }
        }

        // loop through the sphere quads and call sphere Buffer
        for(let i = 0; i <= slices; ++i){
            for(let j = 0; j <= sliceCount; ++j){

                let p0 = points[i][j];
                let p1 = points[i][j+1];
                let p2 = points[i+1][j+1];
                let p3 = points[i+1][j];

                sphereBuffer(p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
                sphereBuffer(p0[0], p0[1], p0[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
            }

        }

    }

    sphereBuffer(x0,y0,z0,x1,y1,z1,x2,y2,z2){

        let numVertices = vertices.length / 4;

        // vertex 1
        vertices.push(x0);
        vertices.push(y0);
        vertices.push(z0);
        // push u and v for texture coordinates
        //vertices.push(1.0); // not sure about this
        indices.push(numVertices);
        numVertices++;

        // vertex 2
        vertices.push(x1);
        vertices.push(y1);
        vertices.push(z1);
        //vertices.push(1.0); // not sure about this
        indices.push(numVertices);
        numVertices++;

        // vertex 3
        vertices.push(x2);
        vertices.push(y2);
        vertices.push(z2);
        //vertices.push(1.0); // not sure about this
        indices.push(numVertices);
        numVertices++;
    }
}

