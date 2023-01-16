var tau = Math.PI * 2;

function deg(number) {
	return (number * tau) / 360;
}

var camdistance = 2;

var orbitUp, orbitDown, orbitLeft, orbitRight;
var forward, backward, left, right;

var onKeyDown = function (event) {
	switch (event.code) {
		case "ArrowUp":
			orbitUp = true;
			break;
		case "ArrowLeft":
			orbitLeft = true;
			break;
		case "ArrowDown":
			orbitDown = true;
			break;
		case "ArrowRight":
			orbitRight = true;
			break;
		case "Equal":
			camdistance /= 1.05;
			break;
		case "NumpadSubtract":
			camdistance *= 1.05;
			break;
		case "Numpad0":
			camdistance = 2;
			break;

		case "KeyW":
			forward = true;
			break;
		case "KeyA":
			left = true;
			break;
		case "KeyS":
			backward = true;
			break;
		case "KeyD":
			right = true;
			break;
	}
};
var onKeyUp = function (event) {
	switch (event.code) {
		case "ArrowUp":
			orbitUp = false;
			break;
		case "ArrowLeft":
			orbitLeft = false;
			break;
		case "ArrowDown":
			orbitDown = false;
			break;
		case "ArrowRight":
			orbitRight = false;
			break;

		case "KeyW":
			forward = false;
			break;
		case "KeyA":
			left = false;
			break;
		case "KeyS":
			backward = false;
			break;
		case "KeyD":
			right = false;
			break;
	}
};
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);












function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	EFB.setSize(window.innerWidth, window.innerHeight);
	water.material.uniforms.screenSize.value.set(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);







var scene = new THREE.Scene();
var waterScene = new THREE.Scene();





var sky = new THREE.CubeTextureLoader().load(["Images/Right.png", "Images/Left.png", "Images/Top.png", "Images/Bottom.png", "Images/Front.png", "Images/Back.png"]);
sky.encoding = THREE.sRGBEncoding;
scene.background = sky;
scene.environment = sky;





var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var EFB = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {depthBuffer: true, stencilBuffer: true});
EFB.texture.encoding = THREE.sRGBEncoding;
EFB.depthTexture = new THREE.DepthTexture();
EFB.depthTexture.format = THREE.DepthStencilFormat;
EFB.depthTexture.type = THREE.UnsignedInt248Type;



