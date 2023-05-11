/* Intersection structure:
 * t:        ray parameter (float), i.e. distance of intersection point to ray's origin
 * position: position (THREE.Vector3) of intersection point
 * normal:   normal (THREE.Vector3) of intersection point
 * material: material of the intersection object
 */
class Intersection {
	constructor() {
		this.t = 0;
		this.position = new THREE.Vector3();
		this.normal = new THREE.Vector3();
		this.material = null;
	}
	set(isect) {
		this.t = isect.t;
		this.position = isect.position;
		this.normal = isect.normal;
		this.material = isect.material;
	}
}

/* Plane shape
 * P0: a point (THREE.Vector3) that the plane passes through
 * n:  plane's normal (THREE.Vector3)
 */
class Plane {
	constructor(P0, n, material) {
		this.P0 = P0.clone();
		this.n = n.clone();
		this.n.normalize();
		this.material = material;
	}
	// Given ray and range [tmin,tmax], return intersection point.
	// Return null if no intersection.
	intersect(ray, tmin, tmax) {
		let temp = this.P0.clone();
		temp.sub(ray.o); // (P0-O)
		let denom = ray.d.dot(this.n); // d.n
		if(denom==0) { return null;	}
		let t = temp.dot(this.n)/denom; // (P0-O).n / d.n
		if(t<tmin || t>tmax) return null; // check range
		let isect = new Intersection();   // create intersection structure
		isect.t = t;
		isect.position = ray.pointAt(t);
		isect.normal = this.n;
		isect.material = this.material;
		return isect;
	}
}

/* Sphere shape
 * C: center of sphere (type THREE.Vector3)
 * r: radius
 */
class Sphere {
	constructor(C, r, material) {
		this.C = C.clone();
		this.r = r;
		this.r2 = r*r;
		this.material = material;
	}
	intersect(ray, tmin, tmax) {
// ===YOUR CODE STARTS HERE===
	let cClone = this.C.clone();
	let d = ray.d.clone();
	let O = ray.o.clone();
	let A = 1;
	let OminusC = O.sub(cClone);
	let B = OminusC.clone().multiplyScalar(2).dot(d);
	let C = Math.pow(OminusC.clone().length(),2) - this.r2;
	let delta = Math.pow(B,2)- (4*A*C);
	if (delta <0){return null;}
	else{
		let t1 = ((-1*B) + Math.sqrt(delta))/(2);
		let t2 = ((-1*B) - Math.sqrt(delta))/(2);
		let tVal;
		if (t1 >= tmin && t1 <= tmax && t2 >= tmin && t2 <= tmax) {
			tVal = Math.min(t1, t2);
		  } else if (t1 >= tmin && t1 <= tmax) {
			tVal = t1;
		  } else if (t2 >= tmin && t2 <= tmax) {
			tVal = t2;
		  } else {
			return null;
		  }
		  let isect = new Intersection();
		  isect.t = tVal;
		  isect.position = ray.pointAt(tVal);
		  isect.normal = isect.position.clone().sub(cClone).normalize();
		  isect.material = this.material;
		  return isect;
	}
// ---YOUR CODE ENDS HERE---
		return null;
	}
}

class Triangle {
	/* P0, P1, P2: three vertices (type THREE.Vector3) that define the triangle
	 * n0, n1, n2: normal (type THREE.Vector3) of each vertex */
	constructor(P0, P1, P2, material, n0, n1, n2) {
		this.P0 = P0.clone();
		this.P1 = P1.clone();
		this.P2 = P2.clone();
		this.material = material;
		if(n0) this.n0 = n0.clone();
		if(n1) this.n1 = n1.clone();
		if(n2) this.n2 = n2.clone();

		// below you may pre-compute any variables that are needed for intersect function
		// such as the triangle normal etc.
// ===YOUR CODE STARTS HERE===


// ---YOUR CODE ENDS HERE---
	} 

	intersect(ray, tmin, tmax) {
// ===YOUR CODE STARTS HERE===
		let tNorm = this.P2.clone().sub(this.P0).cross(this.P2.clone().sub(this.P1)).normalize();
		let d = ray.d.clone();
		let o = ray.o.clone();
		let matrixOne = new THREE.Matrix3();
		matrixOne.set(d.x, this.P2.x-this.P0.x, this.P2.x-this.P1.x, 
					  d.y, this.P2.y-this.P0.y, this.P2.y-this.P1.y,
					  d.z, this.P2.z-this.P0.z, this.P2.z-this.P1.z);
		let matrixTwo = new THREE.Matrix3();
		matrixTwo.set(this.P2.x-o.x, this.P2.x-this.P0.x, this.P2.x-this.P1.x, 
					  this.P2.y-o.y, this.P2.y-this.P0.y, this.P2.y-this.P1.y,
					  this.P2.z-o.z, this.P2.z-this.P0.z, this.P2.z-this.P1.z);
		let matrixThree = new THREE.Matrix3();
		matrixThree.set(d.x, this.P2.x-this.P0.x, this.P2.x-o.x, 
						d.y, this.P2.y-this.P0.y, this.P2.y-o.y,
						d.z, this.P2.z-this.P0.z, this.P2.z-o.z);
		let matrixFour = new THREE.Matrix3();
		matrixFour.set(d.x, this.P2.x-o.x, this.P2.x-this.P1.x, 
					  d.y, this.P2.y-o.y, this.P2.y-this.P1.y,
					  d.z, this.P2.z-o.z, this.P2.z-this.P1.z);
		if (matrixOne.clone().determinant() == 0){
			return null;
		}
		else{
			let t = matrixTwo.clone().determinant()/matrixOne.clone().determinant();
			let alpha = matrixFour.clone().determinant()/matrixOne.clone().determinant();
			let beta = matrixThree.clone().determinant()/matrixOne.clone().determinant();
			if (t<tmin || t>tmax){
				return null;
			}
			if (alpha >=0 && beta >= 0 && t >= 0 && alpha + beta <=1){
				if (this.n0 != null && this.n1 != null && this.n2 != null){
					tNorm = this.n0.clone().multiplyScalar(alpha).add(this.n1.clone().multiplyScalar(beta)).add(this.n2.clone().multiplyScalar(1-alpha-beta)).normalize();
				}
				let isect = new Intersection();
				isect.t = t;
				isect.material = this.material;
				isect.normal = tNorm;
				isect.position = ray.pointAt(t);
				return isect;
			}
		}


// ---YOUR CODE ENDS HERE---
		return null;
	}
}

function shapeLoadOBJ(objstring, material, smoothnormal) {
	loadOBJFromString(objstring, function(mesh) { // callback function for non-blocking load
		if(smoothnormal) mesh.computeVertexNormals();
		for(let i=0;i<mesh.faces.length;i++) {
			let p0 = mesh.vertices[mesh.faces[i].a];
			let p1 = mesh.vertices[mesh.faces[i].b];
			let p2 = mesh.vertices[mesh.faces[i].c];
			if(smoothnormal) {
				let n0 = mesh.faces[i].vertexNormals[0];
				let n1 = mesh.faces[i].vertexNormals[1];
				let n2 = mesh.faces[i].vertexNormals[2];
				shapes.push(new Triangle(p0, p1, p2, material, n0, n1, n2));
			} else {
				shapes.push(new Triangle(p0, p1, p2, material));
			}
		}
	}, function() {}, function() {});
}

/* ========================================
 * You can define additional Shape classes,
 * as long as each implements intersect function.
 * ======================================== */
