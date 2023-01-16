var tau = Math.PI * 2;

function deg(number) {
	return (number * tau) / 360;
}

THREE.MathUtils.damp = function (x, y, lambda, dt) {
	return THREE.MathUtils.lerp(x, y, 1 - Math.exp(-lambda * dt));
};

var camdistance = 4;

var orbitUp, orbitDown, orbitLeft, orbitRight;
var fw, bw, tl, tr;

var onKeyDown = function (event) {
	switch (event.code) {
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


		case "ArrowUp":
			fw = true;
			break;
		case "ArrowLeft":
			tl = true;
			break;
		case "ArrowDown":
			bw = true;
			break;
		case "ArrowRight":
			tr = true;
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

		case "ArrowUp":
			fw = false;
			break;
		case "ArrowLeft":
			tl = false;
			break;
		case "ArrowDown":
			bw = false;
			break;
		case "ArrowRight":
			tr = false;
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
scene.background = new THREE.Color("lightskyblue");
scene.fog = new THREE.FogExp2(scene.background, 0.0125);




/*var sky;
new THREE.TextureLoader().load('Images/sky.png', function (texture) {
	var rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
	rt.fromEquirectangularTexture(renderer, texture);
	sky = rt;
	scene.background = rt;
});*/





var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

var renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);



var c = new THREE.Clock();


var player = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshLambertMaterial({
	color: "red"
}));
player.position.y = 0.5;
player.castShadow = true;
player.receiveShadow = true;
scene.add(player);




function getHeightData(img) {
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var context = canvas.getContext("2d");

	context.drawImage(img, 0, 0);

	var imgd = context.getImageData(0, 0, canvas.width, canvas.height);
	var pix = imgd.data;

	var data = new Float32Array(canvas.width * canvas.height);

	var j = 0;
	for (var i = 0, n = pix.length; i < n; i += 4) {
		var all = (pix[i] / 255) + (pix[i + 1] / 255) + (pix[i + 2] / 255);
		data[j++] = all / 3;
	}

	return data;
}


var cput;
var cpud = {
	w: 0,
	h: 0
};

var terrain = new THREE.TextureLoader().load("Images/terrain.png", function (img) {
	cput = getHeightData(img.image);
	cpud.w = img.image.width;
	cpud.h = img.image.height;
});
terrain.generateMipmaps = false;
terrain.wrapS = THREE.RepeatWrapping;
terrain.wrapT = THREE.RepeatWrapping;
terrain.magFilter = THREE.LinearFilter;
terrain.minFilter = THREE.LinearFilter;


var tnrm = new THREE.TextureLoader().load("Images/nrm.png");
tnrm.generateMipmaps = terrain.generateMipmaps;
tnrm.wrapS = terrain.wrapS;
tnrm.wrapT = terrain.wrapT;
tnrm.magFilter = terrain.magFilter;
tnrm.minFilter = terrain.minFilter;
tnrm.offset = terrain.offset;


var tao = new THREE.TextureLoader().load("Images/ao.png");
tao.generateMipmaps = terrain.generateMipmaps;
tao.wrapS = terrain.wrapS;
tao.wrapT = terrain.wrapT;
tao.magFilter = terrain.magFilter;
tao.minFilter = terrain.minFilter;
tao.offset = terrain.offset;
tao.repeat.setScalar(1);



var radius = 200;
var altitude = 20;

var ground = new THREE.Mesh(new THREE.RingBufferGeometry(0.001, radius, 400, 400), new THREE.MeshPhongMaterial({
	color: "forestgreen",
	specular: 0x000000,
	map: tao,
	displacementMap: terrain,
	displacementScale: altitude,
	normalMap: tnrm,
	normalScale: new THREE.Vector2().setScalar(altitude),
	//bumpMap: terrain,
	//bumpScale: altitude,
	//flatShading: true,
	//wireframe: true,
}));
ground.rotation.x = deg(-90);
scene.add(ground);

ground.castShadow = true;
ground.receiveShadow = true;

ground.customDepthMaterial = new THREE.MeshDepthMaterial({
	depthPacking: THREE.RGBADepthPacking,
	displacementMap: terrain,
	displacementScale: altitude
});

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

	vc.multiplyScalar(Math.pow(dist, 2) / Math.pow(radius, 2));

	ground.geometry.attributes.position.array[v * 3] = vc.x;
	ground.geometry.attributes.position.array[(v * 3) + 1] = vc.y;
	ground.geometry.attributes.position.array[(v * 3) + 2] = vc.z;




	ground.geometry.attributes.uv.array[v * 2] = (vc.x / (radius * 2)) + 0.5;
	ground.geometry.attributes.uv.array[(v * 2) + 1] = (vc.y / (radius * 2)) + 0.5;
}
ground.geometry.needsUpdate = true;
ground.geometry.attributes.position.needsUpdate = true;
ground.geometry.attributes.uv.needsUpdate = true;
ground.geometry.computeBoundingBox();
ground.geometry.computeBoundingSphere();


