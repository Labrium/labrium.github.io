var resized = false;
window.addEventListener("resize", function () {
	resized = true;
});

var makeTextSprite = (function () {

	var context = document.createElement('canvas').getContext('2d', {
		alpha: false
	});

	var ph = new THREE.MeshBasicMaterial();

	return function (message) {
		var parameters = {};
		var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : {
			r: 0,
			g: 0,
			b: 0,
			a: 1.0
		};

		context.canvas.width = 64;
		context.canvas.height = 64;

		context.rect(0, 0, context.canvas.width, context.canvas.height);
		context.fillStyle = "#fff";
		context.fill();

		context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
		context.font = "64px monospace";
		context.fillText(message, 0, 64 - 10, 64);

		var texture = new THREE.Texture(context.getImageData(0, 0, 64, 64));
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial({
			map: texture,
			transparent: false
		});
		var sprite = new THREE.Sprite(spriteMaterial);
		sprite.add(new THREE.Mesh(box, ph));
		sprite.onBeforeRender = function (r, s, cam) {
			this.remove(this.children[0]);
			this.onBeforeRender = function () {};
		};
		return sprite;
	}
})();



/*var placeholderGeo = new THREE.EdgesGeometry(box);
placeholderGeo.scale(0.95, 0.95, 0.95);
var placeholder = new THREE.LineSegments(placeholderGeo, new THREE.LineBasicMaterial({
	color: 0x999999
}));*/
var placeholder = new THREE.Group();

var blocklib = {};
for (var b = 0; b <= 0xff; b += 0x01) {
	var hex = b.toString(16).padStart(2, "0");
	blocklib["0x" + hex] = {
		name: "UNKNOWN_" + hex,
		orientations: {},
		model: placeholder
	}
}

var orientationLib = {
	"BN": new THREE.Vector3(0, 0, 0),
	"BW": new THREE.Vector3(0, tau / 4, 0),
	"BS": new THREE.Vector3(0, tau / 2, 0),
	"BE": new THREE.Vector3(0, -tau / 4, 0),
	"TN": new THREE.Vector3(tau / 4, 0, 0),
	"TW": new THREE.Vector3(tau / 4, tau / 4, 0),
	"TS": new THREE.Vector3(tau / 4, tau / 2, 0),
	"TE": new THREE.Vector3(tau / 4, -tau / 4, 0),
	"NE": new THREE.Vector3(0, 0, tau / 4),
	"NW": new THREE.Vector3(tau / 4, 0, tau / 4),
	"SW": new THREE.Vector3(tau / 2, 0, tau / 4), // !!!
	"SE": new THREE.Vector3(tau / 4, tau / 2, -tau / 4),

	"YS": new THREE.Vector3(0, 0, 0),
	"YE": new THREE.Vector3(0, tau / 4, 0),
	"YN": new THREE.Vector3(0, tau / 2, 0),
	"YW": new THREE.Vector3(0, -tau / 4, 0),
	//"ZB": new THREE.Vector3(0, 0, 0), // ???
	"XS": new THREE.Vector3(0, 0, tau / 4),
	"ZE": new THREE.Vector3(tau / 4, 0, tau / 4),
	"XN": new THREE.Vector3(tau / 2, 0, tau / 4),
	"ZW": new THREE.Vector3(tau / 4, 0, -tau / 4),
	"ZT": new THREE.Vector3(-tau / 4, 0, 0),
	"XB": new THREE.Vector3(tau / 4, tau / 4, 0),
	"ZB": new THREE.Vector3(tau / 4, 0, 0),
	"XT": new THREE.Vector3(-tau / 4, tau / 4, 0),

	"YZ": new THREE.Vector3(0, 0, 0),
	"YX": new THREE.Vector3(0, tau / 4, 0),
	"ZY": new THREE.Vector3(tau / 4, 0, 0),
	"XY": new THREE.Vector3(tau / 4, tau / 4, 0),
	"XZ": new THREE.Vector3(0, 0, tau / 4),
	"ZX": new THREE.Vector3(tau / 4, 0, tau / 4),

	"S": new THREE.Vector3(0, 0, 0),
	"E": new THREE.Vector3(0, 0, 0),
	"N": new THREE.Vector3(0, 0, 0),
	"W": new THREE.Vector3(0, 0, 0),
	"D": new THREE.Vector3(0, 0, 0),
	"U": new THREE.Vector3(0, 0, 0),

	"X": new THREE.Vector3(0, 0, tau / 4),
	"Y": new THREE.Vector3(0, 0, 0),
	"Z": new THREE.Vector3(tau / 4, 0, 0)
};

