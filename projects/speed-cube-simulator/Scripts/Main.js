var tau = Math.PI * 2;

function deg(number) {
	return (number * tau) / 360;
}

var camdistance = 0.15;

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
			camdistance -= 0.01;
			break;
		case "-":
			camdistance += 0.01;
			break;
		case "0":
			camdistance = 0.15;
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




var pbar = document.getElementById("pbar");
var ptext = document.getElementById("ptext");








var windowResized = true;
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", function () {windowResized = true;}, false);







var scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeef);
scene.fog = new THREE.FogExp2(scene.background, 1);




var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);














var gravityConstant = 9.8;
var margin = 0.0005;

var core;
var corners = [];
var edges = [];
var centers = [];
var rigidBodies = [];

var physicsMesh;
var physicsBody;

var pos = new THREE.Vector3();
var quat = new THREE.Quaternion();

var piecesToLoad;

Ammo().then(function (Ammo) {
physicsMesh = function (geometry, typea) {
	var triangleMesh = new Ammo.btTriangleMesh();

	var vectA = new Ammo.btVector3(0, 0, 0);
	var vectB = new Ammo.btVector3(0, 0, 0);
	var vectC = new Ammo.btVector3(0, 0, 0);

	var verticesPos = geometry.getAttribute('position').array;
	var triangles = [];
	for (var i = 0; i < verticesPos.length; i += 3) {
		triangles.push({
				x: verticesPos[i + 0],
				y: verticesPos[i + 1],
				z: verticesPos[i + 2]
		})
	}

	for (var i = 0; i < triangles.length - 3; i += 3) {
		vectA.setX(triangles[i].x);
		vectA.setY(triangles[i].y);
		vectA.setZ(triangles[i].z);

		vectB.setX(triangles[i + 1].x);
		vectB.setY(triangles[i + 1].y);
		vectB.setZ(triangles[i + 1].z);

		vectC.setX(triangles[i + 2].x);
		vectC.setY(triangles[i + 2].y);
		vectC.setZ(triangles[i + 2].z);

		triangleMesh.addTriangle(vectA, vectB, vectC, true);
	}

	var shape;
	if (typea == "static") {
		shape = new Ammo.btBvhTriangleMeshShape(triangleMesh, true);
	} else if (typea == "convex") {
		shape = new Ammo.btConvexTriangleMeshShape(triangleMesh, true);
	} else if (typea == "concave") {
		shape = new Ammo.btGImpactMeshShape(triangleMesh);
		shape.updateBound();
	}
	geometry.verticesNeedUpdate = true;

	return shape;
};

physicsBody = function (obj, shape, mass) {
	shape.setMargin(margin);
	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(obj.position.x, obj.position.y, obj.position.z));
	transform.setRotation(new Ammo.btQuaternion(obj.quaternion.x, obj.quaternion.y, obj.quaternion.z, obj.quaternion.w));
	var motionState = new Ammo.btDefaultMotionState(transform);

	var localInertia = new Ammo.btVector3(0, 0, 0);
	shape.calculateLocalInertia(mass, localInertia);

	var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
	var body = new Ammo.btRigidBody(rbInfo);
	body.setFriction(0.1);

	if (mass > 0) {
		body.setActivationState(4);
	}

	return body;
};


var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
var broadphase = new Ammo.btDbvtBroadphase();
var solver = new Ammo.btSequentialImpulseConstraintSolver();
physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
physicsWorld.setGravity(new Ammo.btVector3(0, -gravityConstant, 0));

//Ammo.btGImpactCollisionAlgorithm.prototype.registerAlgorithm(dispatcher);


transformAux1 = new Ammo.btTransform();












var ABS = new THREE.MeshStandardMaterial({
	roughness: 0.2,
	fog: false,
	flatShading: true
});

/*ABS.onBeforeCompile = function (shader) {
	shader.fragmentShader = shader.fragmentShader.replace("#include <normal_fragment_maps>", `
		#include <normal_fragment_maps>
		vec3 cubeColors = vec3(1.0);
		vec3 worldNormal = inverseTransformDirection(normal, viewMatrix);
		cubeColors = mix(cubeColors, vec3(1.0, 1.0, 0.0), max(dot(worldNormal, vec3(0, -1, 0)), 0.0));
		cubeColors = mix(cubeColors, vec3(1.0, 0.0, 0.0), max(dot(worldNormal, vec3(0, 0, 1)), 0.0));
		cubeColors = mix(cubeColors, vec3(1.0, 0.5, 0.0), max(dot(worldNormal, vec3(0, 0, -1)), 0.0));
		cubeColors = mix(cubeColors, vec3(0.0, 0.0, 1.0), max(dot(worldNormal, vec3(1, 0, 0)), 0.0));
		cubeColors = mix(cubeColors, vec3(0.0, 1.0, 0.0), max(dot(worldNormal, vec3(-1, 0, 0)), 0.0));
		diffuseColor = mapTexelToLinear(vec4(cubeColors, 1.0));
	`);
	console.log(shader.fragmentShader);
};*/


var stll = new THREE.STLLoader();

var modifier = new THREE.SimplifyModifier();

var extractData = function (object) {
	var matrixWorld = new THREE.Matrix4().elements;
	var vertices = [];
	var matrices = [];
	var indexes = [];
	TTA.iterateGeometries(object, {}, function (vertexArray, matrixArray, indexArray) {
		vertices.push(vertexArray);
		matrices.push(matrixArray);
		indexes.push(indexArray);
	})

	return { vertices, matrices, indexes, matrixWorld };
}

piecesToLoad = 4;
pbar.max = 1;

var simplamount = 0.14;

ptext.innerHTML = "Loading pieces...";
stll.load("Models/Corner.stl", function (stl) {
	stl.scale(0.001, 0.001, 0.001);

	var center = new THREE.Vector3();
	stl.computeBoundingBox();
	stl.boundingBox.getCenter(center);

	stl.center();

	//stl = modifier.modify(stl, Math.floor(stl.attributes.position.count * simplamount));

	ptext.innerHTML = "Generating corner physics collider...";
	//var pmesh = physicsMesh(stl, "convex");
	var d = extractData(new THREE.Mesh(stl, new THREE.MeshBasicMaterial()));
	var pmesha = TTA.createCollisionShapes(d.vertices, d.matrices, d.indexes, d.matrixWorld, {type: TTA.TYPE.VHACD});
	console.log(pmesha);
	var pmesh = new Ammo.btCompoundShape();
	var tmpt = new Ammo.btTransform();
	tmpt.setIdentity();
	for (var i = 0; i < pmesha.length; i++) {
		pmesha[i].setMargin(margin);
		pmesh.addChildShape(tmpt, pmesha[i]);
	}
	console.log(pmesh);

	var cornerRotations = [
		new THREE.Euler(0, 0, 0),
		new THREE.Euler(deg(90), 0, 0),
		new THREE.Euler(-deg(90), 0, 0),
		new THREE.Euler(deg(180), 0, 0),
		new THREE.Euler(0, deg(90), 0),
		new THREE.Euler(0, deg(180), 0),
		new THREE.Euler(0, 0, deg(180)),
		new THREE.Euler(deg(90), 0, deg(180)),
	];

	for (var i = 0; i < 8; i++) {
		corners[i] = new THREE.Mesh(stl, ABS);
		corners[i].rotation.copy(cornerRotations[i]);
		corners[i].position.copy(center);
		corners[i].position.applyEuler(cornerRotations[i]);
		//corners[i].position.y += i * 0.1;
		corners[i].castShadow = true;
		corners[i].receiveShadow = true;
		scene.add(corners[i]);

		corners[i].userData.physicsBody = physicsBody(corners[i], pmesh, 0.002);
		physicsWorld.addRigidBody(corners[i].userData.physicsBody);

		rigidBodies.push(corners[i]);
	}
	piecesToLoad -= 1;
	pbar.value = ((4 - piecesToLoad) / 4);
});

stll.load("Models/Edge.stl", function (stl) {
	stl.scale(0.001, 0.001, 0.001);

	var center = new THREE.Vector3();
	stl.computeBoundingBox();
	stl.boundingBox.getCenter(center);

	stl.center();

	//stl = modifier.modify(stl, Math.floor(stl.attributes.position.count * simplamount));

	ptext.innerHTML = "Generating edge physics collider...";
	//var pmesh = physicsMesh(stl, "convex");
	var d = extractData(new THREE.Mesh(stl, new THREE.MeshBasicMaterial()));
	var pmesha = TTA.createCollisionShapes(d.vertices, d.matrices, d.indexes, d.matrixWorld, {type: TTA.TYPE.VHACD});
	console.log(pmesha);
	var pmesh = new Ammo.btCompoundShape();
	var tmpt = new Ammo.btTransform();
	tmpt.setIdentity();
	for (var i = 0; i < pmesha.length; i++) {
		pmesha[i].setMargin(margin);
		pmesh.addChildShape(tmpt, pmesha[i]);
	}
	console.log(pmesh);

	var edgeRotations = [
		new THREE.Euler(0, 0, 0),
		new THREE.Euler(deg(90), 0, 0),
		new THREE.Euler(-deg(90), 0, 0),
		new THREE.Euler(deg(180), 0, 0),
		new THREE.Euler(0, -deg(90), 0),
		new THREE.Euler(0, deg(180), 0),
		new THREE.Euler(0, 0, deg(90)),
		new THREE.Euler(0, 0, -deg(90)),
		new THREE.Euler(deg(180), 0, deg(90)),
		new THREE.Euler(deg(180), 0, -deg(90)),
		new THREE.Euler(deg(-90), 0, deg(180)),
		new THREE.Euler(deg(90), 0, deg(180))
	];

	for (var i = 0; i < 12; i++) {
		edges[i] = new THREE.Mesh(stl, ABS);
		edges[i].rotation.copy(edgeRotations[i]);
		edges[i].position.copy(center);
		edges[i].position.applyEuler(edgeRotations[i]);
		//edges[i].position.y += i * 0.1;
		edges[i].castShadow = true;
		edges[i].receiveShadow = true;
		scene.add(edges[i]);

		edges[i].userData.physicsBody = physicsBody(edges[i], pmesh, 0.002);
		physicsWorld.addRigidBody(edges[i].userData.physicsBody);
		rigidBodies.push(edges[i]);
	}
	piecesToLoad -= 1;
	pbar.value = ((4 - piecesToLoad) / 4);
});

stll.load("Models/Center.stl", function (stl) {
	stl.scale(0.001, 0.001, 0.001);
	ptext.innerHTML = "Generating center physics collider...";

	//stl = modifier.modify(stl, Math.floor(stl.attributes.position.count * 0.15));

	var pmesh = physicsMesh(stl, "static");

	var centerRotations = [
		new THREE.Euler(0, 0, 0),
		new THREE.Euler(-deg(90), 0, 0),
		new THREE.Euler(deg(90), 0, 0),
		new THREE.Euler(0, -deg(90), 0),
		new THREE.Euler(0, deg(90), 0),
		new THREE.Euler(0, deg(180), 0),
	];

	for (var i = 0; i < 6; i++) {
		centers[i] = new THREE.Mesh(stl, ABS);
		centers[i].rotation.copy(centerRotations[i]);
		centers[i].castShadow = true;
		centers[i].receiveShadow = true;
		scene.add(centers[i]);

		centers[i].userData.physicsBody = physicsBody(centers[i], pmesh, 0);
		physicsWorld.addRigidBody(centers[i].userData.physicsBody);
		//rigidBodies.push(centers[i]);
	}
	piecesToLoad -= 1;
	pbar.value = ((4 - piecesToLoad) / 4);
});

stll.load("Models/Core.stl", function (stl) {
	/*stl.scale(0.001, 0.001, 0.001);
	core = new THREE.Mesh(stl, ABS);
	core.castShadow = true;
	core.receiveShadow = true;
	scene.add(core);

	ptext.innerHTML = "Generating core physics collider...";

	var pmesh = physicsMesh(stl, "static");

	core.userData.physicsBody = physicsBody(core, pmesh, 0);
	physicsWorld.addRigidBody(core.userData.physicsBody);*/
	//rigidBodies.push(core);
	piecesToLoad -= 1;
	pbar.value = ((4 - piecesToLoad) / 4);
});

//scene.add(new THREE.Mesh(new THREE.BoxBufferGeometry(0.057, 0.057, 0.057), new THREE.MeshBasicMaterial({wireframe: true})));


var ground = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 1, 10), new THREE.MeshPhongMaterial({color: 0xbbbbbb}));
ground.position.y = -0.55;
ground.receiveShadow = true;
//ground.castShadow = true;
scene.add(ground);

