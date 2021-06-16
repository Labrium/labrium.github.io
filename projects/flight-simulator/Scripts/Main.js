var tau = Math.PI * 2;

function deg(number) {
	return (number * tau) / 360;
}

function distance(v1, v2) {
	var dx = v1.x - v2.x;
	var dy = v1.y - v2.y;
	var dz = v1.z - v2.z;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

var camdistance = 2;

var orbitUp, orbitDown, orbitLeft, orbitRight;

var onKeyDown = function (event) {
	switch (event.key) {
		case "8":
			orbitUp = true;
			break;
		case "4":
			orbitLeft = true;
			break;
		case "5":
			orbitDown = true;
			break;
		case "6":
			orbitRight = true;
			break;
		case "+":
			camdistance -= 0.5;
			break;
		case "-":
			camdistance += 0.5;
			break;
		case "=":
			camdistance = 2;
			break;
	}
};
var onKeyUp = function (event) {
	switch (event.key) {
		case "8":
			orbitUp = false;
			break;
		case "4":
			orbitLeft = false;
			break;
		case "5":
			orbitDown = false;
			break;
		case "6":
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
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000000000000000000);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;




var waterGeometry = new THREE.PlaneGeometry(3000, 3000);

water = new THREE.Water(
	waterGeometry,
	{
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: new THREE.TextureLoader().load('Images/Water.png', function (texture) {

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

		}),
		alpha: 1.0,
		sunDirection: new THREE.Vector3(),
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 3.7,
		fog: scene.fog !== undefined
	}
);

water.rotation.x = - Math.PI / 2;
//water.position.y = -1;
water.material.depthFunc = THREE.NeverDepth;
water.receiveShadow = true;

scene.add(water);


var sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(0, 1, 0);
sun.castShadow = true;
sun.shadow.mapSize.width = 512;  // default
sun.shadow.mapSize.height = 512; // default
sun.shadow.camera.near = 0.1;    // default
sun.shadow.camera.far = 100000000;
scene.add(sun);

var sky;
new THREE.TextureLoader().load('Images/sky.png', function (texture) {
	const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
	rt.fromEquirectangularTexture(renderer, texture);
	sky = rt;
	scene.background = rt;
});


var loadingManager = new THREE.LoadingManager(initModels);
var loader = new THREE.ColladaLoader(loadingManager);
loader.load('Models/Nintendo Plane/plane.dae', function (collada) {
	plane = collada.scene;
});
loader.load('Models/island_island/WS2_common_island copy.dae', function (collada) {
	island = collada.scene;
});
var planeShadow;
function initModels() {
	/*plane.children[0].children[0].children[0].children[1].material = new THREE.MeshStandardMaterial({
		map: new THREE.TextureLoader().load('Models/Nintendo Plane/common1.png'),
		metalness: 1,
		roughness: 0
	});*/
	for (var i = 1; i < 4; i++) {
		plane.children[0].children[0].children[0].children[i].material.envMap = sky;
		plane.children[0].children[0].children[0].children[i].castShadow = true;
	}
	/*plane.children[0].children[0].children[0].children[1].material.envMap = sky;
	plane.children[0].children[0].children[0].children[1].castShadow = true;
	plane.children[0].children[0].children[0].children[2].castShadow = true;
	plane.children[0].children[0].children[0].children[3].castShadow = true;
	plane.children[0].children[0].children[0].children[3].castShadow = true;*/
	plane.scale.set(0.1, 0.1, 0.1);
	scene.add(plane);
	scene.add(island);
	sun.target = plane;
}

scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 1));


camera.position.z = -20;
camera.position.y = 10;

console.log(scene);


var mouseX = 0;
var mouseY = 0;
function rotate(event) {
	mouseX = event.pageX - (window.innerWidth / 2);
	mouseY = event.pageY - (window.innerHeight / 2);
}
document.addEventListener('mousemove', rotate, false);


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

	plane.eulerOrder = "YXZ";

	plane.rotation.x += (mouseY / 7500);
	plane.rotation.y += (-mouseX / 5000);
	plane.rotation.z = mouseX / 360;
	plane.translateZ(0.1);
	camera.translateY(0.025);
	//plane.position.y -= 0.05;

	if (plane.position.y < 0.25) {
		plane.position.y = 0.25;
	}


	camera.lookAt(plane.position);
	camera.translateZ(-(distance(camera.position, plane.position) - camdistance) / 10);

	water.material.uniforms['time'].value += 1.0 / 60.0;

	sun.position.set(plane.position.x, plane.position.y + 10, plane.position.z);

	renderer.render(scene, camera);
};

animate();