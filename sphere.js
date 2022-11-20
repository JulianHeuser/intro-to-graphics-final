/*
* creates triangles for a sphere with a diameter of 1
* (centered at the origin) with number of slides (longitude) given by
* slices and the number of stacks (lattitude) given by stacks.
* code based on: https://www.songho.ca/opengl/gl_sphere.html 
*/
function makeSphere(sliceCount, stackCount){

    // diameter of 1, radius of 0.5
    let diameter = 1.0;
    let radius = diameter / 2.0;
    // vertex points
    let x, y, z, rcosTheta;
    let vertices, normals, textureCoords = new Array();
    // vertex normal points
    let xnorm, ynorm, znorm, inverseLen = 1.0 / radius;
    // texture coordinates
    let u, v;

    // slice and stack value for each iteration
    let sliceStep = (Math.PI *2) / sliceCount;
    let stackStep = Math.PI / stackCount;
    // stackAngle = theta, sliceAngle = alpha
    let sliceAngle, stackAngle;

    for(let i = 0; i <= stackCount; ++i){
        // starting at PI/2, going to -PI/2
        stackAngle = Math.PI / 2 - i * stackStep;
        rcosTheta = radius * Math.cos(stackAngle);
        z = radius * Math.sin(stackAngle);

        // add (sliceCount + 1) vertices per stack
        // the first and last vertices have the same position and normal, but diff tex coordinates
        for(let j = 0; j <= sliceCount; ++j){

            // starting at 0 going to 2PI
            sliceAngle = J * sliceStep;

            // fill in vertext position (x,y,z)
            x = rcosTheta * Math.cos(sliceAngle);
            y = rcosTheta * Math.sin(sliceAngle);
            vertices.push(x);
            vertices.push(y);
            vertices.push(z);

            // normalize vertex normal
            xnorm = x * inverseLen;
            ynorm = y * inverseLen;
            znorm = z * inverseLen;
            normals.push(xnorm);
            normals.push(ynorm);
            normals.push(znorm);

            // vertex texture coordinates (u, v) range between [0, 1]
            u = parseFloat(j) / sliceCount;
            v = parseFloat(i) / stackCount;
            textureCoords.push(u);
            textureCoords.push(v);

        }
    }

}