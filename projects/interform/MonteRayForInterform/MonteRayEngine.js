/*
 * MonteRay Beta 1 Copyright (c) 2022 Tech Labs, Inc.
 * 
 * This renderer has been created as an alternative to the default Three.js
 * WebGL renderer, and will (at some future time) support most if not all
 * Three.js scenes and materials.
 * 
 * https://techlabsinc.github.io/MonteRay/LICENSE
 * 
 * @author TechLabsInc / http://github.com/TechLabsInc
 */

if (!MonteRay) {
	var MonteRay = {};
	// Constants
	MonteRay.DepthRenderMode = 0;
	MonteRay.RandomRenderMode = 1;
	MonteRay.LinearRenderMode = 2;
	MonteRay.CenterRenderMode = 3;



	// Custom classes
	MonteRay.Color = function (r, g, b, a) {

		if (g === undefined && b === undefined) {
			return this.set(r);
		}

		if (a === undefined) {
			return this.setRGB(r, g, b);
		}

		return this.setRGBA(r, g, b, a);
	}
	Object.assign(MonteRay.Color.prototype, {

		isMonteRayColor: true,

		r: 1,
		g: 1,
		b: 1,
		a: 1,

		maxVal: function () {
			return Math.max(this.r, Math.max(this.g, this.b));
		},

		maxValA: function () {
			return Math.max(this.r, Math.max(this.g, Math.max(this.b, this.a)));
		},

		set: function (value) {
			if (value && value.isMonteRayColor) {
				this.copy(value);
			} else if (value && value.isColor) {
				this.fromTHREEColor(value, 1);
			} else if (typeof value === 'number') {
				this.setHex(value);
			} else if (typeof value === 'string') {
				this.fromTHREEColor(new THREE.Color().setStyle(value));
			}
			return this;
		},

		setRGB: function (r, g, b) {
			this.r = r;
			this.g = g;
			this.b = b;
			return this;
		},

		setRGBA: function (r, g, b, a) {
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a;
			return this;
		},

		setHex: function (hex) {
			hex = Math.floor(hex);
			if (hex.toString(16).length > 6) {
				this.r = (hex >> 24 & 255) / 255;
				this.g = (hex >> 16 & 255) / 255;
				this.b = (hex >> 8 & 255) / 255;
				this.a = (hex & 255) / 255;
			} else {
				this.r = (hex >> 16 & 255) / 255;
				this.g = (hex >> 8 & 255) / 255;
				this.b = (hex & 255) / 255;
			}
			return this;
		},

		setScalar: function (scalar) {
			this.r = scalar;
			this.g = scalar;
			this.b = scalar;
			return this;
		},

		setScalarA: function (scalar) {
			this.r = scalar;
			this.g = scalar;
			this.b = scalar;
			this.a = scalar;
			return this;
		},

		setR: function (r) {
			this.r = r;
			return this;
		},

		setG: function (g) {
			this.g = g;
			return this;
		},

		setB: function (b) {
			this.b = b;
			return this;
		},

		setA: function (a) {
			this.a = a;
			return this;
		},

		setComponent: function (index, value) {
			switch (index) {
				case 0:
					this.r = value;
					break;
				case 1:
					this.g = value;
					break;
				case 2:
					this.b = value;
					break;
				case 3:
					this.a = value;
					break;
				default:
					throw new Error('index is out of range: ' + index);
			}
			return this;
		},

		getComponent: function (index) {
			switch (index) {
				case 0:
					return this.r;
				case 1:
					return this.g;
				case 2:
					return this.b;
				case 3:
					return this.a;
				default:
					throw new Error('index is out of range: ' + index);
			}
		},

		clone: function () {
			return new this.constructor(this.r, this.g, this.b, this.a);
		},

		copy: function (c) {
			this.r = c.r;
			this.g = c.g;
			this.b = c.b;
			this.a = c.a;
			return this;
		},

		add: function (c) {
			this.r += c.r;
			this.g += c.g;
			this.b += c.b;
			return this;
		},

		addA: function (c) {
			this.r += c.r;
			this.g += c.g;
			this.b += c.b;
			this.a += c.a;
			return this;
		},

		addScalar: function (s) {
			this.r += s;
			this.g += s;
			this.b += s;
			return this;
		},

		addScalarA: function (s) {
			this.r += s;
			this.g += s;
			this.b += s;
			this.a += s;
			return this;
		},

		addColors: function (a, b) {
			this.r = a.r + b.r;
			this.g = a.g + b.g;
			this.b = a.b + b.b;
			return this;
		},

		addColorsA: function (a, b) {
			this.r = a.r + b.r;
			this.g = a.g + b.g;
			this.b = a.b + b.b;
			this.a = a.a + b.a;
			return this;
		},

		sub: function (c) {
			this.r -= c.r;
			this.g -= c.g;
			this.b -= c.b;
			return this;
		},

		subA: function (c) {
			this.r -= c.r;
			this.g -= c.g;
			this.b -= c.b;
			this.a -= c.a;
			return this;
		},

		subScalar: function (s) {
			this.r -= s;
			this.g -= s;
			this.b -= s;
			return this;
		},

		subScalarA: function (s) {
			this.r -= s;
			this.g -= s;
			this.b -= s;
			this.a -= s;
			return this;
		},

		subColors: function (a, b) {
			this.r = a.r - b.r;
			this.g = a.g - b.g;
			this.b = a.b - b.b;
			return this;
		},

		subColorsA: function (a, b) {
			this.r = a.r - b.r;
			this.g = a.g - b.g;
			this.b = a.b - b.b;
			this.a = a.a - b.a;
			return this;
		},

		multiply: function (c) {
			this.r *= c.r;
			this.g *= c.g;
			this.b *= c.b;
			return this;
		},

		multiplyA: function (c) {
			this.r *= c.r;
			this.g *= c.g;
			this.b *= c.b;
			this.a *= c.a;
			return this;
		},

		multiplyScalar: function (scalar) {
			this.r *= scalar;
			this.g *= scalar;
			this.b *= scalar;
			return this;
		},

		multiplyScalarA: function (scalar) {
			this.r *= scalar;
			this.g *= scalar;
			this.b *= scalar;
			this.a *= scalar;
			return this;
		},

		divideScalar: function (scalar) {
			return this.multiplyScalar(1 / scalar);
		},

		divideScalarA: function (scalar) {
			return this.multiplyScalarA(1 / scalar);
		},

		min: function (c) {
			this.r = Math.min(this.r, c.r);
			this.g = Math.min(this.g, c.g);
			this.b = Math.min(this.b, c.b);
			return this;
		},

		minA: function (c) {
			this.r = Math.min(this.r, c.r);
			this.g = Math.min(this.g, c.g);
			this.b = Math.min(this.b, c.b);
			this.a = Math.min(this.a, c.a);
			return this;
		},

		max: function (c) {
			this.r = Math.max(this.r, c.r);
			this.g = Math.max(this.g, c.g);
			this.b = Math.max(this.b, c.b);
			return this;
		},

		maxA: function (c) {
			this.r = Math.max(this.r, c.r);
			this.g = Math.max(this.g, c.g);
			this.b = Math.max(this.b, c.b);
			this.a = Math.max(this.a, c.a);
			return this;
		},

		clamp: function (min, max) {
			this.r = Math.max(min.r, Math.min(max.r, this.r));
			this.g = Math.max(min.g, Math.min(max.g, this.g));
			this.b = Math.max(min.b, Math.min(max.b, this.b));
			return this;
		},

		clampA: function (min, max) {
			this.r = Math.max(min.r, Math.min(max.r, this.r));
			this.g = Math.max(min.g, Math.min(max.g, this.g));
			this.b = Math.max(min.b, Math.min(max.b, this.b));
			this.a = Math.max(min.a, Math.min(max.a, this.a));
			return this;
		},

		clampScalar: function (minVal, maxVal) {
			this.r = Math.max(minVal, Math.min(maxVal, this.r));
			this.g = Math.max(minVal, Math.min(maxVal, this.g));
			this.b = Math.max(minVal, Math.min(maxVal, this.b));
			return this;
		},

		clampScalarA: function (minVal, maxVal) {
			this.r = Math.max(minVal, Math.min(maxVal, this.r));
			this.g = Math.max(minVal, Math.min(maxVal, this.g));
			this.b = Math.max(minVal, Math.min(maxVal, this.b));
			this.a = Math.max(minVal, Math.min(maxVal, this.a));
			return this;
		},

		clampV: function () {
			this.clampScalarA(0, 1);
		},

		invert: function () {
			this.r = -this.r;
			this.g = -this.g;
			this.b = -this.b;
			return this;
		},

		invertA: function () {
			this.r = -this.r;
			this.g = -this.g;
			this.b = -this.b;
			this.a = -this.a;
			return this;
		},

		lerp: function (c, alpha) {
			this.r += (c.r - this.r) * alpha;
			this.g += (c.g - this.g) * alpha;
			this.b += (c.b - this.b) * alpha;
			return this;
		},

		lerpA: function (c, alpha) {
			this.r += (c.r - this.r) * alpha;
			this.g += (c.g - this.g) * alpha;
			this.b += (c.b - this.b) * alpha;
			this.a += (c.a - this.a) * alpha;
			return this;
		},

		lerpColors: function (v1, v2, alpha) {
			this.r = v1.r + (v2.r - v1.r) * alpha;
			this.g = v1.g + (v2.g - v1.g) * alpha;
			this.b = v1.b + (v2.b - v1.b) * alpha;
			return this;
		},

		lerpColorsA: function (v1, v2, alpha) {
			this.r = v1.r + (v2.r - v1.r) * alpha;
			this.g = v1.g + (v2.g - v1.g) * alpha;
			this.b = v1.b + (v2.b - v1.b) * alpha;
			this.a = v1.a + (v2.a - v1.a) * alpha;
			return this;
		},

		equals: function (c) {
			return ((c.r === this.r) && (c.g === this.g) && (c.b === this.b));
		},

		equalsA: function (c) {
			return ((c.r === this.r) && (c.g === this.g) && (c.b === this.b) && (c.a === this.a));
		},

		fromArray: function (array, offset) {
			if (offset == undefined) {
				offset = 0;
			}
			this.r = array[offset];
			this.g = array[offset + 1];
			this.b = array[offset + 2];
			this.a = array[offset + 3];
			return this;
		},

		toArray: function (array, offset) {
			if (array == undefined) {
				array = [];
			}
			if (offset == undefined) {
				offset = 0;
			}
			array[offset] = this.r;
			array[offset + 1] = this.g;
			array[offset + 2] = this.b;
			array[offset + 3] = this.a;
			return array;
		},

		fromBufferAttribute: function (attribute, index) {
			this.r = attribute.getX(index);
			this.g = attribute.getY(index);
			this.b = attribute.getZ(index);
			this.a = attribute.getW(index);
			return this;
		},

		fromTHREEColor: function (c, a) {
			try {
				if (a == undefined) {
					a = 1;
				}
				this.setRGB(c.r, c.g, c.b, a);
			} catch (e) {
				this.setRGB(0, 0, 0, 1);
			}
			return this;
		},

		random: function () {
			this.r = Math.random();
			this.g = Math.random();
			this.b = Math.random();
			return this;
		},

		randomA: function () {
			this.r = Math.random();
			this.g = Math.random();
			this.b = Math.random();
			this.a = Math.random();
			return this;
		},

		gammaCorrect: function () {
			this.r = Math.pow(this.r, 1 / 2.2);
			this.g = Math.pow(this.g, 1 / 2.2);
			this.b = Math.pow(this.b, 1 / 2.2);
			return this;
		},

		reverseGamma: function () {
			this.r = Math.pow(this.r, 2.2);
			this.g = Math.pow(this.g, 2.2);
			this.b = Math.pow(this.b, 2.2);
			return this;
		}
	});

	MonteRay.Color.imageDataToHex = function (r, g, b, a) {
		return (r) << 24 ^ (g) << 16 ^ (b) << 8 ^ (a) << 0;
	}
}



