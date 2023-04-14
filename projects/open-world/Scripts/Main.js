var tau = 6.28318530717958637692528;

var camdistance = 4;

var orbitUp, orbitDown, orbitLeft, orbitRight;
var goUp, goDown, goLeft, goRight;

var onKeyDown = function (event) {
	switch (event.code) {
		case "ArrowUp":
			goUp = true;
			break;
		case "ArrowLeft":
			goLeft = true;
			break;
		case "ArrowDown":
			goDown = true;
			break;
		case "ArrowRight":
			goRight = true;
			break;

		case "KeyW":
			orbitUp = true;
			break;
		case "KeyA":
			orbitLeft = true;
			break;
		case "KeyS":
			orbitDown = true;
			break;
		case "KeyD":
			orbitRight = true;
			break;

		case "Equal":
			camdistance -= 0.5;
			break;
		case "NumpadSubtract":
			camdistance += 0.5;
			break;
		case "Numpad0":
			camdistance = 4;
			break;
	}
};
var onKeyUp = function (event) {
	switch (event.code) {
		case "ArrowUp":
			goUp = false;
			break;
		case "ArrowLeft":
			goLeft = false;
			break;
		case "ArrowDown":
			goDown = false;
			break;
		case "ArrowRight":
			goRight = false;
			break;

		case "KeyW":
			orbitUp = false;
			break;
		case "KeyA":
			orbitLeft = false;
			break;
		case "KeyS":
			orbitDown = false;
			break;
		case "KeyD":
			orbitRight = false;
			break;
	}
};
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);





var renderer = MHRenderer(document.body, false);
MHAllowShadows(renderer);

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xadd8ff, 0.0125);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
MHInitResize(renderer, camera);



// Sky
var ctx = document.createElement("canvas").getContext("2d");
ctx.canvas.width = 1024;
ctx.canvas.height = 512;
var my_gradient = ctx.createLinearGradient(0, 512, 0, 0);
my_gradient.addColorStop(0.95, "#4c77a2");
my_gradient.addColorStop(0.54, "#add8ff");
my_gradient.addColorStop(0.5, "#ffffff");
//my_gradient.addColorStop(0.48, "#bcc6cc");
ctx.fillStyle = my_gradient;
ctx.fillRect(0, 0, 1024, 512);

var cskytex = new THREE.CanvasTexture(ctx.canvas);
var skytex = new THREE.WebGLCubeRenderTarget(cskytex.image.height);
skytex.fromEquirectangularTexture(renderer, cskytex);

scene.background = skytex;
scene.environment = skytex.texture;








var getHeightData = (function () {

	var ctx = document.createElement("canvas").getContext("2d");

	return function (img, resize) {
		ctx.canvas.width = img.width;
		ctx.canvas.height = img.height;
		if (resize) {
			ctx.canvas.width = THREE.MathUtils.floorPowerOfTwo(ctx.canvas.width);
			ctx.canvas.height = THREE.MathUtils.floorPowerOfTwo(ctx.canvas.height);
		}

		ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);

		var pix = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;

		var data = [];

		var j = 0;
		for (var i = 0, n = pix.length; i < n; i += 4) {
			//var all = (pix[i] / 255) + (pix[i + 1] / 255) + (pix[i + 2] / 255);
			//data[j++] = all / 3;
			data[j++] = pix[i] / 255;
		}

		return data;
	};
})();




var tl = new THREE.TextureLoader();



var diameter = 800;
var altitude = 160;

var terData, terWidth, terHeight;

var terrain = tl.load("Images/terrain.png", function (img) {
	var rs = img.wrapS != THREE.ClampToEdgeWrapping || img.wrapT != THREE.ClampToEdgeWrapping;
	terData = getHeightData(img.image, rs);
	terWidth = img.image.width;
	terHeight = img.image.height;
	if (rs) {
		terWidth = THREE.MathUtils.floorPowerOfTwo(terWidth);
		terHeight = THREE.MathUtils.floorPowerOfTwo(terHeight);
	}
});
terrain.generateMipmaps = false;
terrain.wrapS = THREE.RepeatWrapping;
terrain.wrapT = THREE.RepeatWrapping;
terrain.magFilter = THREE.LinearFilter;
terrain.minFilter = THREE.LinearFilter;
var scl = 0.25;
var gscl = 0.5;
terrain.repeat.set(scl, scl);

