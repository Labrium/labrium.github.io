var tau = 6.28318530717958637692528;

function deg(number) {
	return (number * tau) / 360;
}

var viewContainer = document.getElementById("viewContainer");
var resized = true;
window.addEventListener("resize", function () {resized = true;}, false);



var ctx = document.getElementById("spriteStrip").getContext("2d");


var filed = document.getElementById("file");
filed.addEventListener("change", function (f) {
	var file = f.target.files[0];
	if (file) {
		var reader = new FileReader();
		reader.onload = function (e) {
			var img = new Image();
			img.src = e.target.result;
			if (racers.length > 0) {
				destroyRacer(racers[0]);
			}
			loadRacer(e.target.result, "TEST");
			createRacer("TEST", "CPU");
			img.onload = function () {
				ctx.canvas.width = img.width;
				ctx.canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				resized = true;
			};
		};
		reader.readAsDataURL(file);
	}
});



var scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);


var renderer = new THREE.WebGL1Renderer({
	canvas: document.getElementById("racerView")
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;


var camera = new THREE.PerspectiveCamera(60, 0, 0.1, 1000);
camera.position.set(0, 0.5, -2);
THREE.Quaternion.prototype.invert = THREE.Quaternion.prototype.inverse;
var oc = new THREE.OrbitControls(camera, renderer.domElement);
oc.autoRotate = true;
oc.autoRotateSpeed = 20;
oc.minPolarAngle = deg(75);
oc.maxPolarAngle = oc.minPolarAngle;
oc.target.y = 0.25;


function setCameraAngle(angle) {
	oc.autoRotate = false;
	oc.maxAzimuthAngle = deg(angle + 180) + 0.00001;
	oc.minAzimuthAngle = deg(angle + 180) - 0.00001;
	oc.update();
	oc.maxAzimuthAngle = Infinity;
	oc.minAzimuthAngle = -Infinity;
}





var tl = new THREE.TextureLoader();
var shadowMap = tl.load("../Images/roundshadow.png");
shadowMap.encoding = THREE.sRGBEncoding;

var stand = new THREE.Mesh(new THREE.CylinderBufferGeometry(1, 1.1, 0.1, 8, 1, false), new THREE.MeshMatcapMaterial({
	matcap: new THREE.TextureLoader().load("../Images/3DRacer.png"),
	flatShading: true
}));
stand.rotation.y = deg(22.5);
stand.position.y = -0.05;
scene.add(stand);

var ah = new THREE.AxesHelper();
ah.geometry.attributes.position = new THREE.BufferAttribute(new Float32Array([
	-1, 0, 0,
	1, 0, 0,

	0, 0, 0,
	0, 1, 0,

	0, 0, -1,
	0, 0, 1
]), 3);
ah.position.y += 0.01;
scene.add(ah);




function animate() {
	requestAnimationFrame(animate);
	if (resized == true) {
		renderer.setSize(viewContainer.clientWidth, viewContainer.clientHeight, false);
		camera.aspect = viewContainer.clientWidth / viewContainer.clientHeight;
		camera.updateProjectionMatrix();
		resized = false;
	}

	oc.update();

	if (racers.length > 0) {
		updateAngle(racers[0], camera);
	}

	renderer.render(scene, camera);
}
animate();