var MonteRayEngine = MonteRayEngine || {};

MonteRayEngine.VERSION = "Beta 1";

MonteRayEngine.nullcolor = new MonteRay.Color(0x000000);
MonteRayEngine.defaultSpecularColor = new MonteRay.Color().setScalar(0.002585825596234168);
MonteRayEngine.TAU = Math.PI * 2;
MonteRayEngine.EPSILON = 0.000000000001;

MonteRayEngine.eye = new THREE.Raycaster();
MonteRayEngine.eye.firstHitOnly = true;

MonteRayEngine.randomOffset = new THREE.Vector2();
MonteRayEngine.pixSize = new THREE.Vector2();

MonteRayEngine.textureCache = [];

MonteRayEngine.clearTextureCache = function () {
	MonteRayEngine.textureCache = [];
}

MonteRayEngine.parameters = {};

MonteRayEngine.lights = [];



MonteRayEngine.computePixelNormal = (function () {
	var vA = new THREE.Vector3();
	var vB = new THREE.Vector3();
	var vC = new THREE.Vector3();
	var tmpVec1 = new THREE.Vector3();
	var tmpVec2 = new THREE.Vector3();
	var tmpVec3 = new THREE.Vector3();
	return function computePixelNormal(outputVector, point, flatShading, face, geometry) {
		try {
			var faceNormal = face.normal;
			if (flatShading === true) {
				outputVector.copy(faceNormal);
			} else {
				try {
					var positions = geometry.attributes.position;
					var normals = geometry.attributes.normal;
				} catch (e) {
					var positions = geometry._bufferGeometry.attributes.position;
					var normals = geometry._bufferGeometry.attributes.normal;
				}
				vA.fromBufferAttribute(positions, face.a);
				vB.fromBufferAttribute(positions, face.b);
				vC.fromBufferAttribute(positions, face.c);
				// compute barycentric coordinates
				tmpVec3.crossVectors(tmpVec1.subVectors(vB, vA), tmpVec2.subVectors(vC, vA));
				var areaABC = faceNormal.dot(tmpVec3);
				tmpVec3.crossVectors(tmpVec1.subVectors(vB, point), tmpVec2.subVectors(vC, point));
				var areaPBC = faceNormal.dot(tmpVec3);
				var a = areaPBC / areaABC;
				tmpVec3.crossVectors(tmpVec1.subVectors(vC, point), tmpVec2.subVectors(vA, point));
				var areaPCA = faceNormal.dot(tmpVec3);
				var b = areaPCA / areaABC;
				var c = 1.0 - a - b;
				// compute interpolated vertex normal
				tmpVec1.fromBufferAttribute(normals, face.a);
				tmpVec2.fromBufferAttribute(normals, face.b);
				tmpVec3.fromBufferAttribute(normals, face.c);
				tmpVec1.multiplyScalar(a);
				tmpVec2.multiplyScalar(b);
				tmpVec3.multiplyScalar(c);
				outputVector.addVectors(tmpVec1, tmpVec2);
				outputVector.add(tmpVec3);
			}
		} catch (e) {
			computePixelNormal(outputVector, point, flatShading, face, new THREE.BufferGeometry().fromGeometry(geometry));
		}
	};
}());