var ground = new THREE.Mesh(new THREE.RingBufferGeometry(0.001, diameter / 2, 400, 400), new THREE.MeshPhongMaterial({
	map: terrain,
	specular: 0x050505,
	displacementMap: terrain,
	displacementScale: altitude,
	displacementBias: -altitude * 0.5,
	//flatShading: true,
	//wireframe: true,
	transparent: true
}));
console.log(ground.material);

THREE.ShaderChunk.fog_fragment = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
	gl_FragColor.a = 1.5 - fogFactor;
#endif`;

ground.material.onBeforeCompile = function (sh) {
	sh.uniforms.imgres = {value: new THREE.Vector2(terWidth, terHeight)};

	sh.uniforms.grass = {value: tl.load("Images/Grass.png")};
	sh.uniforms.grass.value.wrapS = THREE.RepeatWrapping;
	sh.uniforms.grass.value.wrapT = THREE.RepeatWrapping;
	sh.uniforms.grass.value.magFilter = THREE.LinearFilter;
	sh.uniforms.grass.value.minFilter = THREE.LinearFilter;
	sh.uniforms.grass.value.generateMipmaps = false;

	sh.uniforms.grassnrm = {value: tl.load("Images/GrassNRM.png")};
	sh.uniforms.grassnrm.value.wrapS = THREE.RepeatWrapping;
	sh.uniforms.grassnrm.value.wrapT = THREE.RepeatWrapping;
	sh.uniforms.grassnrm.value.magFilter = THREE.LinearFilter;
	sh.uniforms.grassnrm.value.minFilter = THREE.LinearFilter;
	sh.uniforms.grassnrm.value.generateMipmaps = false;

	sh.fragmentShader = `
		uniform mat3 normalMatrix;
		uniform vec2 imgres;
		uniform sampler2D displacementMap;
		uniform float displacementScale;
		uniform sampler2D grass;
		uniform sampler2D grassnrm;
	` + sh.fragmentShader.replace("#include <map_fragment>", `
		vec4 texelColor = texture2D( grass, vUv * ` + (diameter * gscl).toFixed(1) + ` );
		texelColor = sRGBToLinear(texelColor);
		diffuseColor *= texelColor;
	`).replace("#include <normalmap_pars_fragment>", `
		vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN ) {
			vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
			vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
			vec2 st0 = dFdx( vUv.st );
			vec2 st1 = dFdy( vUv.st );
			float scale = sign( st1.t * st0.s - st0.t * st1.s );
			vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
			vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );
			vec3 N = normalize( surf_norm );
			mat3 tsn = mat3( S, T, N );
			mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );
			return normalize( tsn * mapN );
		}
		vec3 norms() {
			float px = (1.0/imgres.x) * ` + (diameter / scl).toFixed(1) + `;
			float py = (1.0/imgres.y) * ` + (diameter / scl).toFixed(1) + `;

			float tl = displacementScale * texture2D(displacementMap, (vec2(floor((vUv.x * imgres.x) + 0.5), ceil((vUv.y * imgres.y) + 0.5)) - 0.5) / imgres).x;
			float tr = displacementScale * texture2D(displacementMap, (vec2(ceil((vUv.x * imgres.x) + 0.5), ceil((vUv.y * imgres.y) + 0.5)) - 0.5) / imgres).x;
			float bl = displacementScale * texture2D(displacementMap, (vec2(floor((vUv.x * imgres.x) + 0.5), floor((vUv.y * imgres.y) + 0.5)) - 0.5) / imgres).x;
			float br = displacementScale * texture2D(displacementMap, (vec2(ceil((vUv.x * imgres.x) + 0.5), floor((vUv.y * imgres.y) + 0.5)) - 0.5) / imgres).x;

			vec3 tlp = vec3(0.0, tl, py);
			vec3 trp = vec3(px, tr, py);
			vec3 blp = vec3(0.0, bl, 0.0);
			vec3 brp = vec3(px, br, 0.0);

			vec3 n1 = cross(trp - tlp, blp - tlp);
			vec3 n2 = cross(brp - trp, blp - trp);

			vec3 res = (n1 + n2) / 2.0;

			return normalize(vec3(res.x, res.y, -res.z));
		}
	`).replace("#include <normal_fragment_maps>", `
		#ifndef FLAT_SHADED
			normal = normalize( normalMatrix * norms() );
		#endif
		vec3 mapN = texture2D( grassnrm, vUv * ` + (diameter * gscl).toFixed(1) + ` ).xyz * 2.0 - 1.0;
		//mapN.xy *= normalScale;
		#ifdef USE_TANGENT
			normal = normalize( vTBN * mapN );
		#else
			normal = perturbNormal2Arb( -vViewPosition, normal, mapN );
		#endif
	`);/*.replace("\n}", `
		//gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
	}`);*/
	console.log(sh.fragmentShader);
};
ground.castShadow = true;
ground.receiveShadow = true;

