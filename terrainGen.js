
function createPlane(subdivisions, size, height = -.5){
    let dist = size/subdivisions;

    let points = [];
    let indices = [];

    let currentIndex = 0;
    
    for(let i = 0; i < subdivisions; i++){
        for(let j = 0; j < subdivisions; j++){
            
            // Get relative offsets
            let x0 = -(size/2) + (dist * i);
            let x1 = x0 + dist;
            let y0 = -(size/2) + (dist * j);
            let y1 = y0 + dist;
            
            // Triangle configurations for one quad
            points.push(x0, height, y0, x0, height, y1, x1, height, y0, x1, height, y1);
            
            indices.push(currentIndex + 0, currentIndex + 1, currentIndex + 2);
            indices.push(currentIndex + 3, currentIndex + 2, currentIndex + 1);
            currentIndex += 4;
        }
    }
    console.log(points);
    console.log(indices);

    return [points, indices];
}