var stairOrientations = {
	"0x00": "BN",
	"0x01": "BW",
	"0x02": "BS",
	"0x03": "BE",
	"0x04": "TN",
	"0x05": "TW",
	"0x06": "TS",
	"0x07": "TE",
	"0x08": "TS",
	"0x09": "TE",
	"0x10": "NE",
	"0x11": "NW",
	"0x12": "SW",
	"0x13": "SE",
	"0x15": "SW",
	"0x16": "SE",
	"0x17": "TS",
	"0x0a": "TN",
	"0x0b": "TW",
	"0x0c": "BS",
	"0x0d": "??",
	"0x0e": "??",
	"0x0f": "??"
};
var halfPillarOrientations = {
	"0x00": "YS",
	"0x01": "YE",
	"0x02": "YN",
	"0x03": "YW",
	"0x04": "ZB",
	"0x07": "XB",
	"0x13": "ZW",
	"0x14": "XS",
	"0x15": "ZE",
	"0x16": "XN",
	"0x17": "ZW",
	"0x0c": "ZT",
	"0x05": "XB",
	"0x06": "ZB",
	"0x08": "YN",
	"0x0a": "YS",
	"0x0d": "XT",
	"0x0f": "XT"
};
var eightDirectionOrientations = {
	"0x00": "S",
	"0x01": "E",
	"0x02": "N",
	"0x03": "W",
	"0x04": "D",
	"0x0c": "U"
};
var fourDirectionOrientations = {
	"0x00": "S",
	"0x01": "E",
	"0x02": "N",
	"0x03": "W"
};
var axisOrientations = {
	"0x14": "X",
	"0x0d": "X",
	"0x0f": "X",
	"0x01": "Y",
	"0x00": "Y",
	"0x03": "Y",
	"0x15": "Z",
	"0x0c": "Z",
	"0x17": "Z"
};
var railOrientations = {
	"0x00": "X",
	"0x02": "X",
	"0x08": "X",
	"0x13": "Y",
	"0x14": "Y",
	"0x15": "Y",
	"0x16": "Y",
	"0x17": "Y",
	"0x03": "Z",
	"0x01": "Z",
};

var tileset = new THREE.TextureLoader().load("./t_atlas.png");
tileset.encoding = THREE.sRGBEncoding;

var dirt = new THREE.MeshPhysicalMaterial({
	roughness: 1,
	metalness: 0,
	map: tileset,
	envMapIntensity: 1.5
});
var brick = new THREE.MeshPhysicalMaterial({
	roughness: 1,
	metalness: 0,
	map: tileset,
	envMapIntensity: 1.5
});
var metal = new THREE.MeshPhysicalMaterial({
	roughness: 0.3,
	metalness: 0.9,
	map: tileset,
	envMapIntensity: 2
});
var stone = new THREE.MeshPhysicalMaterial({
	roughness: 0.3,
	metalness: 0,
	map: tileset,
	envMapIntensity: 1.5
});

function setAllUVs(geometry, x, y, w, h) {
	for (var l = 0; l < geometry.attributes.uv.count; l++) {
		var u = geometry.attributes.uv.getX(l);
		var v = geometry.attributes.uv.getY(l);
		geometry.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}
	return geometry;
}