MonteRayEngine.calcNormal = function (intersect) {
	var norm = new THREE.Vector3();
	var localPoint = new THREE.Vector3();
	localPoint.copy(intersect.point).applyMatrix4(new THREE.Matrix4().copy(intersect.object.matrixWorld).invert());
	MonteRayEngine.computePixelNormal(norm, localPoint, intersect.object.material.flatShading, intersect.face, intersect.object.geometry);
	norm.applyMatrix3(new THREE.Matrix3().getNormalMatrix(intersect.object.matrixWorld)).normalize();


	//return intersect.face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(intersect.object.matrixWorld)).normalize();

	if (MonteRayEngine.eye.ray.direction.clone().negate().dot(norm) < 0) {
		norm.negate();
	}

	return norm;
};






MonteRayEngine.randDir = function (cosineWeighted, fullSphere) {
	var rd = new THREE.Vector3((Math.random() * 2) - 1, (Math.random() * 2) - 1, 0);
	if (cosineWeighted) {
		while (rd.distanceTo(new THREE.Vector3(0, 0, 0)) >= 1) {
			rd.set((Math.random() * 2) - 1, (Math.random() * 2) - 1, 0);
		}
		rd.z = Math.sqrt(Math.max(0, 1 - rd.x * rd.x - rd.y * rd.y));
	} else {
		if (fullSphere) {
			rd.z = (Math.random() * 2) - 1;
			rd.applyAxisAngle(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5), Math.random() * MonteRayEngine.TAU);
		} else {
			rd.z = Math.random();
			rd.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.random() * MonteRayEngine.TAU);
		}
	}
	rd.normalize();
	return rd;
};





