/*
 * MonteRay Alpha 3 Copyright (c) 2022 Tech Labs, Inc.
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




MonteRay.PathtracingRenderer = function (parameters) {

	parameters = parameters || {};

	MonteRayEngine.parameters = parameters;

	var self = this;

	console.log("Rendering provided by MonteRay " + MonteRayEngine.VERSION + " https://techlabsinc.github.io/MonteRay/LICENSE");

	var canvas;
	if (parameters.canvas) {
		canvas = parameters.canvas;
	} else {
		canvas = document.createElement('canvas');
	}
	var context = canvas.getContext('2d', {
		alpha: parameters.alpha === true
	});

	var canvasWidth, canvasHeight;
	var canvasHalfWidth, canvasHalfHeight;
	var pixelRatio;

	var clearColor = new MonteRay.Color(0x000000);

	this.domElement = canvas;

	this.autoClear = true;

	this.setClearColor = function (color, alpha) {
		clearColor.setScalar(color);
		clearColor.setA(alpha);

	};

	this.getClearColor = function () {
		return clearColor.toColor();
	};

	this.setPixelRatio = function (res) {
		pixelRatio = res;
		this.setSize(canvasWidth / pixelRatio, canvasHeight / pixelRatio);
	};

	this.setSize = function (width, height) {
		canvasWidth = Math.round(width * pixelRatio);
		canvasHeight = Math.round(height * pixelRatio);
		canvasHalfWidth = canvasWidth / 2;
		canvasHalfHeight = canvasHeight / 2;
		canvas.style.width = width + "px";
		canvas.style.height = height + "px";

	};

	this.setSize(canvas.width, canvas.height);
	this.setPixelRatio(1);

	this.clear = function () {

	};


	try {
		if (MeshBVHLib) {
			if (!parameters.BVHAcceleration || parameters.BVHAcceleration && parameters.BVHAcceleration != false) {
				THREE.BufferGeometry.prototype.computeBoundsTree = MeshBVHLib.computeBoundsTree;
				THREE.BufferGeometry.prototype.disposeBoundsTree = MeshBVHLib.disposeBoundsTree;
				THREE.Mesh.prototype.raycast = MeshBVHLib.acceleratedRaycast;
			}
		} else {
			console.warn("MonteRay.PathtracingRenderer: BVH acceleration not supported.");
			parameters.BVHAcceleration = false;
		}
	} catch (e) {
		console.warn("MonteRay.PathtracingRenderer: BVH acceleration not supported.");
		parameters.BVHAcceleration = false;
	}

	var dnumber = 1;
	this.download = function () {
		var el = document.createElement("a");
		el.setAttribute("href", canvas.toDataURL());
		el.setAttribute("download", document.title + "_f" + dnumber + "_" + this.currentSamples() + "spp.png");
		dnumber++;
		el.style.display = "none";
		document.body.appendChild(el);
		el.onclick = function (e) {
			e.stopPropagation();
		}
		el.click();
		document.body.removeChild(el);
	}


	var bs = {
		lngth: 1,
		len: 1,
		uod: true,
		ts: 0,
		tts: 0
	};

	var spp = 1;
	var cw = canvasWidth;
	var ch = canvasHeight;

	this.clearTextureCache = function () {
		MonteRayEngine.clearTextureCache();
	};

	this.currentSamples = function () {
		return spp;
	};

	this.getSize = function () {
		return new THREE.Vector2(cw, ch);
	};

	this.getPixelRatio = function () {
		return pixelRatio;
	};

	var toRender = [];
	var crender = 0;

	this.resetSamples = function () {
		for (var s = 0; s < toRender.length; s++) {
			toRender[s][2] = 2;
		}
		crender = 0;
		spp = 1;

		if (MonteRayEngine.resetWorkers) {
			MonteRayEngine.resetWorkers();
		}
	};



	var pool = [];






	var c;
	MonteRayEngine.requestTexture = function (texture) {
		//console.log(texture);
		var texdrows = [];

		if (texture instanceof THREE.DataTexture == true) {
			if (texture.image.data) {
				var texd = texture.image.data;
				for (var i = 0; i < texd.length; i += 3) {
					//texdrows.push([texd[i] * Math.pow(2, texd[i + 3] - 128), texd[i + 1] * Math.pow(2, texd[i + 3] - 128), texd[i + 2] * Math.pow(2, texd[i + 3] - 128), 255]);
					texdrows.push([Math.pow(texd[i], 1 / 2.2), Math.pow(texd[i + 1], 1 / 2.2), Math.pow(texd[i + 2], 1 / 2.2), 1]);
				}
			}
		} else {
			if (!c) {
				c = document.createElement('canvas').getContext('2d');
			} else {
				c.clearRect(0, 0, c.canvas.width, c.canvas.height);
			}
			c.canvas.width = texture.image.width;
			c.canvas.height = texture.image.height;
			c.drawImage(texture.image, 0, 0);
			var texd = c.getImageData(0, 0, c.canvas.width, c.canvas.height).data;
			for (var i = 0; i < texd.length; i += 4) {
				if (texd[i + 3] == 0) {
					texdrows.push([1, 1, 1, 1]);
				} else {
					texdrows.push([texd[i] / 255, texd[i + 1] / 255, texd[i + 2] / 255, texd[i + 3] / 255]);
				}
			}
			c.clearRect(0, 0, c.canvas.width, c.canvas.height);
			c.canvas.width = 1;
			c.canvas.height = 1;
		}
		if (texdrows.length > 0) {
			var res = [];
			for (var i = 0; i < texdrows.length; i += texture.image.width) {
				res.push(texdrows.slice(i, i + texture.image.width));
			}
			return res;
		}
	};








	this.render = function (scene, camera) {
		var rayIn = false;
		cw = canvasWidth;
		ch = canvasHeight;
		var chw = canvasHalfWidth;
		var chh = canvasHalfHeight;
		canvas.width = cw;
		canvas.height = ch;

		spp = 1;
		// setup
		//context.clearRect(0, 0, canvasWidth, canvasHeight);







		var ptr = [];
		var j = 0;
		MonteRayEngine.pixSize.set(1 / cw, 1 / ch);
		for (var y = 0; y < ch; y++) {
			for (var x = 0; x < cw; x++) {
				ptr.push(new THREE.Vector2((((x + 0.5) / cw) * 2 - 1), (-((y + 0.5) / ch) * 2 + 1)));
				toRender.push([ptr[ptr.length - 1], {
					distance: Infinity
				}, 2, new MonteRay.Color(0, 0, 0, 1), j * 4]);
				j++;
			}
		}

		try {
			document.getElementById("sa").innerHTML = "Analyzing scene...";
		} catch (e) {}

		if (!parameters.threads) {
			MonteRayEngine.updateScene(scene, camera);
			MonteRayEngine.processScene(scene);
		}

		// pre-rendering cycle
		try {
			document.getElementById("sa").innerHTML = "Pre-rendering...";
		} catch (e) {}
		var renderedImage = context.createImageData(cw, ch);
		/*for (var j = 0; j < ptr.length; j++) {
			var outputColor = new MonteRay.Color(0, 0, 0, 0);
			var pixelcast = ptr[j];
			toRender.push([pixelcast, {
				distance: Infinity
			}, 2, new MonteRay.Color(0, 0, 0, 1), j * 4]);

			/*MonteRayEngine.eye.setFromCamera(pixelcast, camera);
			var intersect = MonteRayEngine.eye.intersectObjects(scene.children, true)[0];
			if (intersect == undefined) {
				outputColor.add(MonteRayEngine.getBackground(scene, MonteRayEngine.eye));
				if (parameters.antialiasBackground) {
					//outputColor.setRGB(Math.random(), Math.random(), Math.random());
					//outputColor.setScalar3(Math.random());
					toRender.push([pixelcast, { distance: Infinity }, 2, new MonteRay.Color(0, 0, 0, 1), j * 4]);
				}
			} else {
				try {
					var mat = MonteRayEngine.getPixelMaterial(intersect);
					if (mat.type == "GLOW") {
						var intense = 1;
						if (mat.emissiveIntensity) {
							intense = mat.emissiveIntensity;
						}
						outputColor.copy(mat.color);
						outputColor.add(mat.emissive.multiplyScalar(intense));
						if (parameters.antialiasBackground) {
							toRender.push([pixelcast, intersect, 2, new MonteRay.Color(0, 0, 0, 1), j * 4]);
						}
					} else {
						outputColor.setScalar(intersect.distance / camera.far);
						toRender.push([pixelcast, intersect, 2, new MonteRay.Color(0, 0, 0, 1), j * 4]);
						if (parameters.alpha) {
							outputColor.setA(0);
						}
					}
				} catch (e) {
					console.log(e);
					outputColor.setScalar(intersect.distance / camera.far);
					toRender.push([pixelcast, intersect, 2, new MonteRay.Color(0, 0, 0, 1), j * 4]);
					if (parameters.alpha) {
						outputColor.setA(0);
					}
				}
			}* /
			renderedImage.data[(j * 4)] = outputColor.r * 255;
			renderedImage.data[(j * 4) + 1] = outputColor.g * 255;
			renderedImage.data[(j * 4) + 2] = outputColor.b * 255;
			renderedImage.data[(j * 4) + 3] = outputColor.a * 255;
		}
		//context.putImageData(renderedImage, 0, 0);*/

		if (!parameters.renderMode || (parameters.renderMode && parameters.renderMode == MonteRay.DepthRenderMode)) {
			toRender.sort(function (a, b) {
				return a[1].distance - b[1].distance;
			});
		} else if (parameters.renderMode && parameters.renderMode == MonteRay.CenterRenderMode) {
			var cn = new THREE.Vector3(0, 0);
			var v1 = new THREE.Vector2();
			var v2 = new THREE.Vector2();
			toRender.sort(function (a, b) {
				v1.set(a[0].x * camera.aspect, a[0].y);
				v2.set(b[0].x * camera.aspect, b[0].y);
				return v1.distanceToSquared(cn) - v2.distanceToSquared(cn);
			});
		} else if (parameters.renderMode && parameters.renderMode == MonteRay.RandomRenderMode) {
			for (var i = 0; i < toRender.length; i++) {
				var swap = Math.random() * toRender.length | 0;
				var tmp = toRender[swap];
				toRender[swap] = toRender[i];
				toRender[i] = tmp;
			}
		}

		/*var len = toRender.length;
		var nhp = [];
		var sections = 2;
		var index = 1;
		var cnt = 0;
		while (cnt < len) {
			if (index < sections) {
				var id = Math.floor((len / sections) * index);
				if (toRender[id] != 0) {
					nhp.push(toRender[id]);
					toRender[id] = 0;
					cnt++;
				}
				index++;
			} else {
				index = 1;
				sections *= 2;
			}
		}
		toRender = nhp;*/



		/*var tmp = [];
		var nme = 2;
		for (var i = 0; i < nme; i += 1) {
			tmp[i] = [];
		}
		for (var i = 0; i < toRender.length; i += nme) {
			for (var j = 0; j < Math.min(nme, toRender.length - i); j += 1) {
				tmp[j].push(toRender[i + j]);
			}
		}
		toRender = [];
		for (var i = 0; i < nme; i += 1) {
			toRender = toRender.concat(tmp[i]);
		}
		delete tmp;*/








		crender = 0;
		if (!parameters.fps) {
			bs.lngth = toRender.length;
			if (parameters.pixelBatchSize) {
				bs.lngth = parameters.pixelBatchSize;
			}
		}
		try {
			document.getElementById("sa").innerHTML = cw + "x" + ch + "<br />" + "Rendering 1 sample per pixel...";
		} catch (e) {}
		var v = new MonteRay.Color();

		MonteRayEngine.randomOffset.set(((Math.random() - 0.5) * MonteRayEngine.pixSize.x * 2), ((Math.random() - 0.5) * MonteRayEngine.pixSize.y * 2));






		if (parameters.threads) {
			MonteRayEngine.resetWorkers = function () {
				for (var w = 0; w < pool.length; w++) {
					pool[w].postMessage({
						task: "INIT",
						camera: camera.toJSON(),
					});
					pool[w].invalidated = true;
				}
			};


			var renderedImageUpdated = false;

			scene.traverse(function (obj) {
				if (obj.material) {
					for (x of Object.keys(obj.material)) {
						if (obj.material[x]) {
							if (obj.material[x].image) {
								if (!Array.isArray(obj.material[x].image.data)) {
									console.log(obj.material[x]);
									var texture = obj.material[x];
									var texdrows = [];
									if (!c) {
										c = document.createElement('canvas').getContext('2d');
									} else {
										c.clearRect(0, 0, c.canvas.width, c.canvas.height);
									}
									c.canvas.width = texture.image.width;
									c.canvas.height = texture.image.height;
									c.drawImage(texture.image, 0, 0);
									var texd = c.getImageData(0, 0, c.canvas.width, c.canvas.height).data;
									var newtex = new THREE.DataTexture(texd, c.canvas.width, c.canvas.height);
									for (prop in obj.material[x]) {
										//console.log(prop, typeof obj.material[x][prop]);
										if (typeof obj.material[x][prop] != "function" && prop != "image") {
											newtex[prop] = obj.material[x][prop];
										}
									}
									newtex.type = THREE.IntType;
									newtex.transformUv = THREE.Texture.prototype.transformUv;
									obj.material[x].dispose();
									obj.material[x] = newtex;
									console.log(obj.material[x]);
									/*for (var i = 0; i < texd.length; i += 4) {
										if (texd[i + 3] == 0) {
											texdrows.push([1, 1, 1, 1]);
										} else {
											texdrows.push([texd[i] / 255, texd[i + 1] / 255, texd[i + 2] / 255, texd[i + 3] / 255]);
										}
									}*/
									c.clearRect(0, 0, c.canvas.width, c.canvas.height);
									c.canvas.width = 1;
									c.canvas.height = 1;
									/*if (texdrows.length > 0) {
										var res = [];
										for (var i = 0; i < texdrows.length; i += texture.image.width) {
											res.push(texdrows.slice(i, i + texture.image.width));
										}

									}*/
								}
							}
						}
					}
				}
			});
			var jsonScene = scene.toJSON();
			jsonScene.MRImages = {};
			/*for (i in jsonScene.images) {
				jsonScene.MRImages[String(jsonScene.images[i].uuid)] = true;
				console.log(scene.getObjectByProperty("uuid", String(jsonScene.images[i].uuid)));
				jsonScene.images[i].url = {
					data: true,
					type: "Int8Array"
				}; // replace real images with dummy stubs just so the ObjectLoader will keep the UUID's the same
			}*/
			console.log(jsonScene);
			console.log(scene);
			//console.log(jsonScene);
			var jsonCamera = camera.toJSON();
			//console.log(scene.background);
			if (scene.background.isMonteRayColor) {
				var jsonBackground = {
					type: "Color",
					r: scene.background.r,
					g: scene.background.g,
					b: scene.background.b,
					a: scene.background.a
				};
			} else if (scene.background instanceof THREE.DataTexture) {
				var jsonBackground = {
					itype: "THREE.DataTexture",
					data: scene.background.image.data,
					width: scene.background.image.width,
					height: scene.background.image.height,
					repeat: scene.background.repeat,
					flipY: scene.background.flipY,
					type: scene.background.type
				};
			}
			console.log("HERE");
			console.log(scene.background);
			//console.log(jsonBackground);

			var tstats = [];

			function queueBatch(t) {

				t.bs.tts = Date.now();
				MonteRayEngine.adjustBatchSize(t.bs);
				t.bs.ts = Date.now();

				var nbatch = [];
				t.queuedPixels = [];

				for (var i = 0; i < Math.min(t.bs.lngth, toRender.length - crender); i++) {
					nbatch.push(toRender[crender + i]);
					t.queuedPixels.push(crender + i);
				}
				crender += t.bs.lngth;

				if (crender > toRender.length) {
					crender = 0;
					MonteRayEngine.randomOffset.set(((Math.random() - 0.5) * MonteRayEngine.pixSize.x * 2), ((Math.random() - 0.5) * MonteRayEngine.pixSize.y * 2));
					spp++;
					/*try {
						document.getElementById("sa").innerHTML = cw + "x" + ch + "<br />" + "Rendering " + spp + " samples per pixel...";
					} catch (e) {}*/
				}

				t.postMessage({
					task: "RNDR",
					randomOffsetX: MonteRayEngine.randomOffset.x,
					randomOffsetY: MonteRayEngine.randomOffset.y,
					pixels: JSON.stringify(nbatch)
				});
			}
			var workerIndex = 0;
			while (pool.length < parameters.threads) {
				var w = new Worker("../Build/MonteRayThread.js");
				w.bs = {
					lngth: 1,
					len: 1,
					uod: true,
					ts: 0,
					tts: 0
				};
				tstats[workerIndex] = w.bs;
				w.id = 1 + workerIndex++;

				w.onmessage = function (e) {
					switch (e.data.response) {
						case "DONE":
							if (!this.invalidated) {
								var pixelBatch = JSON.parse(e.data.pixels);
								for (var q = 0; q < pixelBatch.length; q++) {
									toRender[this.queuedPixels[q]] = [new THREE.Vector2(pixelBatch[q][0].x, pixelBatch[q][0].y), pixelBatch[q][1], pixelBatch[q][2], new MonteRay.Color(pixelBatch[q][3].r, pixelBatch[q][3].g, pixelBatch[q][3].b, pixelBatch[q][3].a), pixelBatch[q][4]];
									v.copy(pixelBatch[q][3]).gammaCorrect();
									renderedImage.data[pixelBatch[q][4]] = v.r * 255;
									renderedImage.data[pixelBatch[q][4] + 1] = v.g * 255;
									renderedImage.data[pixelBatch[q][4] + 2] = v.b * 255;
									renderedImage.data[pixelBatch[q][4] + 3] = v.a * 255;

								}
								renderedImageUpdated = true;
							} else {
								delete this.invalidated;
							}
							queueBatch(this);
							break;
						case "TEXTURE":
							break;
					}
				};

				w.postMessage({
					task: "INIT",
					parameters: parameters,
					scene: jsonScene,
					background: jsonBackground,
					camera: jsonCamera,
					pixSize: MonteRayEngine.pixSize,
					randomOffset: MonteRayEngine.randomOffset
				});

				queueBatch(w);

				pool.push(w);
			}
		}






		function renderPixel() {
			if (!parameters.threads) {

				try {


					var pixelcast = toRender[crender];
					var pixelBatch = [];

					for (var q = 0; q < Math.min(bs.lngth, toRender.length - crender); q++) {
						pixelBatch.push(toRender[crender + q]);
					}
					crender += bs.lngth;


					var pixelBatch = MonteRayEngine.renderBatch(pixelBatch, scene, camera);


					for (var q = 0; q < pixelBatch.length; q++) {
						v.copy(pixelBatch[q][3]).gammaCorrect();

						renderedImage.data[pixelBatch[q][4]] = v.r * 255;
						renderedImage.data[pixelBatch[q][4] + 1] = v.g * 255;
						renderedImage.data[pixelBatch[q][4] + 2] = v.b * 255;
						renderedImage.data[pixelBatch[q][4] + 3] = v.a * 255;

					}




					if (crender >= toRender.length) {
						//context.putImageData(renderedImage, 0, 0);
						crender = 0;
						if (parameters.maxSamples || parameters.downloadInterval) {
							if (spp >= parameters.maxSamples || spp % parameters.downloadInterval == 0) {
								context.putImageData(renderedImage, 0, 0);
								self.download();
								if (spp >= parameters.maxSamples) {
									try {
										document.getElementById("sa").innerHTML = "Render Complete";
									} catch (e) {}
									if (parameters.onRenderCompleted) {
										return parameters.onRenderCompleted();
									} else {
										return;
									}
								}
							}
						}


						spp++;

						MonteRayEngine.randomOffset.set(((Math.random() - 0.5) * MonteRayEngine.pixSize.x * 2), ((Math.random() - 0.5) * MonteRayEngine.pixSize.y * 2));

						if (parameters.onSampleCompleted) {
							parameters.onSampleCompleted();
							MonteRayEngine.updateScene(scene, camera);
						}
						try {
							document.getElementById("sa").innerHTML = cw + "x" + ch + "<br />" + "Rendering " + spp + " samples per pixel...";
						} catch (e) {}


					}



					context.putImageData(renderedImage, 0, 0);
					if (parameters.fps) {
						bs.tts = Date.now();
						MonteRayEngine.adjustBatchSize(bs);
						try {
							document.getElementById("sa").innerHTML = cw + "x" + ch + "<br />" + spp + "spp " + bs.lngth + "ppf " + Math.round(1 / ((bs.tts - bs.ts) / 1000)) + "fps";
						} catch (e) {}
						bs.ts = Date.now();
					}
				} catch (e) {
					console.error(e);
				}
			} else {
				if (renderedImageUpdated == true) {
					var ss = cw + "x" + ch + "<br />" + spp + "spp<br />";
					for (var s = 0; s < tstats.length; s++) {
						ss += tstats[s].lngth + "ppf<br />";
					}
					document.getElementById("sa").innerHTML = ss;
					context.putImageData(renderedImage, 0, 0);
					renderedImageUpdated = false;
				}
			}
			requestAnimationFrame(renderPixel);
		}
		requestAnimationFrame(renderPixel);
	};

};

//esm var PathtracingRenderer = MonteRay.PathtracingRenderer;
//esm var Color = MonteRay.Color;
//esm export { PathtracingRenderer, Color };