var vc = new THREE.Vector3();
var uvvc = new THREE.Vector2();
var uvtmpc = new THREE.Vector2(0.5, 0.5);
var tmpc = new THREE.Vector3(0, 0, 0);

var v = 0;

for (var v = 0; v < ground.geometry.attributes.position.array.length / 3; v++) {
	vc.set(ground.geometry.attributes.position.array[v * 3],
		ground.geometry.attributes.position.array[(v * 3) + 1],
		ground.geometry.attributes.position.array[(v * 3) + 2]);

	var dist = vc.distanceTo(tmpc);

	vc.multiplyScalar(Math.pow(dist, 2) / Math.pow(diameter / 2, 2));

	ground.geometry.attributes.position.array[v * 3] = vc.x;
	ground.geometry.attributes.position.array[(v * 3) + 1] = vc.y;
	ground.geometry.attributes.position.array[(v * 3) + 2] = vc.z;


	ground.geometry.attributes.uv.array[v * 2] = (vc.x / diameter) + 0.5;
	ground.geometry.attributes.uv.array[(v * 2) + 1] = (vc.y / diameter) + 0.5;
}
ground.geometry.rotateX(-tau / 4);
ground.geometry.needsUpdate = true;
ground.geometry.attributes.position.needsUpdate = true;
ground.geometry.attributes.uv.needsUpdate = true;
ground.geometry.computeBoundingBox();
ground.geometry.computeBoundingSphere();

scene.add(ground);









var pvel = new THREE.Vector3();
var protaxis = new THREE.Vector3();
var protvel = 0;

var player = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), new THREE.MeshPhongMaterial({
	map: tl.load("Images/Earth.png")
}));
player.castShadow = true;
player.receiveShadow = true;
scene.add(player);

var light = new THREE.HemisphereLight(0x555555, 0xffffff, 1);
scene.add(light);

var sun = new THREE.DirectionalLight(0xffffff, 2);
MHShadow(sun, 512, 10, 10);
//scene.add(new THREE.CameraHelper(sun.shadow.camera));
scene.add(sun);
sun.target = player;

camera.position.z = 20;
camera.position.y = 10;

var cpos = new THREE.Vector2();

function bilinearNormal(ox, oy, vec) {
	var x = ox - 0.5;
	var y = oy - 0.5;
	var tp = [Math.floor(x), Math.floor(y)];
	var bp = [Math.ceil(x), Math.ceil(y)];

	var px = (1/terWidth) * (diameter / scl);
	var py = (1/terHeight) * (diameter / scl);

	var tt = nearest(tp[0], tp[1], terWidth, terHeight, terData) * altitude;
	var bt = nearest(bp[0], tp[1], terWidth, terHeight, terData) * altitude;
	var tb = nearest(tp[0], bp[1], terWidth, terHeight, terData) * altitude;
	var bb = nearest(bp[0], bp[1], terWidth, terHeight, terData) * altitude;

	var ttp = new THREE.Vector3(0.0, tt, py);
	var btp = new THREE.Vector3(px, bt, py);
	var tbp = new THREE.Vector3(0.0, tb, 0.0);
	var bbp = new THREE.Vector3(px, bb, 0.0);

	var n1 = btp.clone().sub(ttp).cross(tbp.clone().sub(ttp));
	var n2 = bbp.clone().sub(btp).cross(tbp.clone().sub(btp));

	vec.copy(n1).add(n2).multiplyScalar(1/2).normalize();
	vec.z = -vec.z;
}