var water = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), new THREE.ShaderMaterial({
	vertexShader: `
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
	vNormal = normalize(mat3(modelMatrix) * normal);
}`,
	fragmentShader: `#extension GL_OES_standard_derivatives : enable
#define TANGENTSPACE_NORMALMAP
uniform samplerCube sky;
uniform sampler2D foam;
uniform sampler2D EFB;
uniform sampler2D EFBD;
uniform vec2 screenSize;
uniform sampler2D normalMap;
uniform sampler2D splashMap;
uniform vec3 splashPosition;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
uniform vec3 lightDir;
uniform float time;

float pow2(float n) {
	return n * n;
}

float rand(vec2 co){
	return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float fresnel(vec3 normal, vec3 direction, float ior) {
	float R = pow((1.0 - ior) / (1.0 + ior), 2.0);
	return R + (1.0 - R) * pow(1.0 - dot(normal, direction), 5.0);
}

float normalScale = 2.0;

vec4 getNoise( vec2 uv ) {
	vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
	vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
	vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
	vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
	vec4 noise = texture2D( normalMap, uv0 ) +
		texture2D( normalMap, uv1 ) +
		texture2D( normalMap, uv2 ) +
		texture2D( normalMap, uv3 );
	return noise * 0.5 - 1.0;
}

#include <normalmap_pars_fragment>
#include <packing>

void main() {
	vec3 vViewPosition = vec3(vec4(vWorldPosition, 1.0) * viewMatrix);

	#include <normal_fragment_begin>

	vec3 mapN = getNoise(vUv * 5000.0).rgb;
	mapN.xy *= normalScale;

	float l = mix(3.0, 0.0, fract(time));

	vec2 suv = vUv + (vec2(-splashPosition.x, splashPosition.z) / 1000.0);

	suv = ((suv - 0.5) * ((pow2(1.0 - fract(time)) * 300.0) + 170.5)) + 0.5;


	vec3 omap = (texture2D(splashMap, suv).rgb - 0.5);

	if (suv.x > 1.0 || suv.x < 0.0 || suv.y > 1.0 || suv.y < 0.0) {
		omap = vec3(0.0, 0.0, 0.5);
	}

	omap = omap  * vec3(l, l, 1.0);

	vec3 normalo = perturbNormal2Arb(-vViewPosition, normal, omap);
	normal = perturbNormal2Arb(-vViewPosition, normal, mapN);

	float d = texture2D(EFBD, gl_FragCoord.xy / screenSize).r;
	if (gl_FragCoord.z > d) {
		discard;
	}

	d = perspectiveDepthToViewZ(d, 0.1, 1000.0);
	float rd = perspectiveDepthToViewZ(gl_FragCoord.z, 0.1, 1000.0);

	float dist = d - rd;

	float ft = texture2D(foam, vUv * 500.0).r;

	if (dist > -(((ft * 0.75 + 0.25) * (sin((dist * 10.0) + (time * 5.0)) * 0.5 + 0.5)) + (ft * 0.2)) * 1.0) {
		gl_FragColor = vec4(0.95, 0.95, 0.95, 1.0);
		return;
	}

	vec3 nNormal = normalize(normal + normalo);
	//nNormal = normalo;

	vec3 eyeToSurfaceDir = normalize(vWorldPosition - cameraPosition);
	vec3 direction = reflect(eyeToSurfaceDir, nNormal);
	vec3 rdirection = refract(eyeToSurfaceDir, normal, 1.0 / 1.333);

	vec2 ouv = gl_FragCoord.xy;


	vec4 cup = vec4(0, 1, 0, 1);
	vec4 cright = vec4(1, 0, 0, 1);
	
	cup = cup * viewMatrix;
	cright = cright * viewMatrix;

	vec2 nn = vec2(dot(cright.xyz, normal), dot(cup.xyz, normal));
	vec2 nno = vec2(dot(cright.xyz, normalo), dot(cup.xyz, normalo));


	//vec2 nuv = (ouv + (nn * (d * 1.0))) / screenSize;
	//vec2 nuv = (ouv + (nn * -30.0)) / screenSize;
	vec2 nuv = (ouv + ((nn * -30.0) + (nno * -30.0)) - (vec2(dot(cright.xyz, vNormal), dot(cup.xyz, vNormal)) * -60.0)) / screenSize;

	float nd = perspectiveDepthToViewZ(texture2D(EFBD, nuv).r, 0.1, 1000.0) - rd;

	/*float nnd = texture2D(EFBD, nuv).r;
	if (nnd < gl_FragCoord.z) {
		nuv = (ouv + (nn * ((perspectiveDepthToViewZ(nnd, 0.1, 1000.0) - rd) * 2.0))) / screenSize;
	}*/

	//(vec2(sin((gl_FragCoord.x + time) / 20.0) / 100.0, sin((gl_FragCoord.y + time) / 20.0) / 1000.0)) * d;

	//vec4 rcolor = mix(texture2D(EFB, nuv), vec4(0.5, 0.65, 0.75, 1.0), clamp(pow2(nd * 2.0) / 100.0, 0.0, 1.0)) * vec4(0.9, 1.0, 1.0, 1.0);

	vec4 rcolor = texture2D(EFB, nuv) * vec4(0.9, 1.0, 1.0, 1.0);

	float spec = pow(max(0.0, reflect(normalize(-lightDir), nNormal).y), 64.0);
	//float spec = pow(max(0.0, dot(normalize(-lightDir), -nNormal)), 32.0);

	gl_FragColor = mix(rcolor, textureCube(sky, direction), clamp(fresnel(-nNormal, eyeToSurfaceDir, 1.333) * 1.5, 0.0, 1.0)) + vec4(spec, spec, spec, 1.0);
	//gl_FragColor = mix(textureCube(sky, rdirection), textureCube(sky, direction), fresnel(-vNormal, eyeToSurfaceDir, 1.333));
	//gl_FragColor = vec4(spec, spec, spec, 1.0);
}`,
	uniforms: {
		sky: new THREE.Uniform(sky),
		foam: new THREE.Uniform(new THREE.TextureLoader().load("Images/foam.png")),
		EFB: new THREE.Uniform(EFB.texture),
		EFBD: new THREE.Uniform(EFB.depthTexture),
		screenSize: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
		lightDir: new THREE.Uniform(new THREE.Vector3(1, 3, 1)),
		time: new THREE.Uniform(1),
		normalMap: new THREE.Uniform(new THREE.TextureLoader().load("Images/Water.png")),
		splashMap: new THREE.Uniform(new THREE.TextureLoader().load("Images/ring.png")),
		splashPosition: new THREE.Uniform(new THREE.Vector3())
	}
}));
water.material.uniforms.normalMap.value.wrapS = THREE.RepeatWrapping;
water.material.uniforms.normalMap.value.wrapT = THREE.RepeatWrapping;
water.material.uniforms.foam.value.wrapS = THREE.RepeatWrapping;
water.material.uniforms.foam.value.wrapT = THREE.RepeatWrapping;
water.rotation.x = -tau / 4;
waterScene.add(water);

waterScene.background = EFB.texture;


var Earth = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 15, 15), new THREE.MeshPhongMaterial({
	color: 0x808080,
	map: new THREE.TextureLoader().load('Images/grid.png')
}));
Earth.material.map.wrapS = THREE.RepeatWrapping;
Earth.material.map.wrapT = THREE.RepeatWrapping;
Earth.material.map.repeat = new THREE.Vector2(15, 15);
Earth.material.map.encoding = THREE.sRGBEncoding;
Earth.castShadow = true;
Earth.receiveShadow = true;