function setBoxUVs(geometry, x, y, w, h, tx, ty, tw, th, bx, by, bw, bh) {
	var len = geometry.attributes.uv.count;

	// front and back
	for (var l = len * (0 / 6); l < len * (2 / 6); l++) {
		var u = geometry.attributes.uv.getX(l);
		var v = geometry.attributes.uv.getY(l);
		geometry.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}

	if (!tx) {
		tx = x;
	}
	if (!ty) {
		ty = y;
	}
	if (!tw) {
		tw = w;
	}
	if (!th) {
		th = h;
	}

	// top
	for (var l = len * (2 / 6); l < len * (3 / 6); l++) {
		var u = geometry.attributes.uv.getX(l);
		var v = geometry.attributes.uv.getY(l);
		geometry.attributes.uv.setXY(l, (u / (tssize / tw)) + (tx / tssize), (v / (tssize / th)) + ((ty - th) / tssize));
	}

	if (!bx) {
		bx = x;
	}
	if (!by) {
		by = y;
	}
	if (!bw) {
		bw = w;
	}
	if (!bh) {
		bh = h;
	}

	// bottom
	for (var l = len * (3 / 6); l < len * (4 / 6); l++) {
		var u = geometry.attributes.uv.getX(l);
		var v = geometry.attributes.uv.getY(l);
		geometry.attributes.uv.setXY(l, (u / (tssize / bw)) + (bx / tssize), (v / (tssize / bh)) + ((by - bh) / tssize));
	}

	// left and right
	for (var l = len * (4 / 6); l < len * (6 / 6); l++) {
		var u = geometry.attributes.uv.getX(l);
		var v = geometry.attributes.uv.getY(l);
		geometry.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}

	return geometry;
}