console.log(ground.geometry);


scene.add(new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.5));
var s = new THREE.DirectionalLight(0xffffff, 0.5);
s.castShadow = true;
s.shadow.mapSize.width = 1024;
s.shadow.mapSize.height = 1024;
var d = 50;
s.shadow.camera.left = -d;
s.shadow.camera.right = d;
s.shadow.camera.top = d;
s.shadow.camera.bottom = -d;
s.shadow.camera.near = 0;
s.shadow.camera.far = 1000;
s.shadow.radius = 1;
s.target = player;
scene.add(s);


camera.position.z = 20;
camera.position.y = 10;

var t = camera;

var ruv = new THREE.Vector2();
var repeat = new THREE.Vector2(1, 1);

var velocity = new THREE.Vector3();
var tmpv = velocity.clone();

function getHeight(x, y) {
	ruv.x = Math.min(THREE.MathUtils.euclideanModulo(x, cpud.w) | 0, cpud.w - 1);
	ruv.y = Math.min(THREE.MathUtils.euclideanModulo(y, cpud.h) | 0, cpud.h - 1);
	var tc = (ruv.y * cpud.w) + ruv.x;
	return cput[tc] * altitude;
}


function bilinearInterpolator(func, x, y) {
	// "func" is a function that takes 2 integer arguments and returns some value
	var x1 = Math.floor(x);
	var x2 = Math.ceil(x);
	var y1 = Math.floor(y);
	var y2 = Math.ceil(y);

	if ((x1 === x2) && (y1 === y2)) return func(x1, y1);
	if (x1 === x2) {
		return (func(x1, y1) * (y2 - y) + func(x1, y2) * (y - y1)) / (y2 - y1);
	}
	if (y1 === y2) {
		return (func(x1, y1) * (x2 - x) + func(x2, y1) * (x - x1)) / (x2 - x1);
	}

	// else: x1 != x2 and y1 != y2
	return (
			func(x1, y1) * (x2 - x) * (y2 - y) +
			func(x2, y1) * (x - x1) * (y2 - y) +
			func(x1, y2) * (x2 - x) * (y - y1) +
			func(x2, y2) * (x - x1) * (y - y1)
		) /
		((x2 - x1) * (y2 - y1));
}



var animate = function () {
	requestAnimationFrame(animate);

	var delta = c.getDelta();

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




	if (fw === true) {
		tmpv.set(0, 0, -0.00525);
		tmpv.applyQuaternion(player.quaternion);
		velocity.add(tmpv);
	}
	if (bw === true) {
		tmpv.set(0, 0, 0.00525);
		tmpv.applyQuaternion(player.quaternion);
		velocity.add(tmpv);
	}
	if (tr === true) {
		player.rotation.y -= 0.025;
	}
	if (tl === true) {
		player.rotation.y += 0.025;
	}


	var uv = {
		x: ((player.position.x + radius) / (radius * 2)) * tao.repeat.x,
		y: ((player.position.z + radius) / (radius * 2)) * tao.repeat.y
	};

	uv.x *= cpud.w;
	uv.y *= cpud.h;

	var h = bilinearInterpolator(getHeight, uv.x, uv.y);

	//h = 0;


	velocity.y -= 0.01;

	player.position.add(velocity);

	if (player.position.y <= h) {
		player.position.y = h;
		velocity.y = 0;
	}

	velocity.x = THREE.MathUtils.damp(velocity.x, 0, 1.97, delta);
	velocity.z = THREE.MathUtils.damp(velocity.z, 0, 1.97, delta);


	camera.lookAt(player.position.x, player.position.y + 2, player.position.z);
	camera.translateZ(-(camera.position.distanceTo(player.position) - camdistance) / 10);
	camera.lookAt(player.position.x, player.position.y + 1, player.position.z);

	ground.position.set(t.position.x, -0.5, t.position.z);
	terrain.offset.set((t.position.x / (radius * 2)) * tao.repeat.x, (-(t.position.z / (radius * 2))) * tao.repeat.y);

	s.position.set(player.position.x + 1, player.position.y + 2, player.position.z + 1);

	renderer.render(scene, camera);
};

animate();