class cgIShape {
    constructor () {
        this.points = [];
        this.bary = [];
        this.indices = [];
    }
    
    addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {
        var nverts = this.points.length / 4;
        
        // push first vertex
        this.points.push(x0);  this.bary.push (1.0);
        this.points.push(y0);  this.bary.push (0.0);
        this.points.push(z0);  this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
        
        // push second vertex
        this.points.push(x1); this.bary.push (0.0);
        this.points.push(y1); this.bary.push (1.0);
        this.points.push(z1); this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++
        
        // push third vertex
        this.points.push(x2); this.bary.push (0.0);
        this.points.push(y2); this.bary.push (0.0);
        this.points.push(z2); this.bary.push (1.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
    }
}

class Cube extends cgIShape {
    
    constructor (subdivisions) {
        super();
        this.makeCube (subdivisions);
    }
    
    makeCube (subdivisions)  {
        
        // fill in your cube code here.
        //left bottom front
        let p1 = [-0.5, -0.5, 0.5];
        //right bottom front
        let p2 = [0.5, -0.5, 0.5];
        //left top front
        let p3 = [-0.5, 0.5, 0.5];
        //right top front
        let p4 = [0.5, 0.5, 0.5];
        //left bottom back
        let p5 = [-0.5, -0.5, -0.5];
        //right bottom back
        let p6 = [0.5, -0.5, -0.5];
        //left top back
        let p7 = [-0.5, 0.5, -0.5];
        //right top back
        let p8 = [0.5, 0.5, -0.5];

        this.tessSquare(subdivisions, p1, p2, p3, p4);
        this.tessSquare(subdivisions, p6, p5, p8, p7);

        this.tessSquare(subdivisions, p2, p6, p4, p8);
        this.tessSquare(subdivisions, p5, p1, p7, p3);

        this.tessSquare(subdivisions, p3, p4, p7, p8);
        this.tessSquare(subdivisions, p5, p6, p1, p2);
    }

    //recursively subdivide and create triangles
    tessSquare(subdivisions, pt1, pt2, pt3, pt4){
        if(subdivisions == 1){
            this.addTriangle(pt1[0], pt1[1], pt1[2], pt2[0], pt2[1], pt2[2], pt3[0], pt3[1], pt3[2]);
            this.addTriangle(pt2[0], pt2[1], pt2[2], pt4[0], pt4[1], pt4[2], pt3[0], pt3[1], pt3[2]);
        }
        else{
            let q12 = calcMidpoint(pt1, pt2);
            let q13 = calcMidpoint(pt1, pt3);
            let q24 = calcMidpoint(pt2, pt4);
            let q34 = calcMidpoint(pt3, pt4);
            let qCenter = calcMidpoint(pt1, pt4);
            this.tessSquare(subdivisions - 1, pt1, q12, q13, qCenter);
            this.tessSquare(subdivisions - 1, q12, pt2, qCenter, q24);
            this.tessSquare(subdivisions - 1, q13, qCenter, pt3, q34);
            this.tessSquare(subdivisions - 1, qCenter, q24, q34, pt4);
        }
    }
}


class Cylinder extends cgIShape {

    constructor (radialdivision,heightdivision) {
        super();
        this.makeCylinder (radialdivision,heightdivision);
    }
    