blocklib["0x00"].name = "Air";
blocklib["0x00"].model = null;
blocklib["0x01"].name = "Stone";
blocklib["0x01"].model = new THREE.Mesh(setBoxUVs(box.clone(), 453, 1916, 56, 56), stone);
blocklib["0x02"].name = "Brick";
blocklib["0x02"].model = new THREE.Mesh(setBoxUVs(box.clone(), 516, 1916, 56, 56), brick);
blocklib["0x03"].name = "Stone 03";
blocklib["0x03"].model = blocklib["0x01"].model;
blocklib["0x04"].name = "Win";
blocklib["0x04"].model = new THREE.Mesh(setBoxUVs(box.clone(), 644, 1980, 56, 56, 516, 2044, 56, 56, 644, 1980, 56, 56), metal);
blocklib["0x05"].name = "Stone Stair";
blocklib["0x05"].orientations = stairOrientations;
blocklib["0x05"].model = new THREE.Mesh(setAllUVs(stair.clone(), 453, 1916, 56, 56), stone);
blocklib["0x06"].name = "Trash";
blocklib["0x06"].model = new THREE.Mesh(trashCan, metal.clone());
blocklib["0x06"].model.material.flatShading = true;
blocklib["0x07"].name = "Stone Slope";
blocklib["0x07"].orientations = stairOrientations;
blocklib["0x07"].model = new THREE.Mesh(setAllUVs(slope.clone(), 453, 1916, 56, 56), stone);
blocklib["0x08"].name = "Dirt Slope";
blocklib["0x08"].orientations = stairOrientations;
blocklib["0x08"].model = new THREE.Mesh(setAllUVs(slope.clone(), 4, 1724, 56, 56), dirt);
blocklib["0x09"].model = "Golden Ball";
blocklib["0x09"].model = new THREE.Mesh(setBoxUVs(ball.clone(), 836, 1916, 56, 56), metal);
blocklib["0x0a"].name = "Metal Win";
blocklib["0x0a"].orientations = eightDirectionOrientations;
blocklib["0x0a"].model = new THREE.Mesh(setBoxUVs(box.clone(), 580, 1916, 56, 56, 516, 2044, 56, 56, 580, 1916, 56, 56), metal);
blocklib["0x0b"].name = "Water";
blocklib["0x0b"].model = null;
blocklib["0x0c"].name = "Grass";
blocklib["0x0c"].model = new THREE.Mesh(setBoxUVs(box.clone(), 4, 1788, 56, 56, 4, 1852, 56, 56, 4, 1724, 56, 56), dirt);
blocklib["0x0d"].name = "Black Pillar";
blocklib["0x0d"].model = new THREE.Mesh(setAllUVs(pillar.clone(), 4, 2044, 1, 1), stone);
blocklib["0x0e"].name = "Stone Quarter";
blocklib["0x0e"].orientations = stairOrientations;
blocklib["0x0e"].model = new THREE.Mesh(setAllUVs(quarterPillar.clone(), 453, 1916, 56, 56), stone);
blocklib["0x0f"].name = "B Bot";
blocklib["0x0f"].orientations = fourDirectionOrientations;
blocklib["0x10"].name = "Zapper";
blocklib["0x10"].orientations = {
	"0x00": "U"
};
blocklib["0x11"].name = "Draggable";
blocklib["0x11"].model = new THREE.Mesh(setBoxUVs(box.clone(), 196, 2044, 56, 56), metal);
blocklib["0x12"].name = "Dirt";
blocklib["0x12"].model = new THREE.Mesh(setBoxUVs(box.clone(), 4, 1724, 56, 56), dirt);
blocklib["0x13"].name = "Wheel";
blocklib["0x13"].orientations = eightDirectionOrientations;
blocklib["0x14"].name = "Metal Stair";
blocklib["0x14"].orientations = stairOrientations;
blocklib["0x14"].model = new THREE.Mesh(setAllUVs(stair.clone(), 580, 1916, 56, 56), metal);
blocklib["0x15"].name = "Metal Quarter";
blocklib["0x15"].orientations = stairOrientations;
blocklib["0x15"].model = new THREE.Mesh(setAllUVs(quarterPillar.clone(), 580, 1916, 56, 56), metal);
blocklib["0x16"].name = "Motor";
blocklib["0x16"].orientations = eightDirectionOrientations;
blocklib["0x17"].name = "Metal 17";
blocklib["0x17"].model = new THREE.Mesh(setBoxUVs(box.clone(), 516, 1980, 56, 56), metal);
blocklib["0x18"].name = "Stone 18";
blocklib["0x18"].model = blocklib["0x01"].model;
blocklib["0x19"].name = "Metal";
blocklib["0x19"].model = new THREE.Mesh(setBoxUVs(box.clone(), 580, 1916, 56, 56), metal);
blocklib["0x1a"].name = "R Bot";
blocklib["0x1a"].orientations = fourDirectionOrientations;
blocklib["0x1b"].name = "Eye";
blocklib["0x1b"].model = new THREE.Mesh(setBoxUVs(ball.clone(), 324, 1148, 1, 1, 363, 1110, 171, 171, 324, 1148, 1, 1), new THREE.MeshPhysicalMaterial({
	roughness: 0.25,
	metalness: 0,
	map: tileset
}));
blocklib["0x1b"].model.geometry.rotateX(tau / 4);
//blocklib["0x1b"].model.geometry.scale(0.75, 0.75, 0.75);
blocklib["0x1b"].model.rotateX(-tau / 4);
blocklib["0x1d"].name = "Stone 1d";
blocklib["0x1d"].model = blocklib["0x01"].model;
blocklib["0x1d"].orientations = {
	"0x00": "?"
};
blocklib["0x1e"].name = "Curved Rail";
blocklib["0x1e"].orientations = stairOrientations;
blocklib["0x1e"].model = new THREE.Mesh(setAllUVs(curvedRail.clone(), 580, 1916, 56, 56), metal);
blocklib["0x1f"].name = "Stone Pillar 1f";
blocklib["0x1f"].orientations = axisOrientations;
blocklib["0x20"].name = "Metal Half Pillar";
blocklib["0x20"].orientations = halfPillarOrientations;
blocklib["0x20"].model = new THREE.Mesh(setAllUVs(halfPillar.clone(), 580, 1916, 56, 56), metal);
blocklib["0x21"].name = "Rail";
blocklib["0x21"].orientations = railOrientations;
blocklib["0x21"].model = new THREE.Mesh(setAllUVs(rail.clone(), 580, 1916, 56, 56), metal);
blocklib["0x22"].name = "Stone Half Pillar";
blocklib["0x22"].orientations = halfPillarOrientations;
blocklib["0x22"].model = new THREE.Mesh(setAllUVs(halfPillar.clone(), 453, 1916, 56, 56), stone);
blocklib["0x23"].name = "Stone Pillar";
blocklib["0x23"].orientations = axisOrientations;
blocklib["0x23"].model = new THREE.Mesh(setAllUVs(pillar.clone(), 453, 1916, 56, 56), stone);
blocklib["0x1f"].model = blocklib["0x23"].model;
blocklib["0x24"].name = "Draggable Pillar";
blocklib["0x24"].orientations = axisOrientations;
blocklib["0x24"].model = new THREE.Mesh(setAllUVs(pillar.clone(), 196, 2044, 56, 56), metal);
blocklib["0x25"].name = "Metal Ball";
blocklib["0x25"].model = new THREE.Mesh(setBoxUVs(ball.clone(), 580, 1916, 56, 56), metal);
blocklib["0x26"].name = "Stone 26";
blocklib["0x26"].model = blocklib["0x01"].model;
blocklib["0x27"].name = "Metal Pillar";
blocklib["0x27"].orientations = axisOrientations;
blocklib["0x27"].model = new THREE.Mesh(setAllUVs(pillar.clone(), 580, 1916, 56, 56), metal);
blocklib["0x29"].name = "Slider";
blocklib["0x29"].orientations = railOrientations;
blocklib["0x29"].model = new THREE.Mesh(setBoxUVs(pillar.clone(), 516, 1980, 56, 56, 900, 1980, 56, 56, 900, 1980, 56, 56), metal);
blocklib["0x2b"].name = "Fence";
blocklib["0x2b"].orientations = {
	"0x00": "YZ",
	"0x01": "YX",
	"0x02": "YZ",
	"0x03": "YX",
	"0x04": "ZY",
	"0x07": "XY",
	"0x10": "XZ",
	"0x13": "ZX",
	"0x06": "ZY",
	"0x09": "YX",
	"0x0a": "YZ",
	"0x14": "XZ"
};
blocklib["0x2b"].model = new THREE.Mesh(fence, dirt);
blocklib["0x31"].name = "Metal Slope";
blocklib["0x31"].orientations = stairOrientations;
blocklib["0x31"].model = new THREE.Mesh(setAllUVs(slope.clone(), 580, 1916, 56, 56), metal);
blocklib["0x32"].name = "L Bot";
blocklib["0x32"].orientations = fourDirectionOrientations;
blocklib["0x33"].name = "Star";
blocklib["0x33"].model = new THREE.Mesh(star, metal.clone());
blocklib["0x33"].model.material.color = new THREE.Color(0xffff00);
blocklib["0x33"].model.material.map = null;
blocklib["0x34"].name = "Dirt 34"
blocklib["0x34"].model = blocklib["0x12"].model;