for (var i = 0; i < 256; i++) {
	var tm = Earth.clone();
	tm.rotation.set(Math.random() * tau, Math.random() * tau, Math.random() * tau);
	tm.scale.setScalar(Math.random() * 5);
	tm.position.set((Math.random() - 0.5) * (100 - (tm.scale.y * 2)), ((Math.random() - 0.75) * (25 - (tm.scale.y * 2))) - tm.scale.y, (Math.random() - 0.5) * (100 - (tm.scale.y * 2)));
	scene.add(tm);
}

scene.add(Earth);
var light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(1, 3, 1);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
var d = 125;
light.shadow.camera.left = -d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = -d;
light.shadow.camera.near = 0;
light.shadow.camera.far = 100;
light.shadow.radius = 1;
light.target = Earth;
scene.add(light);
water.material.uniforms.lightDir.value.copy(light.position);

scene.add(new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.5));

camera.position.z = 20;
camera.position.y = 10;



var tmp = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), Earth.material.clone());
tmp.material.side = THREE.DoubleSide;
tmp.position.y = -25;
tmp.rotation.copy(water.rotation);
tmp.castShadow = true;
tmp.receiveShadow = true;
scene.add(tmp);

var tmp = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 30), tmp.material);
tmp.position.set(0, -12.5, -50);
tmp.castShadow = true;
tmp.receiveShadow = true;
scene.add(tmp);

var tmp = new THREE.Mesh(tmp.geometry, tmp.material);
tmp.rotation.y = tau / 2;
tmp.position.set(0, -12.5, 50);
tmp.castShadow = true;
tmp.receiveShadow = true;
scene.add(tmp);

var tmp = new THREE.Mesh(tmp.geometry, tmp.material);
tmp.rotation.y = tau / 4;
tmp.position.set(-50, -12.5, 0);
tmp.castShadow = true;
tmp.receiveShadow = true;
scene.add(tmp);

var tmp = new THREE.Mesh(tmp.geometry, tmp.material);
tmp.rotation.y = -tau / 4;
tmp.position.set(50, -12.5, 0);
tmp.castShadow = true;
tmp.receiveShadow = true;
scene.add(tmp);


var tmp = water.clone();
tmp.rotation.x += tau / 2;
waterScene.add(tmp);


/*for (var i = 0; i < 150; i++) {
	var tm = new THREE.Mesh(Earth.geometry, water.material);
	tm.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100);
	tm.rotation.set(Math.random() * tau, Math.random() * tau, Math.random() * tau);
	tm.scale.setScalar(Math.random() * 5);
	waterScene.add(tm);
}*/


/*new THREE.OBJLoader().load("Models/island_island/WS2_common_island.obj", function (obj) {
	obj.scale.setScalar(0.01);
	//obj.position.y -= 0.5;
	obj.traverse(function (c) {
		if (c.material) {
			c.material = new THREE.MeshPhysicalMaterial({color: "green"});
		}
	});
	scene.add(obj);
	/*new THREE.OBJLoader().load("Models/island_island/WS2_common_sea.obj", function (obj2) {
		console.log(obj2);
		obj2.scale.setScalar(0.01);
		//obj2.position.y -= 0.5;
		obj2.traverse(function (c) {
			if (c.material) {
				c.material = water.material;
			}
		});
		waterScene.add(obj2);
	});* /
});*/



var animate = function () {
	requestAnimationFrame(animate);

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



	if (forward === true) {
		Earth.position.z -= 0.25;
	}
	if (backward === true) {
		Earth.position.z += 0.25;
	}
	if (right === true) {
		Earth.position.x += 0.25;
	}
	if (left === true) {
		Earth.position.x -= 0.25;
	}

	//Earth.position.z = Math.sin(water.material.uniforms.time.value / 3) * 5;
	//Earth.position.x = Math.cos(water.material.uniforms.time.value / 3) * 5;
	water.material.uniforms.splashPosition.value.copy(Earth.position);

	Earth.rotation.x += Math.sin(water.material.uniforms.time.value / 3) * 0.01;
	Earth.rotation.y += Math.sin(water.material.uniforms.time.value / tau) * 0.01;

	camera.lookAt(Earth.position);
	camera.translateZ(-(camera.position.distanceTo(Earth.position) - camdistance) / 10);

	light.position.copy(Earth.position);
	light.position.x += 1;
	light.position.y += 3;
	light.position.z += 1;

	renderer.setRenderTarget(EFB);
	renderer.render(scene, camera);

	renderer.setRenderTarget(null);
	renderer.render(waterScene, camera);

	water.material.uniforms.time.value += 1/60;
	Earth.position.y = (Math.sin(water.material.uniforms.time.value * 3) * 0.165) + (Math.cos(water.material.uniforms.time.value * 1.5) * 0.165);
};

animate();