function bilinear(ox, oy, width, height, data) {
	var x = ox - 0.5;
	var y = oy - 0.5;
	var tp = [Math.floor(x), Math.floor(y)];
	var bp = [Math.ceil(x), Math.ceil(y)];

	var w1 = (bp[0] - x) * (bp[1] - y);
	var w2 = (x - tp[0]) * (bp[1] - y);
	var w3 = (bp[0] - x) * (y - tp[1]);
	var w4 = (x - tp[0]) * (y - tp[1]);
	var d = (bp[0] - tp[0]) * (bp[1] - tp[1]);
	var nc = 0;
	var tt = nearest(tp[0], tp[1], width, height, data);
	var bt = nearest(bp[0], tp[1], width, height, data);
	var tb = nearest(tp[0], bp[1], width, height, data);
	var bb = nearest(bp[0], bp[1], width, height, data);
	nc = (tt * w1 + bt * w2 + tb * w3 + bb * w4) / d;

	return nc;
}

function nearest(x, y, width, height, data) {
	return data[XYtoI(x, y, width, height)];
}

function XYtoI(x, y, width, height) {
	return Math.min(Math.max(Math.floor(y) * width, 0), (width) * (height - 1)) + Math.min(Math.max(Math.floor(x), 0), width - 1);
}

var cp = new THREE.Vector3();
var speed = 0.02;
var bn = new THREE.Vector3();

var animate = function () {
	requestAnimationFrame(animate);
	terData[0];

	MHUpdateResize();

	if (orbitUp === true) {
		camera.translateY(camdistance / 50);
	}
	if (orbitDown === true) {
		camera.translateY(-camdistance / 50);
	}
	if (orbitRight === true) {
		camera.translateX(camdistance / 50);
	}
	if (orbitLeft === true) {
		camera.translateX(-camdistance / 50);
	}

	if (goUp === true) {
		pvel.z += -speed;
	}
	if (goDown === true) {
		pvel.z += speed;
	}
	if (goRight === true) {
		pvel.x += speed;
	}
	if (goLeft === true) {
		pvel.x += -speed;
	}

	pvel.y -= 0.01;
	player.position.add(pvel);

	terrain.offset.set(0, 0);
	terrain.updateMatrix();
	cpos.set((player.position.x / diameter), (-player.position.z / diameter));
	cpos.addScalar(0.5);
	terrain.transformUv(cpos);

	ground.position.set(camera.position.x, 0, camera.position.z);
	terrain.offset.set((ground.position.x / diameter) * terrain.repeat.x, (-ground.position.z / diameter) * terrain.repeat.y);
	terrain.updateMatrix();

	var nh = (bilinear(cpos.x * terWidth, cpos.y * terHeight, terWidth, terHeight, terData) - 0.5) * altitude;
	bilinearNormal(cpos.x * terWidth, cpos.y * terHeight, bn);

	if (player.position.y < nh + 0.5) {
		player.position.addScaledVector(bn, Math.max(Math.abs(player.position.y - (nh + 0.5)), 0));
		pvel.addScaledVector(bn, -bn.dot(pvel));
		protaxis.copy(bn).cross(pvel).normalize();
		protvel = Math.max(pvel.length() / (0.5 * tau) * tau, 0.000001);
	}

	player.rotateOnWorldAxis(protaxis, protvel);

	cp.copy(player.position);
	cp.y += 1;
	camera.lookAt(cp);
	camera.translateZ(-(camera.position.distanceTo(cp) - camdistance) / 10);
	cp.y -= 0.5;
	camera.lookAt(cp);

	sun.position.set(player.position.x + 1, player.position.y + 3, player.position.z + 2);

	renderer.render(scene, camera);
};

animate();