MonteRayEngine.getSchlickReflectance = function (normal, direction, ior) {
	var R = Math.pow((1 - 1.5) / (1 + 1.5), 2);
	return R + (1 - R) * Math.pow(1 - Math.cos(normal.angleTo(direction)), 5);
};




MonteRayEngine.getBackground = function (scene, eye) {
	if (scene.background) {
		if (scene.background.isColor) {
			return new MonteRay.Color().fromTHREEColor(scene.background).reverseGamma();
		} else {
			var theta = Math.atan2(eye.ray.direction.x, -eye.ray.direction.z);
			var phi = Math.acos(Math.min(Math.max(eye.ray.direction.y, -1), 1));
			return MonteRayEngine.getTexel(scene.background, new THREE.Vector2((theta + Math.PI) / MonteRayEngine.TAU, 1 - phi / Math.PI)).reverseGamma();
		}
	} else {
		return MonteRayEngine.nullcolor;
	}
};



MonteRayEngine.validateImage = function (texture) {
	if (texture.image) {
		return true;
	} else {
		return false;
	}
};




//     /!\ ALL CLIENTS MUST OVERRIDE THIS FUNCTION IN ORDER TO KEEP IT DOM-LESS /!\
MonteRayEngine.requestTexture = undefined;






MonteRayEngine.getTexel = function (texture, uv) {
	var texCoords = new THREE.Vector2();
	var ruv = new THREE.Vector2();
	/*var repeat = new THREE.Vector2(1, 1);

	if (texture.repeat) {
		repeat = texture.repeat;
	}*/

	ruv.copy(uv);
	texture.updateMatrix();
	texture.transformUv(ruv);

	/*try {
		ruv.x = ((uv.x % (1 / repeat.x)) * repeat.x);
		ruv.y = (1 - (uv.y % (1 / repeat.y)) * repeat.y);
	} catch (e) {}*/

	if (MonteRayEngine.validateImage(texture)) {

		if (!MonteRayEngine.textureCache[texture.uuid] && !(texture instanceof THREE.DataTexture && texture.image.data.length > 1)) {
			var tex = MonteRayEngine.requestTexture(texture);
			if (tex != "KILL") {
				MonteRayEngine.textureCache[texture.uuid] = tex;
			} else {
				return "KILL";
			}
		}

		texCoords.x = Math.min(Math.max(Math.floor(ruv.x * texture.image.width), 0), texture.image.width - 1);
		texCoords.y = Math.min(Math.max(Math.floor(ruv.y * texture.image.height), 0), texture.image.height - 1);

	}

	try {
		if (texture instanceof THREE.DataTexture) {
			switch (texture.type) {
				case THREE.FloatType:
					var tc = (texCoords.y * (texture.image.width * 3)) + (texCoords.x * 3);
					var data = [Math.pow(texture.image.data[tc], 1 / 2.2), Math.pow(texture.image.data[tc + 1], 1 / 2.2), Math.pow(texture.image.data[tc + 2], 1 / 2.2), 1];
					break;
				case THREE.UnsignedByteType:
					var tc = (texCoords.y * (texture.image.width * 4)) + (texCoords.x * 4);
					var data = [Math.pow((texture.image.data[tc] * Math.pow(2, texture.image.data[tc + 3] - 128)) / 255, 1 / 2.2), Math.pow((texture.image.data[tc + 1] * Math.pow(2, texture.image.data[tc + 3] - 128)) / 255, 1 / 2.2), Math.pow((texture.image.data[tc + 2] * Math.pow(2, texture.image.data[tc + 3] - 128)) / 255, 1 / 2.2), 1];
					break;
				case THREE.IntType:
					var tc = (texCoords.y * (texture.image.width * 4)) + (texCoords.x * 4);
					var data = [texture.image.data[tc] / 255, texture.image.data[tc + 1] / 255, texture.image.data[tc + 2] / 255, texture.image.data[tc + 3] / 255];
					break;
			}

		} else if (MonteRayEngine.textureCache[texture.uuid]) {
			if (MonteRayEngine.textureCache[texture.uuid][texCoords.y]) {
				if (MonteRayEngine.textureCache[texture.uuid][texCoords.y][texCoords.x]) {
					var data = MonteRayEngine.textureCache[texture.uuid][texCoords.y][texCoords.x];
				} else {
					console.warn("INVALID X/U TEXTURE COORDINATE: " + texCoords.x);
				}
			} else {
				console.warn("INVALID: Y/V TEXTURE COORDINATE: " + texCoords.y);
			}
		} else {
			console.warn("ID NOT FOUND IN TEXTURE CACHE: " + texture.uuid);
		}
	} catch (e) {
		console.warn(e);
	}

	if (data) {
		return new MonteRay.Color(data[0], data[1], data[2], data[3]);
	} else {
		return new MonteRay.Color(1 - ruv.x, Math.pow(ruv.distanceTo(new THREE.Vector2(0, 0)), 2) / Math.sqrt(2), 1 - ruv.y);
	}
}





