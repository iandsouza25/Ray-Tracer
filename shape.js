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

	function p(t){

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
		let t1 = ((-1*B) + Math.sqrt(delta))/(2*A);
		let t2 = ((-1*B) - Math.sqrt(delta))/(2*A);
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
		  isect.position = O.clone().add(d.clone().multiplyScalar(tVal));
		  isect.normal = isect.position.clone().sub(cClone);
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