var shape = new Ammo.btBoxShape(new Ammo.btVector3(10 / 2, 1 / 2, 10 / 2));
shape.setMargin(margin);

ground.userData.physicsBody = physicsBody(ground, shape, 0);
//ground.userData.physicsBody.setActivationState(4);
physicsWorld.addRigidBody(ground.userData.physicsBody);

});




var light = new THREE.HemisphereLight(0xffffff, 0x999999, 0.75);
scene.add(light);

var sun = new THREE.DirectionalLight(0xffffff, 0.6);
sun.position.set(1.5, 1, 1.25);
sun.castShadow = true;
sun.shadow.mapSize.width = 256;
sun.shadow.mapSize.height = 256;
var d = 0.125;
sun.shadow.camera.left = - d;
sun.shadow.camera.right = d;
sun.shadow.camera.top = d;
sun.shadow.camera.bottom = - d;
sun.shadow.camera.near = 0;
sun.shadow.camera.far = 5;
sun.shadow.radius = 2;
scene.add(sun);

var sun2 = sun.clone();
sun2.position.set(-sun2.position.x, sun2.position.y, -sun2.position.z);
scene.add(sun2);

var sun3 = sun.clone();
sun3.position.set(sun3.position.x, sun3.position.y, -sun3.position.z);
scene.add(sun3);

