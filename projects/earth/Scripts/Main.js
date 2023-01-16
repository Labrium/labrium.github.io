var tau = Math.PI * 2;

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












function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);







var scene = new THREE.Scene();





var sky;
new THREE.TextureLoader().load('Images/sky.png', function (texture) {
	var rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
	texture.encoding = THREE.sRGBEncoding;
	rt.fromEquirectangularTexture(renderer, texture);
	sky = rt;
	scene.background = rt;
});





var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);

if (navigator.userAgent == "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, like Gecko)") {
	renderer.domElement.style.borderRadius = "20px";
}
document.body.appendChild(renderer.domElement);




var Earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshPhongMaterial({
	map: new THREE.TextureLoader().load('Images/Earth.png'),
	bumpMap: new THREE.TextureLoader().load('Images/earth_bumpmap.jpg'),
	bumpScale: 0.05
}));
Earth.material.map.encoding = THREE.sRGBEncoding;

var Atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.11, 64, 64), new THREE.MeshMatcapMaterial({
	color: 0x56E9FD,
	matcap: new THREE.TextureLoader().load('Images/Atmosphere.png'),
	side: THREE.BackSide, blending: THREE.AdditiveBlending
}));
//Atmosphere.material.color.convertSRGBToLinear();
Atmosphere.material.matcap.encoding = THREE.sRGBEncoding;

var Clouds = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshBasicMaterial({ alphaMap: new THREE.TextureLoader().load('Images/Clouds.jpg'), transparent: true, depthTest: false }));
Clouds.material.alphaMap.encoding = THREE.sRGBEncoding;

scene.add(Earth);
scene.add(Atmosphere);
scene.add(Clouds);
var light = new THREE.HemisphereLight(0x111212, 0xffffff, 10);
scene.add(light);

camera.position.z = 20;
camera.position.y = 10;


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

	camera.translateX(-0.001);
	Clouds.rotateY(0.0001);
	camera.lookAt(scene.position);
	camera.translateZ(-(camera.position.distanceTo(Earth.position) - camdistance) / 10);

	light.position.copy(camera.position);
	renderer.render(scene, camera);
};

animate();