console.log(blocklib);

var container = document.getElementById("container");
var renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById("viewer"),
	antialias: true,
	alpha: true
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(container.clientWidth, container.clientHeight);
var camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight,
	0.1, 80);
var scene = new THREE.Scene();

var level = new THREE.Group();
scene.add(level);

var bounds = new THREE.Box3();
bounds.makeEmpty();
var bh = new THREE.Box3Helper(bounds, 0x00ff00);
//scene.add(bh);

var tbox = new THREE.Box3();
var tboxcenter = new THREE.Vector3(0, 0, 0);
var tboxsize = new THREE.Vector3(1, 1, 1);
var leveloffset = new THREE.Vector3(0, 0, 0);

var colors = [new THREE.Color(0xFFFFFF), new THREE.Color(0xF8F8F8), new THREE.Color(0xF5F5F5), new THREE.Color(0xF0F0F0), new THREE.Color(0xE8E8E8), new THREE.Color(0xE0E0E0), new THREE.Color(0xDCDCDC), new THREE.Color(0xD8D8D8), new THREE.Color(0xD3D3D3), new THREE.Color(0xD0D0D0)];

/*for (c in colors) {
	colors[c].convertSRGBToLinear();
}*/

var oc = new THREE.OrbitControls(camera, container);
oc.enableDamping = true;
//oc.autoRotate = true;
oc.dampingFactor = 0.1;
oc.screenSpacePanning = true;

camera.position.setScalar(16);
oc.target.copy(scene.position);

var sres = 56;

var depthMaterial = new THREE.MeshDepthMaterial();
depthMaterial.onBeforeCompile = function ( shader ) {
	shader.fragmentShader = /* glsl */`
		${shader.fragmentShader.replace(
			'gl_FragColor = vec4( vec3( 1.0 - gl_FragCoord.z ), opacity );',
			'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0 - sqrt(gl_FragCoord.z));'
		)}
	`;
};