var sun4 = sun.clone();
sun4.position.set(-sun4.position.x, sun4.position.y, sun4.position.z);
scene.add(sun4);

var sun5 = sun.clone();
sun5.position.set(0, sun5.position.y, sun5.position.z);
scene.add(sun5);

var sun6 = sun.clone();
sun6.position.set(0, sun6.position.y, -sun6.position.z);
scene.add(sun6);

var sun7 = sun.clone();
sun7.position.set(sun7.position.x, sun7.position.y, 0);
scene.add(sun7);

var sun8 = sun.clone();
sun8.position.set(-sun8.position.x, sun8.position.y, 0);
scene.add(sun8);

var sun9 = sun.clone();
sun9.position.set(0, sun9.position.y, 0);
scene.add(sun9);

camera.position.z = 0.2;
camera.position.y = 0.1;



var quaternionTrack = [];
var positionTrack = [];
var simulength = 300;
var tindex = 0;


var simmax = simulength;

var animate = function () {
	requestAnimationFrame(animate);

	if (windowResized) {
		onWindowResize();
		windowResized = false;
	}

	if (piecesToLoad == 0) {
	if (simulength > 0) {
		if (physicsWorld && simulength < 1000) {
			physicsWorld.stepSimulation(1/60, 10000);
		}

		var posframe = [];
		var quatframe = [];
		for (var i = 0; i < rigidBodies.length; i++) {
			var ms = rigidBodies[i].userData.physicsBody.getMotionState();
			if (ms) {
				ms.getWorldTransform(transformAux1);
				var p = transformAux1.getOrigin();
				var q = transformAux1.getRotation();
				rigidBodies[i].position.set(p.x(), p.y(), p.z());
				rigidBodies[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
				posframe[i] = new THREE.Vector3();
				posframe[i].copy(rigidBodies[i].position);
				quatframe[i] = new THREE.Quaternion();
				quatframe[i].copy(rigidBodies[i].quaternion);
			}
		}
		if (posframe.length > 0 && quatframe.length > 0) { 
			positionTrack.push(posframe);
			quaternionTrack.push(quatframe);
			simulength --;
			pbar.value = ((simmax - simulength) / simmax);
			ptext.innerHTML = "Simulating (" + Math.round((pbar.value / pbar.max) * 100) + "%)...";
		}
		edges[0].userData.physicsBody.applyCentralForce(new Ammo.btVector3(0, 0.01, 0));
		edges[3].userData.physicsBody.applyCentralForce(new Ammo.btVector3(0, -0.01, 0));
		edges[1].userData.physicsBody.applyCentralForce(new Ammo.btVector3(0, 0, 0.01));
		edges[2].userData.physicsBody.applyCentralForce(new Ammo.btVector3(0, 0, -0.01));
	} else {
		if (tindex >= positionTrack.length) {
			tindex = 0;
		}

		for (var i = 0; i < rigidBodies.length; i++) {
			try {
				rigidBodies[i].position.copy(positionTrack[tindex][i]);
			} catch (e) {}
			try {
				rigidBodies[i].quaternion.copy(quaternionTrack[tindex][i]);
			} catch (e) {}
		}

		tindex ++;
		pbar.value = (tindex / simmax);
		ptext.innerHTML = "Replaying (" + Math.round((pbar.value / pbar.max) * 100) + "%)...";
	}
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
	camera.translateZ(-(camera.position.distanceTo(scene.position) - camdistance) / 2);

	renderer.render(scene, camera);
};

animate();