MonteRayEngine.getPixelMaterial = (function () {

	var dclr = new MonteRay.Color();
	var spcclr = new MonteRay.Color();
	var emmclr = new MonteRay.Color();

	return function (intersect, scene) {
		var pixmat = {};
		if (intersect) {
			emmclr.fromTHREEColor(intersect.object.material.emissive);
			if (!MonteRayEngine.nullcolor.equals(emmclr) || intersect.object.material.isMeshBasicMaterial) {
				pixmat.type = "GLOW";
			} else if (intersect.object.material.mirror || intersect.object.material.metalness == 1) {
				pixmat.type = "SPEC";
			} else if (intersect.object.material.glass) {
				pixmat.type = "REFR";
			} else if (intersect.object.material.isMeshNormalMaterial) {
				pixmat.type = "NORM";
			} else {
				pixmat.type = "DIFF";
				//pixmat.type = "ALBD"; //for ALB rendering
				//pixmat.type = "NORM"; //for normal rendering
				//pixmat.type = "DPTH"; //for depth rendering
			}
			//pixmat.type = "DPTH";
			//pixmat.type = "NORM";
			pixmat.color = dclr.fromTHREEColor(intersect.object.material.color).clone().reverseGamma();
			if (intersect.object.material.map) {
				var tex = MonteRayEngine.getTexel(intersect.object.material.map, intersect.uv);
				if (tex == "KILL") {
					return "KILL";
				}
				pixmat.color.multiply(tex.reverseGamma());
			}
			pixmat.specular = spcclr.fromTHREEColor(intersect.object.material.specular).reverseGamma();
			if (pixmat.specular.equals(MonteRayEngine.defaultSpecularColor)) {
				pixmat.specular.setScalar(0);
			}
			if (intersect.object.material.specularMap) {
				var tex = MonteRayEngine.getTexel(intersect.object.material.specularMap, intersect.uv);
				if (tex == "KILL") {
					return "KILL";
				}
				pixmat.specular.multiply(tex.reverseGamma());
			}
			pixmat.emissive = emmclr.reverseGamma();
			if (intersect.object.material.emissiveIntensity) {
				pixmat.emissiveIntensity = intersect.object.material.emissiveIntensity;
			} else {
				pixmat.emissiveIntensity = 0;
			}
			if (intersect.object.material.refractionRatio) {
				pixmat.refractionRatio = intersect.object.material.refractionRatio;
			} else {
				pixmat.refractionRatio = 0;
			}
			pixmat.point = intersect.point;
			pixmat.depth = intersect.distance;
			pixmat.normal = MonteRayEngine.calcNormal(intersect).normalize();
			if (intersect.object.material.normalMap) {
				var clr = MonteRayEngine.getTexel(intersect.object.material.normalMap, intersect.uv);
				if (clr == "KILL") {
					return "KILL";
				}
				pixmat.normal.x += (clr.r - 0.5) * 2;
				pixmat.normal.y += (clr.g - 0.5) * 2;
				pixmat.normal.normalize();
			}
			return pixmat;
		} else {
			return {
				type: "DIFF",
				color: MonteRayEngine.getBackground(scene, MonteRayEngine.eye),
				point: new THREE.Vector3(),
				normal: new THREE.Vector3()
			};
		}
	}
})();