    makeCylinder (radialdivision,heightdivision){
        // fill in your cylinder code here
        //radial setup
        let r = 0.5;
        let ptCenterTop = [0, 0.5, 0];
        let ptCenterBottom = [0, -0.5, 0];
        let divInc = 360 / radialdivision;
        let triSplit = divInc / 2;
        let alpha = 0;

        let pt2Top = [r*Math.cos(radians(alpha)), 0.5, r*Math.sin(radians(alpha))];
        let pt2Bottom = [r*Math.cos(radians(alpha)), -0.5, r*Math.sin(radians(alpha))];
        while(alpha <= 360){
            //sides setup
            let vertDiff = ptCenterTop[1] - ptCenterBottom[1];
            let vertInc = vertDiff / heightdivision;
            let vertLoc = ptCenterBottom[1];

            //handle radial
            alpha += triSplit;
            let pt1Top = [r*Math.cos(radians(alpha)), 0.5, r*Math.sin(radians(alpha))];
            let pt1Bottom = [r*Math.cos(radians(alpha)), -0.5, r*Math.sin(radians(alpha))];
            this.addTriangle(ptCenterTop[0],ptCenterTop[1],ptCenterTop[2], pt1Top[0], pt1Top[1], pt1Top[2], pt2Top[0], pt2Top[1], pt2Top[2]);
            this.addTriangle(ptCenterBottom[0],ptCenterBottom[1],ptCenterBottom[2], pt2Bottom[0], pt2Bottom[1], pt2Bottom[2], pt1Bottom[0], pt1Bottom[1], pt1Bottom[2]);

            //handle sides
            let pt1 = pt1Bottom;
            let pt2 = pt2Bottom;
            while(vertLoc <= ptCenterTop[1]){
                let pt3 = [pt1[0], vertLoc, pt1[2]];
                let pt4 = [pt2[0], vertLoc, pt2[2]];
                this.addTriangle(pt1[0], pt1[1], pt1[2], pt2[0], pt2[1], pt2[2], pt3[0], pt3[1], pt3[2]);
                this.addTriangle(pt2[0], pt2[1], pt2[2], pt4[0], pt4[1], pt4[2], pt3[0], pt3[1], pt3[2]);
                pt1 = pt3;
                pt2 = pt4;
                vertLoc += vertInc;
            }
            pt2Top = pt1Top;
            pt2Bottom = pt1Bottom;
        }
    }
}

class Cone extends cgIShape {

    constructor (radialdivision, heightdivision) {
        super();
        this.makeCone (radialdivision, heightdivision);
    }
    
    
    makeCone (radialdivision, heightdivision) {
    
        // Fill in your cone code here.
        let ptApex = [0, 0.5, 0];

        //radial setup
        let r = 0.5;
        let ptCenterRad = [0, -0.5, 0];
        let divInc = 360 / radialdivision;
        let triSplit = divInc / 2;
        let alpha = 0;

        let pt2Rad = [r*Math.cos(radians(alpha)), -0.5, r*Math.sin(radians(alpha))];
        while(alpha <= 360){
            //handle radial
            alpha += triSplit;
            let pt1Rad = [r*Math.cos(radians(alpha)), -0.5, r*Math.sin(radians(alpha))];
            this.addTriangle(ptCenterRad[0], ptCenterRad[1], ptCenterRad[2], pt2Rad[0], pt2Rad[1], pt2Rad[2], pt1Rad[0], pt1Rad[1], pt1Rad[2]);

            //handle sides
            let p1 = pt1Rad;
            let p2 = pt2Rad;
            //setup sides
            let distP1 = this.calcDist(p1, ptApex);
            let distP2 = this.calcDist(p2, ptApex);
            let xIncP1 = distP1[0] / heightdivision;
            let yIncP1 = distP1[1] / heightdivision;
            let zIncP1 = distP1[2] / heightdivision;
            let xIncP2 = distP2[0] / heightdivision;
            let yIncP2 = distP2[1] / heightdivision;
            let zIncP2 = distP2[2] / heightdivision;

            let runCnt = 0;
            while(runCnt < heightdivision){
                runCnt++;
                let p3 = [p1[0] + xIncP1, p1[1] + yIncP1, p1[2] + zIncP1];
                let p4 = [p2[0] + xIncP2, p2[1] + yIncP2, p2[2] + zIncP2];
                if(runCnt == heightdivision){
                    this.addTriangle(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], ptApex[0], ptApex[1], ptApex[2]);
                }
                else{
                    this.addTriangle(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
                    this.addTriangle(p2[0], p2[1], p2[2], p4[0], p4[1], p4[2], p3[0], p3[1], p3[2]);
                }
                p1 = p3;
                p2 = p4;
            }
            pt2Rad = pt1Rad;
        }
    }

    //calculates distance between two points for each coordinate individually
    calcDist(p1, p2){
        let xDist = Math.sqrt(Math.pow((p1[0] - p2[0]), 2));
        if(p2[0] < p1[0]){
            xDist = xDist - 2*xDist;
        }
        let yDist = Math.sqrt(Math.pow((p1[1] - p2[1]), 2));
        if(p2[1] < p1[1]){
            yDist = yDist - 2*yDist;
        }
        let zDist = Math.sqrt(Math.pow((p1[2] - p2[2]), 2));
        if(p2[2] < p1[2]){
            zDist = zDist - 2*zDist;
        }
        return [xDist, yDist, zDist];
    }
}
    
class Sphere extends cgIShape {

