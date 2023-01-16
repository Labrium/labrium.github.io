var tau = 6.28318530717958637692528;

function deg(number) {
	return (number * tau) / 360;
}

var camdistance = 2;

var orbitUp, orbitDown, orbitLeft, orbitRight;

var onKeyDown = function (event) {
	switch (event.key) {
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
		case "=":
			camdistance -= 0.05;
			break;
		case "-":
			camdistance += 0.05;
			break;
		case "0":
			camdistance = 2;
			break;
	}
};
var onKeyUp = function (event) {
	switch (event.key) {
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
	}
};
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);











var resized = true;
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	EFB.setSize(window.innerWidth, window.innerHeight);
	shaderMaterial.uniforms.screenSize.value.set(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", function () {resized = true;}, false);







var scene = new THREE.Scene();






var EFB = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {depthBuffer: true, stencilBuffer: true});
EFB.texture.encoding = THREE.sRGBEncoding;
EFB.depthTexture = new THREE.DepthTexture();
EFB.depthTexture.format = THREE.DepthStencilFormat;
EFB.depthTexture.type = THREE.UnsignedInt248Type;


var shaderMaterial = new THREE.ShaderMaterial({
	vertexShader: `
varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
	fragmentShader: `
#include <packing>
uniform sampler2D fb;
uniform sampler2D pattern;
uniform vec2 screenSize;
uniform float seed;
varying vec2 vUv;
const vec2 ps = vec2(384.0, 2560.0) * 0.5;
float getDepth(vec2 uv) {
	float x = (uv.x - (ps.x * 0.5)) / screenSize.x;
	float y = uv.y / screenSize.y;
	return perspectiveDepthToViewZ(texture2D(fb, vec2(x, y)).r, 0.1, 10.0);
}
void main() {
	vec2 nuv = vUv * screenSize;
	float maxStep = 30.0;
	float d = 0.0;
	for(int count = 0; count < 100; count++) {
		if(nuv.x < ps.x) break;
		
		float d = getDepth(nuv);
		//d = 1.;
		
		nuv.x -= ps.x - (d * maxStep);
	}

	float x = mod(nuv.x + (seed * ps.x), ps.x) / ps.x;
	float y = mod(nuv.y + (seed * ps.y), ps.y) / ps.y;

	gl_FragColor = vec4(texture2D(pattern, vec2(x, y)).rgb * 5.0 - 2.5, 1.0);
	//gl_FragColor = 1.0 - texture2D(fb, vUv).r;
}
`,
	uniforms: {
		fb: new THREE.Uniform(EFB.depthTexture),
		pattern: new THREE.Uniform(new THREE.TextureLoader().load("Images/fall-color-tile.png")),
		screenSize: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
		seed: new THREE.Uniform(Math.random())
	}
});
shaderMaterial.uniforms.pattern.value.wrapS = THREE.RepeatWrapping;
shaderMaterial.uniforms.pattern.value.wrapT = THREE.RepeatWrapping;

var oc = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
var screen = new THREE.Mesh(new THREE.BufferGeometry(), shaderMaterial);
screen.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
screen.geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );







var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);




var Earth = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(), new THREE.MeshNormalMaterial());
Earth.geometry.scale(0.5, 0.5, 0.5);

var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshNormalMaterial());
ground.rotation.x = -tau / 4;
ground.position.y = -1;
scene.add(ground);

scene.add(Earth);

camera.position.z = 20;
camera.position.y = 10;

var PHI = (1 + Math.sqrt(5)) / 2;

var animate = function () {
	requestAnimationFrame(animate);

	if (resized) {
		onWindowResize();
		resized = false;
	}

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

	camera.lookAt(scene.position);
	camera.translateZ(-(camera.position.distanceTo(scene.position) - camdistance) / 10);

	shaderMaterial.uniforms.seed.value = (shaderMaterial.uniforms.seed.value + PHI) % 1;

	renderer.setRenderTarget(EFB);
	renderer.render(scene, camera);
	renderer.setRenderTarget(null);
	renderer.render(screen, oc);
};

animate();