MonteRayEngine.reflect = function (intersect, eye) {
	eye.ray.origin.copy(intersect.point).addScaledVector(intersect.normal, MonteRayEngine.EPSILON);
	eye.ray.direction.reflect(intersect.normal);
};




MonteRayEngine.refract = function (intersect, eye, rayIn) {
	if (rayIn == false) {
		eye.ray.origin.copy(intersect.point.clone().addScaledVector(intersect.normal, -MonteRayEngine.EPSILON));
		eye.ray.direction.lerp(intersect.normal.negate(), intersect.refractionRatio);
	} else {
		eye.ray.origin.copy(intersect.point.clone().addScaledVector(intersect.normal, MonteRayEngine.EPSILON));
		eye.ray.direction.lerp(intersect.normal, intersect.refractionRatio);
	}
};





MonteRayEngine.updateScene = function (scene, camera) {
	scene.updateMatrixWorld();
	camera.updateMatrixWorld();
	camera.updateProjectionMatrix();
};




MonteRayEngine.processScene = function (scene) {
	//register emissive objects for explicit lighting
	scene.traverseVisible(function (obj) {
		try {
			if (!MonteRayEngine.parameters.BVHAcceleration || MonteRayEngine.parameters.BVHAcceleration && MonteRayEngine.parameters.BVHAcceleration != false) {
				if (obj.geometry) {
					if (!obj.geometry.boundsTree) {
						obj.geometry.computeBoundsTree();
					}
				}
			}
			if (!MonteRayEngine.nullcolor.equals(new MonteRay.Color().fromTHREEColor(obj.material.emissive))) {
				MonteRayEngine.lights.push([obj, new MeshSurfaceSampler(obj).build()]);
			}
		} catch (e) {}
	});
};



MonteRayEngine.adjustBatchSize = function (p) {
	if (p.tts - p.ts > (1000 / MonteRayEngine.parameters.fps)) {
		if (p.uod == true) {
			p.len = 0;
			p.uod = false;
		}
		p.len -= 1;
	} else if (p.tts - p.ts < (1000 / MonteRayEngine.parameters.fps)) {
		if (p.uod == false) {
			p.len = 0;
			p.uod = true;
		}
		p.len += 1;
	}
	p.lngth += p.len;
	if (p.lngth < 1) {
		p.lngth = 1;
	}
};





var numDiffuse = 0;

var hemisphere = new THREE.Object3D();