var floor = new THREE.WebGLRenderTarget(19 * sres, 19 * sres);
floor.encoding = THREE.sRGBEncoding;

var scam = new THREE.OrthographicCamera(-9.5, 9.5, 9.5, -9.5, 0, 8);
scam.position.set(0, -1, 0);
scam.lookAt(0, 0, 0);

var grnd = new THREE.Mesh(new THREE.PlaneBufferGeometry(19, 19), new THREE.MeshBasicMaterial({
	//color: 0x000000, //0xababab,
	map: floor.texture,
	transparent: true
}));
grnd.rotation.x = -tau / 4;
grnd.scale.y = -1;

var blurRT = (function () {

	var blurt = new THREE.WebGLRenderTarget(19 * sres, 19 * sres);
	blurt.encoding = THREE.sRGBEncoding;
	var blursm = new THREE.ShaderMaterial({
		vertexShader: `varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
		fragmentShader: `varying vec2 vUv;
uniform vec2 resolution;
uniform vec2 direction;
uniform sampler2D image;

void main() {
	gl_FragColor = vec4(0.0);
	vec2 off1 = vec2(1.411764705882353) * direction;
	vec2 off2 = vec2(3.2941176470588234) * direction;
	vec2 off3 = vec2(5.176470588235294) * direction;
	gl_FragColor += texture2D(image, vUv) * 0.1964825501511404;
	gl_FragColor += texture2D(image, vUv + (off1 / resolution)) * 0.2969069646728344;
	gl_FragColor += texture2D(image, vUv - (off1 / resolution)) * 0.2969069646728344;
	gl_FragColor += texture2D(image, vUv + (off2 / resolution)) * 0.09447039785044732;
	gl_FragColor += texture2D(image, vUv - (off2 / resolution)) * 0.09447039785044732;
	gl_FragColor += texture2D(image, vUv + (off3 / resolution)) * 0.010381362401148057;
	gl_FragColor += texture2D(image, vUv - (off3 / resolution)) * 0.010381362401148057;
}`,
		uniforms: {
			resolution: new THREE.Uniform(new THREE.Vector2(19 * sres, 19 * sres)),
			direction: new THREE.Uniform(new THREE.Vector2(0, 0)),
			image: new THREE.Uniform(blurt.texture)
		}
	});
	var blurs = new THREE.Mesh(new THREE.BufferGeometry(), blursm);
	blurs.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
	blurs.geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );
	var blurc = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

	return function (rt, r) {

		for (var i = 0; i < Math.floor(sres / 4); i++) {
			blursm.uniforms.image.value = rt.texture;
			blursm.uniforms.direction.value.set(4, 0);
			r.setRenderTarget(blurt);
			r.render(blurs, blurc);

			blursm.uniforms.image.value = blurt.texture;
			blursm.uniforms.direction.value.set(0, 4);
			r.setRenderTarget(rt);
			r.render(blurs, blurc);
		}
	};
})();

function update3DView() {
	var lgeo = [];
	var lmat = [];
	var waterlevel = 0;
	level.children = [];
	bounds.makeEmpty();
	var index = 0;
	for (var z = 0; z < 16; z++) {
		for (var y = 0; y < 16; y++) {
			for (var x = 0; x < 16; x++) {
				var k = "0x" + data[index].toString(16).padStart(2, "0");
				if (blocklib[k].name == "Water") {
					waterlevel = y + 1;
				}
				try {
					var l = Object.keys(blocklib[k].orientations).length;
				} catch (e) {
					var l = 0;
					console.log("Unknown Block Type: " + k);
				}
				if (blocklib[k].model != null) {
					var b = blocklib[k].model.clone();

					if (blocklib[k].model.uuid == placeholder.uuid) {
						//b.add(makeTextSprite(data[index].toString(16).padStart(2, "0")));
						if (l == 0) {
							b = makeTextSprite(data[index].toString(16).padStart(2, "0"));
						} else {
							b = makeTextSprite(data[index].toString(16).padStart(2, "0") + " " + data[index + 1].toString(16).padStart(2, "0"));
						}
						b.scale.setScalar(0.9);
					} else {
						b.material = blocklib[k].model.material.clone();
					}

					if (blocklib[k].name == "Eye") {
						b.onBeforeRender = function () {
							this.lookAt(camera.position);
						};
					} else if (blocklib[k].name == "Star") {
						b.onBeforeRender = function () {
							this.rotation.y += 0.05;
						};
					} else {

						b.material.color = colors[Math.floor(Math.random() * colors.length)];
					}

					b.position.set(x, y, z);
					b.getWorldPosition(tboxcenter);
					tbox.setFromCenterAndSize(tboxcenter, tboxsize);
					bounds.union(tbox);

					if (b.isSprite || blocklib[k].name == "Eye" || blocklib[k].name == "Star") {
						level.add(b);
					} else {
						var geo = b.geometry.clone();
						if (l != 0) {
							var ro = "0x" + data[index + 1].toString(16).padStart(2, "0");
							if (orientationLib[blocklib[k].orientations[ro]]) {
								geo.rotateX(orientationLib[blocklib[k].orientations[ro]].x);
								geo.rotateY(orientationLib[blocklib[k].orientations[ro]].y);
								geo.rotateZ(orientationLib[blocklib[k].orientations[ro]].z);
							} else {
								console.log("Unsupported orientation ", blocklib[k], ro);
								//alert("Unsupported orientation " + blocklib[k].name + " " + ro);
							}
						}
						geo.translate(x, y, z);
						lgeo.push(geo);
						lmat.push(b.material);
					}
				}
				if (l != 0) {
					index += 2;
				} else {
					index += 1;
				}
			}
		}
	}

	try {
		level.add(new THREE.Mesh(THREE.BufferGeometryUtils.mergeVertices(THREE.BufferGeometryUtils.mergeBufferGeometries(lgeo, true)), lmat));
		console.log(level.children[level.children.length - 1]);
	} catch (e) { }

	document.getElementById("unicode").style.display = "none";
	bounds.getCenter(level.position);
	tboxcenter.set(level.position.x, 0, level.position.z);
	tbox.setFromCenterAndSize(tboxcenter, tboxsize);
	bounds.union(tbox);
	bounds.getCenter(level.position);
	var t = new THREE.Vector3();
	bounds.getSize(t);

	if (waterlevel > 0) {
		var water = new THREE.Mesh(new THREE.BoxBufferGeometry(t.x - 0.25, waterlevel - 0.6, t.z - 0.25), new THREE.MeshPhysicalMaterial({
			color: 0x1188aa,
			transparency: 0.5,
			transparent: true,
			roughness: 0,
			metalness: 0
		}));
		water.renderOrder = 2;
		water.material.premultipliedAlpha = true;
		water.position.set(level.position.x, waterlevel / 2 - 0.79, level.position.z);
	}

	level.position.negate();
	bounds.translate(level.position);

	scene.overrideMaterial = depthMaterial;

	scam.position.y = level.position.y - 0.6;

	renderer.setRenderTarget(floor);
	renderer.render(scene, scam);

	scene.overrideMaterial = null;

	blurRT(floor, renderer);
	renderer.setRenderTarget(null);

	if (waterlevel > 0) {
		level.add(water);
	}

	grnd.position.copy(level.position);
	grnd.position.negate();
	grnd.position.y = -0.5;
	level.add(grnd);

	//camera.position.setScalar(16);
	//oc.target.copy(scene.position);
}

var hdrloader = new THREE.RGBELoader();
hdrloader.load("./rainforest_trail_1k.hdr", function (hdr) {
	var pg = new THREE.PMREMGenerator(renderer);
	var rt = pg.fromEquirectangular(hdr);
	//scene.background = rt.texture;
	scene.environment = rt.texture;
	//scene.add(new THREE.AmbientLight(0xffffff, 0.25));
});

function animate() {
	requestAnimationFrame(animate);

	if (resized) {
		renderer.setSize(container.clientWidth, container.clientHeight);
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		resized = false;
	}

	oc.update();

	renderer.render(scene, camera);
}
requestAnimationFrame(animate);