    constructor (subdivisions) {
        super();
        this.makeSphere (subdivisions);
    }
    
    makeSphere (subdivisions) {
        // fill in your sphere code here
        //make icosahedron
        let a = 2 / (1 + Math.sqrt(5));
        let v0 = this.normalizePoint([0, a, -1]);
        let v1 = this.normalizePoint([0-a, 1, 0]);
        let v2 = this.normalizePoint([a, 1, 0]);
        let v3 = this.normalizePoint([0, a, 1]);
        let v4 = this.normalizePoint([-1, 0, a]);
        let v5 = this.normalizePoint([0, 0-a, 1]);
        let v6 = this.normalizePoint([1, 0, a]);
        let v7 = this.normalizePoint([1, 0, 0-a]);
        let v8 = this.normalizePoint([0, 0-a, -1]);
        let v9 = this.normalizePoint([-1, 0, 0-a]);
        let v10 = this.normalizePoint([0-a, -1, 0]);
        let v11 = this.normalizePoint([a, -1, 0]);

        let tri0 = [v0, v1, v2];
        this.splitTriangle(tri0, subdivisions);
        let tri1 = [v3, v2, v1];
        this.splitTriangle(tri1, subdivisions);
        let tri2 = [v3, v4, v5];
        this.splitTriangle(tri2, subdivisions);
        let tri3 = [v3, v5, v6];
        this.splitTriangle(tri3, subdivisions);
        let tri4 = [v0, v7, v8];
        this.splitTriangle(tri4, subdivisions);
        let tri5 = [v0, v8, v9];
        this.splitTriangle(tri5, subdivisions);
        let tri6 = [v5, v10, v11];
        this.splitTriangle(tri6, subdivisions);
        let tri7 = [v8, v11, v10];
        this.splitTriangle(tri7, subdivisions);
        let tri8 = [v1, v9, v4];
        this.splitTriangle(tri8, subdivisions);
        let tri9 = [v10, v4, v9];
        this.splitTriangle(tri9, subdivisions);
        let tri10 = [v2, v6, v7];
        this.splitTriangle(tri10, subdivisions);
        let tri11 = [v11, v7, v6];
        this.splitTriangle(tri11, subdivisions);
        let tri12 = [v3, v1, v4];
        this.splitTriangle(tri12, subdivisions);
        let tri13 = [v3, v6, v2];
        this.splitTriangle(tri13, subdivisions);
        let tri14 = [v0, v9, v1];
        this.splitTriangle(tri14, subdivisions);
        let tri15 = [v0, v2, v7];
        this.splitTriangle(tri15, subdivisions);
        let tri16 = [v8, v10, v9];
        this.splitTriangle(tri16, subdivisions);
        let tri17 = [v8, v7, v11];
        this.splitTriangle(tri17, subdivisions);
        let tri18 = [v5, v4, v10];
        this.splitTriangle(tri18, subdivisions);
        let tri19 = [v5, v11, v6];
        this.splitTriangle(tri19, subdivisions);
    }

    splitTriangle(tri, divs){
        if(divs < 2){
            this.addTriangle(tri[0][0], tri[0][1], tri[0][2], tri[1][0], tri[1][1], tri[1][2], tri[2][0], tri[2][1], tri[2][2]);
        }
        else{
            let mid1 = this.normalizePoint(calcMidpoint(tri[0], tri[1]));
            let mid2 = this.normalizePoint(calcMidpoint(tri[0], tri[2]));
            let mid3 = this.normalizePoint(calcMidpoint(tri[1], tri[2]));
            this.splitTriangle([mid1, mid3, mid2], divs-1);
            this.splitTriangle([tri[0], mid1, mid2], divs-1);
            this.splitTriangle([mid1, tri[1], mid3], divs-1);
            this.splitTriangle([mid2, mid3, tri[2]], divs-1);
        }
    }

    normalizePoint(pt){
        let norm = Math.sqrt(Math.pow(pt[0], 2) + Math.pow(pt[1], 2) + Math.pow(pt[2], 2));
        return [pt[0]/norm, pt[1]/norm, pt[2]/norm];
    }
}

function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function calcMidpoint(pt1, pt2){
    return [(pt1[0] + pt2[0])/2, (pt1[1] + pt2[1])/2, (pt1[2] + pt2[2])/2];
}