MonteRayEngine.tracePath = function (pixelcast, depth, scene) {
	rayIn = false;
	var intersect = MonteRayEngine.eye.intersectObject(scene, true)[0];

	if (intersect == undefined) {
		return MonteRayEngine.getBackground(scene, MonteRayEngine.eye);
	}

	var mat = MonteRayEngine.getPixelMaterial(intersect, scene);
	if (mat == "KILL") {
		return "KILL";
	}

	if (depth > 2 && (depth > 6 || Math.random() > mat.color.maxVal())) {
		return MonteRayEngine.nullcolor.clone();
	}

	if (depth == 0) {
		numDiffuse = 0;
	}

	// Recurse
	switch (mat.type) {
		case "ALBD":
			return mat.color;
		case "NORM":
			mat.normal.applyQuaternion(camera.quaternion.invert());
			camera.quaternion.invert();
			return new MonteRay.Color((mat.normal.x * 0.5) + 0.5, (mat.normal.y * 0.5) + 0.5, (mat.normal.z * 0.5) + 0.5).reverseGamma();
			break;
		case "DPTH":
			return new MonteRay.Color().setScalar((100 - mat.depth) / 100).reverseGamma();
			break;
		case "GLOW":
			if (numDiffuse == 0) {
				var intense = 1;
				if (mat.emissiveIntensity) {
					intense = mat.emissiveIntensity;
				}
				return mat.emissive.clone().multiplyScalar(intense * 2);
			} else {
				return MonteRayEngine.nullcolor;
			}
			break;
		case "SPEC": // Mirror
			MonteRayEngine.reflect(mat, MonteRayEngine.eye);
			var res = MonteRayEngine.tracePath([pixelcast[0], intersect, pixelcast[2], pixelcast[3], pixelcast[4]], depth + 1, scene);
			if (res == "KILL") {
				return "KILL";
			}
			return res.multiply(mat.color);
			break;
		case "REFR": // Refractive
			MonteRayEngine.refract(mat, MonteRayEngine.eye, rayIn);
			if (rayIn == true) {
				rayIn = false;
				var res = MonteRayEngine.tracePath([pixelcast[0], intersect, pixelcast[2], pixelcast[3], pixelcast[4]], depth + 1, scene);
				if (res == "KILL") {
					return "KILL";
				}
				return res.multiply(mat.color);
			} else {
				rayIn = true;
				var res = MonteRayEngine.tracePath([pixelcast[0], intersect, pixelcast[2], pixelcast[3], pixelcast[4]], depth + 1, scene);
				if (res == "KILL") {
					return "KILL";
				}
				return res;
			}
			break;
		default: // Diffuse OR Clearcoat

			if (!mat.specular.equals(MonteRayEngine.nullcolor)) {
				MonteRayEngine.reflect(mat, MonteRayEngine.eye);
				var schlick = MonteRayEngine.getSchlickReflectance(mat.normal, MonteRayEngine.eye.ray.direction, mat.refractionRatio);

				/*var Tr = 1.0 - schlick;
				var P = 0.25 + (0.5 * schlick);
				var RP = schlick / P;
				var TP = Tr / (1.0 - P);*/

				//if (Math.random() < P) {
				var reflection = MonteRayEngine.tracePath([pixelcast[0], intersect, pixelcast[2], pixelcast[3], pixelcast[4]], depth + 1, scene); //.multiplyScalar(RP);
				if (reflection == "KILL") {
					return "KILL";
				}
				reflection = reflection.multiply(mat.specular);
				/*return reflection;
				}*/
			}





			var directLight = MonteRayEngine.nullcolor.clone();
			var q = 0;
			var qlength = 1;
			if (MonteRayEngine.parameters.lightSamples) {
				qlength = MonteRayEngine.parameters.lightSamples;
			}
			while (q < qlength) {
				var samplePos = new THREE.Vector3();
				var sampleLight = MonteRayEngine.lights[Math.floor(Math.random() * MonteRayEngine.lights.length)];
				if (sampleLight) {
					sampleLight[1].sample(samplePos, new THREE.Vector3());
					samplePos.copy(sampleLight[0].localToWorld(samplePos));

					MonteRayEngine.eye.ray.origin = mat.point.clone().addScaledVector(mat.normal, MonteRayEngine.EPSILON);
					MonteRayEngine.eye.ray.lookAt(samplePos);

				} else {

					// TODO: Multiple Importance Sampling on environment

					hemisphere.lookAt(mat.normal);

					//hemisphere.rotateZ(Math.random() * TAU);
					var randnorma = MonteRayEngine.randDir(true).applyQuaternion(hemisphere.quaternion);
					MonteRayEngine.eye.set(mat.point.clone().addScaledVector(mat.normal, MonteRayEngine.EPSILON), randnorma);

					/*MonteRayEngine.eye.ray.direction.set(0, 1, 0);
					MonteRayEngine.eye.ray.direction.normalize();*/
				}

				if (mat.normal.dot(MonteRayEngine.eye.ray.direction) > 0) {

					var hitLight = MonteRayEngine.eye.intersectObjects(scene.children, true)[0];


					if (sampleLight && hitLight) {
						if (hitLight.object.uuid == sampleLight[0].uuid) {
							var mat2 = MonteRayEngine.getPixelMaterial(hitLight, scene);
							var cos_theta = Math.max(mat2.normal.negate().dot(MonteRayEngine.eye.ray.direction) * mat.normal.dot(MonteRayEngine.eye.ray.direction), 0);
							//var cos_theta = 1;
							var intense = 1;
							if (mat2.emissiveIntensity) {
								intense = mat2.emissiveIntensity;
							}
							directLight.add(mat2.emissive.clone().multiplyScalar((1 / (Math.pow(hitLight.distance, 2) / intense))).multiplyScalar(cos_theta * MonteRayEngine.lights.length));
						}
					} else if (!sampleLight && !hitLight) {
						var col = MonteRayEngine.getBackground(scene, MonteRayEngine.eye);
						var cos_theta1 = Math.max(mat.normal.dot(MonteRayEngine.eye.ray.direction), 0);
						/*if (numDiffuse == 0) {
							cos_theta1 = 0;
						}*/
						directLight.add(col.multiplyScalar(cos_theta1));
					}
				}
				break;
			}
			q++;
			if (MonteRayEngine.parameters.lightSamples) {
				directLight.divideScalar(q + 1);
			}


			hemisphere.lookAt(mat.normal);

			//hemisphere.rotateZ(Math.random() * TAU);
			var randnorma = MonteRayEngine.randDir(true).applyQuaternion(hemisphere.quaternion);
			MonteRayEngine.eye.set(mat.point.clone().addScaledVector(mat.normal, MonteRayEngine.EPSILON), randnorma);

			var cos_theta = Math.max(mat.normal.dot(MonteRayEngine.eye.ray.direction), 0);
			/*if (numDiffuse == 0) {
				cos_theta = 0.5;
			}*/

			numDiffuse++;
			var reflectedLight = MonteRayEngine.tracePath([pixelcast[0], intersect, pixelcast[2], pixelcast[3], pixelcast[4]], depth + 1, scene);
			if (reflectedLight == "KILL") {
				return "KILL";
			}

			var diffres = mat.color.clone().multiply(directLight.add(reflectedLight)).multiplyScalar(cos_theta);

			if (!mat.specular.equals(MonteRayEngine.nullcolor) && reflection) {
				return diffres.lerp(reflection, schlick);
			} else {
				return diffres;
			}
	}
};






