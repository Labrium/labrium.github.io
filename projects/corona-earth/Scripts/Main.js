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

function LLHtoECEF(lat, lon, alt, rad) {
	var f = 0, // Flattening factor WGS84 Model
		fix = 57.5,
		cosLat = Math.cos(lat / fix),
		sinLat = Math.sin(lat / fix),
		FF = (1.0 - f) ** 2,
		C = 1 / Math.sqrt(cosLat ** 2 + FF * sinLat ** 2),
		S = C * FF,

		x = (rad * C + alt) * cosLat * Math.cos(lon / fix),
		y = (rad * C + alt) * cosLat * Math.sin(lon / fix),
		z = (rad * S + alt) * sinLat;

	return new THREE.Vector3(x, y, z);
}

function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
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
	rt.fromEquirectangularTexture(renderer, texture);
	sky = rt;
	scene.background = rt;
});
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: true });
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
var Atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.11, 64, 64), new THREE.MeshMatcapMaterial({
	color: 0x56E9FD,
	matcap: new THREE.TextureLoader().load('Images/Atmosphere.png'),
	side: THREE.BackSide, blending: THREE.AdditiveBlending,
	transparent: true
}));
Atmosphere.renderOrder = 2;

var Clouds = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshBasicMaterial({ alphaMap: new THREE.TextureLoader().load('Images/Clouds.jp2'), transparent: true }));
Clouds.renderOrder = 3;
Clouds.material.depthTest = false;
Clouds.material.depthWrite = false;

scene.add(Earth);
scene.add(Atmosphere);
scene.add(Clouds);
var light = new THREE.HemisphereLight(0x2c2c2c, 0xffffff, 5);
scene.add(light);

camera.position.z = 20;
camera.position.y = 10;

var spot = new THREE.Sprite(new THREE.SpriteMaterial({
	//color: 0xee0000,
	map: new THREE.TextureLoader().load('Images/Pin.png'),
	alphaMap: Atmosphere.material.matcap,
	sizeAttenuation: false,
	transparent: true,
	alphaTest: 0.5
}));
spot.scale.set(0.025, 0.025);
//spot.center.set(0.5, -1);
var spots = new THREE.Group();
scene.add(spots);
spots.rotateX(deg(-90));

var pinStems = [];

var data;
getJHUReport(function (text) {
	var total = 0;
	data = csvJSON(text);
	data = JSON.parse(data);
	console.log(data);
	for (var i = 0; i < data.length-1; i++) {
		var newspot = spot.clone();
		newspot.position.copy(LLHtoECEF(data[i].Lat, data[i].Long_, 0.025 + data[i].Confirmed / 30000000, 1));
		newspot.scale.set(0.025 + data[i].Confirmed / 30000000, 0.025 + data[i].Confirmed / 30000000);
		spots.add(newspot);
		pinStems.push(new THREE.Vector3(0, 0, 0));
		pinStems.push(newspot.position);
		total += parseInt(data[i].Confirmed, 10);
	}
	var geometry = new THREE.BufferGeometry().setFromPoints(pinStems);
	var stems = new THREE.Line(geometry, new THREE.LineBasicMaterial({
		color: 0xffffff,
		linewidth: 3,
	}));
	spots.add(stems);
	document.getElementById('cases').innerHTML = "Global Cases: " + commaSeparateNumber(total);
});

for (var i = 0; i < spots.children.length - 1; i++) {
	spots.children[i].position.copy(LLHtoECEF(data[i].Lat, data[i].Long_, 0.025 + data[i].Confirmed / 30000000, 1));
}

var animate = function () {
	requestAnimationFrame(animate);

	if (orbitUp === true) {
		camera.translateY(camdistance / 25);
	}
	if (orbitDown === true) {
		camera.translateY(-camdistance / 25);
	}
	if (orbitRight === true) {
		camera.translateX(camdistance / 25);
	}
	if (orbitLeft === true) {
		camera.translateX(-camdistance / 25);
	}

	camera.translateX(-0.001);
	Clouds.rotateY(0.0002);
	camera.lookAt(Earth.position);
	camera.translateZ(-(distance(camera.position, Earth.position) - camdistance) / 10);

	light.position.copy(camera.position);
	renderer.render(scene, camera);
};

animate();