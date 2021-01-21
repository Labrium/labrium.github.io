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

var camdistance = 15;

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
			camdistance -= 1;
			break;
		case "-":
			camdistance += 1;
			break;
		case "=":
			camdistance = 15;
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
scene.background = new THREE.Color(0xeeeeee);
scene.fog = new THREE.Fog(scene.background, 30, 40);
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.physicallyCorrectLights = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(0, 10, 2);
scene.add(light);
scene.add(new THREE.HemisphereLight(0xffffff, 0xdddddd, 3));

camera.position.set(0, 15, 20);

var groundmap = new THREE.TextureLoader().load("Images/Ground.png");
groundmap.repeat = new THREE.Vector2(25, 25);
groundmap.wrapT = THREE.MirroredRepeatWrapping;
groundmap.wrapS = THREE.MirroredRepeatWrapping;

var groundspm = new THREE.TextureLoader().load("Images/Ground_spm.png");
groundspm.repeat = new THREE.Vector2(25, 25);
groundspm.wrapT = THREE.MirroredRepeatWrapping;
groundspm.wrapS = THREE.MirroredRepeatWrapping;
var ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({
	color: 0x888888,
	map: groundmap,
	specular: 0x828c73,
	specularMap: groundspm,
	shininess: 15,
}));
ground.material.depthTest = false;
ground.rotation.x = deg(-90);
ground.rotation.z = deg(45);
scene.add(ground);

var shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
	map: new THREE.TextureLoader().load("Images/roundshadow.png"),
	transparent: true,
	opacity: 0.625
}));
shadow.rotation.x = deg(-90);
shadow.position.y = 0;
scene.add(shadow);


var loadingManager = new THREE.LoadingManager(initModels);
var loader = new THREE.ColladaLoader(loadingManager);
loader.load('Models/Mushie/ItemKinoko.dae', function (collada) {
	mushie = collada.scene;
});
var point;
function initModels() {
	mushie.scale.set(0.1, 0.1, 0.1);
	mushie.rotation.set(0, 0, 0);
	mushie.position.set(0, 0.275, 0);
	scene.add(mushie);
	point = new THREE.Vector3(Math.random(), mushie.position.y, Math.random());
}

console.log(scene);

var animate = function () {
	requestAnimationFrame(animate);

	if (orbitUp === true) {
		camera.translateY(camdistance / 30);
	}
	if (orbitDown === true) {
		camera.translateY(-camdistance / 30);
	}
	if (orbitRight === true) {
		camera.translateX(camdistance / 30);
	}
	if (orbitLeft === true) {
		camera.translateX(-camdistance / 30);
	}

	mushie.lookAt(point);
	if (distance(mushie.position, point) < 0.05) {
		point = new THREE.Vector3((Math.random() * 10) - 5, mushie.position.y, (Math.random() * 10) - 5);
	}
	mushie.translateZ(0.05);

	shadow.position.set(mushie.position.x, 0, mushie.position.z);

	camera.lookAt(scene.position);
	camera.translateZ(-(distance(camera.position, scene.position) - camdistance) / 10);

	renderer.render(scene, camera);
};

animate();