MonteRayEngine.renderBatch = function (pixels, scene, camera) {
	var newpixels = pixels;
	mainloop:
		for (var p = 0; p < newpixels.length; p++) {
			for (var g = 0; g < 1; g++) {
				var cf = pixels[p][2] - 1;
				if (cf < 1) {
					cf = 1;
				}

				/*var trand = new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5);
				while (trand.distanceTo(new THREE.Vector2(0, 0)) > 0.5) {
					trand.set(Math.random() - 0.5, Math.random() - 0.5); //***
				}
				MonteRayEngine.eye.setFromCamera(new THREE.Vector2(pixels[p][0].x + (trand.x * MonteRayEngine.pixSize.x * 50), pixels[p][0].y + (trand.y * MonteRayEngine.pixSize.y * 50)), camera);*/

				//MonteRayEngine.eye.ray.lookAt(camera.localToWorld(new THREE.Vector3(0, 0, -0.5)));




				//MonteRayEngine.eye.setFromCamera(new THREE.Vector2(pixels[p][0].x + MonteRayEngine.randomOffset.x, pixels[p][0].y + MonteRayEngine.randomOffset.y), camera);




				MonteRayEngine.eye.setFromCamera(new THREE.Vector2(pixels[p][0].x + ((Math.random() - 0.5) * MonteRayEngine.pixSize.x * 2), pixels[p][0].y + ((Math.random() - 0.5) * MonteRayEngine.pixSize.y * 2)), camera); //***

				//MonteRayEngine.eye.setFromCamera(new THREE.Vector2(pixels[p][0].x + ((0.5) * MonteRayEngine.pixSize.x * 2), pixels[p][0].y + ((0.5) * MonteRayEngine.pixSize.y * 2)), camera);

				var res = MonteRayEngine.tracePath(pixels[p], 0, scene);

				//var res = MonteRayEngine.getBackground(scene, MonteRayEngine.eye);

				if (res == "KILL") {
					newpixels = {
						pixels: newpixels,
						KILLED: true
					};
					break mainloop;
				}

				//res.clampV();

				pixels[p][3].multiplyScalar(cf - 1);
				pixels[p][3].add(res);
				pixels[p][3].divideScalar(cf);
				//pixels[p][3].clampV();
				pixels[p][2]++;

				/*if (pixels[p][3].equals(res)) {
					break;
				}

				if (pixels[p][2] - 1 == 1) {
					break;
				}*/
			}
		}
	return newpixels;
};