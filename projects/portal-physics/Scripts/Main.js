var tau = 6.28318530717958637692528;

THREE.MathUtils.damp = function (x, y, lambda, dt) {
	return THREE.MathUtils.lerp(x, y, 1 - Math.exp(-lambda * dt));
};

var camdistance = 3;

var orbitUp, orbitDown, orbitLeft, orbitRight;
var moveUp, moveDown, moveleft, moveRight, jump;

var antigrav = false;

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
			camdistance /= 1.1;
			break;
		case "NumpadSubtract":
			camdistance *= 1.1;
			break;
		case "Numpad0":
			camdistance = 3;
			break;

		case "KeyW":
			moveUp = true;
			break;
		case "KeyS":
			moveDown = true;
			break;
		case "KeyA":
			moveleft = true;
			break;
		case "KeyD":
			moveRight = true;
			break;
		case "Space":
			jump = true;
			break;

		case "KeyF":
			antigrav = !antigrav;
			break;

		case "KeyC":
			portal.visible = false;
			portal2.visible = false;
			var tmp = renderer.getClearColor();
			renderer.setClearColor(0);
			renderer.setRenderTarget(prt);
			renderer.clear();
			renderer.setRenderTarget(prt2);
			renderer.clear();
			renderer.setRenderTarget(prta);
			renderer.clear();
			renderer.setRenderTarget(prt2a);
			renderer.clear();
			renderer.setRenderTarget(null);
			renderer.setClearColor(tmp);
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
			moveUp = false;
			break;
		case "KeyS":
			moveDown = false;
			break;
		case "KeyA":
			moveleft = false;
			break;
		case "KeyD":
			moveRight = false;
			break;
		case "Space":
			jump = false;
			break;
	}
};
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);





var stats = new Stats(0.1);
document.body.appendChild(stats.dom);

var DCPanel = new Stats.Panel("DC", "#f88", "#211");
stats.addPanel(DCPanel);



var windowResized = true;

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", function () {
	windowResized = true;
}, false);



THREE.BufferGeometry.prototype.computeBoundsTree = MeshBVHLib.computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = MeshBVHLib.disposeBoundsTree;
THREE.Mesh.prototype.raycast = MeshBVHLib.acceleratedRaycast;


var scene = new THREE.Scene();






var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);

var renderer = new THREE.WebGLRenderer({
	antialias: false
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.info.autoReset = false;
document.body.appendChild(renderer.domElement);







// Sky
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
var my_gradient = ctx.createLinearGradient(0, 512, 0, 0);
c.width = 1024;
c.height = 512;
my_gradient.addColorStop(0.95, "#4c77a2");
my_gradient.addColorStop(0.54, "#add8ff");
my_gradient.addColorStop(0.5, "#ffffff");
my_gradient.addColorStop(0.48, "#bcc6cc");
ctx.fillStyle = my_gradient;
ctx.fillRect(0, 0, 1024, 512);

var cskytex = new THREE.CanvasTexture(c);
var skytex = new THREE.WebGLCubeRenderTarget(cskytex.image.height);
skytex.fromEquirectangularTexture(renderer, cskytex);

scene.background = skytex;
scene.environment = skytex.texture;








function ditherShaderPatch(shader) {
	/*shader.fragmentShader = shader.fragmentShader.replace("#include <fog_pars_fragment>", "varying float fogDepth;").replace("}", `
		if ((fogDepth - 0.5) + (sqrt(rand(gl_FragCoord.xy / 1920.0) * 0.5)) < 1.0) {
			discard;
		}
	}`);
	//console.log(shader.vertexShader);
	shader.vertexShader = shader.vertexShader.replace("#include <fog_vertex>", "fogDepth = -mvPosition.z;").replace("#include <fog_pars_vertex>", "varying float fogDepth;");*/
}





var sr = 0.5;

var Earth = new THREE.Mesh(new THREE.SphereBufferGeometry(sr, 32, 16), new THREE.MeshStandardMaterial({
	map: new THREE.TextureLoader().load("Images/Earth.png"),
	emissive: 0x00ffff,
	emissiveMap: new THREE.TextureLoader().load("Images/grid.png"),
	emissiveIntensity: 0,
	roughness: 0.5
}));
//Earth.material.map.encoding = THREE.sRGBEncoding;
Earth.material.onBeforeCompile = ditherShaderPatch;

Earth.castShadow = true;
Earth.receiveShadow = true;

Earth.position.y = 15.5;

Earth.userData.onground = false;
Earth.userData.vel = new THREE.Vector3();
Earth.userData.rotAxis = new THREE.Vector3(0, 1, 0);
Earth.userData.rotVel = 1;

Earth.userData.shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({
	map: new THREE.TextureLoader().load("Images/roundshadow.png"),
	transparent: true,
	//side: THREE.DoubleSide,
	depthWrite: false,
	blending: THREE.SubtractiveBlending
}));
Earth.userData.shadow.material.map.encoding = THREE.sRGBEncoding;
Earth.userData.shadow.material.onBeforeCompile = function (shader) {
	//console.log(shader.fragmentShader);
	shader.vertexShader = shader.vertexShader.replace("}", `
		gl_Position.z -= 0.01;
	}`);
	shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `
	#ifdef USE_MAP
		vec4 texelColor = texture2D( map, vUv );
		texelColor = vec4(1.0 - texelColor.rgb, texelColor.a);
		texelColor = mapTexelToLinear( texelColor );
		diffuseColor *= texelColor;
	#endif`);
}
scene.add(Earth.userData.shadow);
scene.add(Earth);




var pEarth = Earth.clone();
pEarth.matrixAutoUpdate = false;
pEarth.userData.shadow = Earth.userData.shadow.clone();
pEarth.userData.shadow.matrixAutoUpdate = false;
scene.add(pEarth.userData.shadow);
scene.add(pEarth);



THREE.Vector3.prototype.transformLocalVector = function(m) {
	// input: THREE.Matrix4 affine matrix
	// vector interpreted as a direction

	var x = this.x, y = this.y, z = this.z;
	var e = m.elements;

	this.x = e[0] * x + e[4] * y + e[8] * z;
	this.y = e[1] * x + e[5] * y + e[9] * z;
	this.z = e[2] * x + e[6] * y + e[10] * z;

	return this;
}

THREE.Vector3.prototype.directionTo = function(v) {
	return this.set(v.x - this.x, v.y - this.y, v.z - this.z).normalize();
}




var pr = 2;
var prtr = 512;
var portalcam = camera.clone();
portalcam.aspect = 1;
portalcam.updateProjectionMatrix();

var tm4 = new THREE.Matrix4();
var portalTransform = new THREE.Vector3(-1, 1, -1);

var tlc = new THREE.Vector3();
var blc = new THREE.Vector3();
var brc = new THREE.Vector3();
var reflectedPosition = new THREE.Vector3();


var prt = new THREE.WebGLRenderTarget(prtr, prtr, {
	depthBuffer: true
});
var prta = new THREE.WebGLRenderTarget(prtr, prtr, {
	depthBuffer: true
});
prt.texture.encoding = renderer.outputEncoding;
prta.texture.encoding = renderer.outputEncoding;
var portal = new THREE.Mesh(new THREE.CircleBufferGeometry(pr, 32), new THREE.MeshBasicMaterial({
	map: prt.texture
}));
portal.geometry.computeBoundingBox();
portal.matrixAutoUpdate = false;
portal.geometry.computeBoundsTree();
portal.rotation.y = -tau / 4;
portal.position.set(4, 16, 0);
scene.add(portal);
portal.add(new THREE.Mesh(new THREE.TorusGeometry(pr, 0.1, 8, 32), new THREE.MeshBasicMaterial({color: 0x0080ff})));
portal.updateMatrix();
portal.onBeforeRender = function (rend, scen, cam) {
	if (cam.uuid == camera.uuid) {
		this.userData.visibleToCamera = true;
	}
};



var prt2 = new THREE.WebGLRenderTarget(prtr, prtr, {
	depthBuffer: true
});
var prt2a = new THREE.WebGLRenderTarget(prtr, prtr, {
	depthBuffer: true
});
prt2.texture.encoding = renderer.outputEncoding;
prt2a.texture.encoding = renderer.outputEncoding;
var portal2 = new THREE.Mesh(portal.geometry, new THREE.MeshBasicMaterial({
	map: prt2.texture
}));
portal2.geometry.computeBoundingBox();
//portal2.scale.setScalar(0.5);
portal2.matrixAutoUpdate = false;
portal2.rotation.y = tau / 4;
portal2.position.set(-4, 16, 0);
scene.add(portal2);
portal2.add(new THREE.Mesh(portal.children[0].geometry, new THREE.MeshBasicMaterial({color: 0xff8000})));
portal2.updateMatrix();
portal2.onBeforeRender = portal.onBeforeRender;


var portals = [portal, portal2];
var raycaster = new THREE.Raycaster();
var tm4 = new THREE.Matrix4();

//scene.add(new THREE.CameraHelper(portalcam));






var geo = [];
var tmpobj = new THREE.Object3D();

var g;

new THREE.GLTFLoader().load("./Models/world.glb", function (obj) {
	//console.log(obj);
	var tmp = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(20, 7.5, 256, 32), new THREE.MeshBasicMaterial());
	tmp.geometry.translate(0, 60, 0);
	tmp.userData.data = "physics";
	obj.scene.add(tmp);
	var tmp = new THREE.Mesh(tmp.geometry, new THREE.MeshStandardMaterial({
		map: new THREE.TextureLoader().load("Images/uv_grid_opengl.jpg"),
		roughness: 0.5
	}));
	obj.scene.add(tmp);
	obj.scene.traverse(function (obj) {
		if (obj.material) {
			if (obj.material.name == "ocean") {
				obj.material.color = new THREE.Color("skyblue");
			}
			if (obj.userData.data === "physics") {
				obj.visible = false;
				var tmpg = obj.geometry.clone();
				obj.geometry.dispose();
				try {
				delete tmpg.attributes.uv;
				} catch (e) { }
				try {
				delete tmpg.attributes.uv2;
				} catch (e) { }
				try {
				delete tmpg.attributes.normal;
				} catch (e) { }
				obj.updateMatrixWorld();
				tmpg.applyMatrix4(obj.matrixWorld);
				geo.push(tmpg);
			} else {
				obj.material.side = THREE.FrontSide;
				//obj.material.wireframe = true;
				obj.material.roughness = 0.5;
				obj.material.onBeforeCompile = ditherShaderPatch;
			}
			if (obj.isSkinnedMesh || obj.isMesh) {
				obj.receiveShadow = true;
				obj.castShadow = true;
			}
		}
	});
	g = new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(geo), new THREE.MeshStandardMaterial({color: 0x808080}));
	g.geometry.computeBoundsTree();
	g.geometry.computeVertexNormals();
	var h = new MeshBVHLib.MeshBVHVisualizer(g, 1000000);
	h.displayParents = true;
	h.opacity = 1;
	h.edgeMaterial.linewidth = 1;
	h.update();
	//scene.add(h);
	//g.receiveShadow = true;
	//g.castShadow = true;
	//scene.add(g);
	scene.add(obj.scene);
	console.log(g);
});





scene.add(new THREE.HemisphereLight(0x333344, 0x444455, 1.25));

var s = new THREE.DirectionalLight(0xffffdd, 1.5);
s.castShadow = true;
s.shadow.mapSize.width = 2048;
s.shadow.mapSize.height = 2048;
var d = 50;
s.shadow.camera.left = -d;
s.shadow.camera.right = d;
s.shadow.camera.top = d;
s.shadow.camera.bottom = -d;
s.shadow.camera.near = 0;
s.shadow.camera.far = 100;
s.shadow.radius = 1;
s.target = Earth;
scene.add(s);

//scene.add(new THREE.CameraHelper(s.shadow.camera));

camera.position.z = -20;
camera.position.y = 10;

var vv = new THREE.Vector3();
var acv = vv.clone();

var cl = new THREE.Clock();

var speed = 0.025;

/*var pr = 1;

var lt = 0;*/

/*(function () {
	var t = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 2048, 2048), new THREE.MeshNormalMaterial());
	t.position.y = 15;
	scene.add(t);
})();*/

var tcp = new THREE.Vector3();

//Earth.matrixAutoUpdate = false;

var tt = {
	value: 0
};

var dir = new THREE.Vector2();

var anim = false;

var rfa;
var lfa;


function collideSphere(sphere, radius) {
	if (!g) {
		return;
	}
	var isa = g.geometry.boundsTree.closestPointToPoint(sphere.position);
	if (sphere.userData.shadow) {
		sphere.userData.shadow.position.copy(isa.point);
	}
	var is = MeshBVHLib.getTriangleHitPointInfo(isa.point, g.geometry, isa.faceIndex);

	isa.face = {normal: sphere.position.clone().sub(isa.point).normalize()};
	if (isa.face.normal.dot(is.face.normal) < 0) {
		isa.face.normal.negate();
	}

	if (sphere.userData.shadow) {
		sphere.userData.shadow.lookAt(sphere.userData.shadow.position.x + isa.face.normal.x, sphere.userData.shadow.position.y + isa.face.normal.y, sphere.userData.shadow.position.z + isa.face.normal.z);
	}

	sphere.userData.onground = false;

	if (portal.visible == true && portal2.visible == true) {
		raycaster.ray.origin.copy(sphere.position);
		raycaster.ray.direction.copy(isa.point).sub(raycaster.ray.origin);
		raycaster.far = raycaster.ray.direction.length();
		raycaster.ray.origin.addScaledVector(raycaster.ray.direction, -0.01);
		if (raycaster.intersectObjects(portals, false)[0]) {
			isa.distance = Infinity;
			if (sphere.userData.shadow) {
				sphere.userData.shadow.visible = false;
			}
		} else {
			if (sphere.userData.shadow) {
				sphere.userData.shadow.visible = true;
			}
		}
	} else {
		sphere.userData.shadow.visible = true;
	}
	if (isa.distance < radius) {
		sphere.position.addScaledVector(isa.face.normal, Math.max(radius - isa.distance, 0));
		if (sphere.userData.vel) {
			sphere.userData.vel.addScaledVector(isa.face.normal, -isa.face.normal.dot(sphere.userData.vel));
		}
		if (sphere.userData.rotAxis) {
			sphere.userData.rotAxis.copy(isa.face.normal).cross(sphere.userData.vel).normalize();
		}
		if (sphere.userData.rotVel) {
			sphere.userData.rotVel = Math.max(sphere.userData.vel.length() / (radius * tau) * tau, 0.000001);
		}
		/*if (sphere.userData.vel) {
			sphere.userData.vel.multiplyScalar(0.9);
		}*/
		sphere.userData.onground = true;
	}
	return isa;
}


var clipPlane = new THREE.Plane();
renderer.clippingPlanes = [clipPlane];

function renderPortal(thisPortalMesh, otherPortalMesh, thisPortalTexture) {

	// set the portal camera position to be reflected about the portal plane
	thisPortalMesh.worldToLocal(reflectedPosition.copy(camera.position));
	reflectedPosition.x *= - 1.0; reflectedPosition.z *= - 1.0;
	otherPortalMesh.localToWorld(reflectedPosition);
	portalcam.position.copy(reflectedPosition);

	// grab the corners of the other portal
	// - note: the portal is viewed backwards; flip the left/right coordinates
	otherPortalMesh.localToWorld(blc.set( pr, - pr, 0.0));
	otherPortalMesh.localToWorld(brc.set( - pr, - pr, 0.0));
	otherPortalMesh.localToWorld(tlc.set( pr, pr, 0.0));

	// set the projection matrix to encompass the portal's frame
	frameCorners(portalcam, blc, brc, tlc, false);


	otherPortalMesh.getWorldDirection(tcp);
	clipPlane.setFromNormalAndCoplanarPoint(tcp, otherPortalMesh.position.clone().addScaledVector(tcp, -0.1));
	// render the portal
	renderer.setRenderTarget(thisPortalTexture);
	renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897
	if (renderer.autoClear === false) renderer.clear();
	//thisPortalMesh.visible = false; // hide this portal from its own rendering
	renderer.render(scene, portalcam);
	//thisPortalMesh.visible = true; // re-enable this portal's visibility for general rendering
}


function teleport(x, y, z) {
	tcp.copy(camera.position);
	tcp.sub(Earth.position);
	Earth.position.set(x, y, z);
	tcp.add(Earth.position);
	camera.position.copy(tcp);
}



var pointer = new THREE.Vector2();
window.addEventListener("pointermove", function (event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

var launch = 0;
window.addEventListener("mousedown", function (event) {
	event.preventDefault();
	if (event.button == 0) {
		launch = 1;
	} else if (event.button == 2) {
		launch = 2;
	}
});
document.body.oncontextmenu = function (e) { return false; };


var ct = new THREE.Vector3();


var ping = false;
var animate = function () {
	requestAnimationFrame(animate);

	if (windowResized == true) {
		onWindowResize();
		windowResized = false;
	}

	/*var pn = performance.now();
	if (pn - lt > (1000/57)) {
		pr /= 1.1;
	} else if (pn - lt < (1000/57)) {
		pr *= 1.1;
	}
	lt = pn;
	pr = THREE.MathUtils.clamp(pr, 0.01, 1);

	shaderMaterial.uniforms.size.value.set(window.innerWidth * pr, window.innerHeight * pr);
	renderer.setPixelRatio(pr);*/

	var delta = 1 / 60; //cl.getDelta();

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


	acv.setScalar(0);
	if (moveUp === true) {
		camera.getWorldDirection(vv);
		vv.y = 0;
		acv.add(vv);
	}
	if (moveDown === true) {
		camera.getWorldDirection(vv);
		vv.set(-vv.x, 0, -vv.z);
		acv.add(vv);
	}
	if (moveRight === true) {
		camera.getWorldDirection(vv);
		vv.set(-vv.z, 0, vv.x);
		acv.add(vv);
	}
	if (moveleft === true) {
		camera.getWorldDirection(vv);
		vv.set(vv.z, 0, -vv.x);
		acv.add(vv);
	}
	if (moveUp === true || moveDown === true || moveleft === true || moveRight === true) {
		acv.setLength(speed);
		Earth.userData.vel.addScaledVector(acv, 1/4);
		/*if (anim == false) {
			rfa = new TWEEN.Tween(Earth.getObjectByName("L_FootJ").position).to({
				z: 0,
				y: [-0.2, -0.4]
			}, 100).easing(TWEEN.Easing.Cubic.Out).chain(new TWEEN.Tween(Earth.getObjectByName("L_FootJ").position).to({
				z: -0.3,
				y: [-0.4, -0.2]
			}, 100).easing(TWEEN.Easing.Cubic.Out).onComplete(function () {
				rfa.start();
			})).start();

			lfa = new TWEEN.Tween(Earth.getObjectByName("R_FootJ").position).to({
				z: -0.3,
				y: [-0.4, -0.2]
			}, 100).easing(TWEEN.Easing.Cubic.Out).chain(new TWEEN.Tween(Earth.getObjectByName("R_FootJ").position).to({
				z: 0,
				y: [-0.2, -0.4]
			}, 100).easing(TWEEN.Easing.Cubic.Out).onComplete(function () {
				lfa.start();
			})).start();

			anim = true;
		}*/
	}/* else {
		if (rfa) {
			rfa.stop();
			rfa.to({
				z: -0.1,
				y: -0.4
			}, 100).start();
		}
		if (lfa) {
			lfa.stop();
			lfa.to({
				z: -0.1,
				y: -0.4
			}, 100).start();
		}
		anim = false;
	}*/




	if (launch != 0) {
		if (launch == 1) {
			var targetportal = portal;
		} else if (launch == 2) {
			var targetportal = portal2;
		}
		raycaster.far = Infinity;
		raycaster.setFromCamera(pointer, camera);
		var intersect = raycaster.intersectObject(g, false)[0];
		if (intersect) {
			targetportal.visible = true;
			targetportal.position.copy(intersect.point).addScaledVector(intersect.face.normal, 0.1);
			targetportal.updateMatrix();
			targetportal.lookAt(intersect.point.x + intersect.face.normal.x, intersect.point.y + intersect.face.normal.y, intersect.point.z + intersect.face.normal.z);
			targetportal.updateMatrix();
			targetportal.updateMatrixWorld();
			targetportal.userData.visibleToCamera = true;
		}
		launch = 0;
	}




	if (portal.visible == true && portal2.visible == true) {
		raycaster.ray.origin.copy(Earth.position);
	}
	Earth.position.add(Earth.userData.vel);
	if (portal.visible == true && portal2.visible == true) {
		raycaster.ray.direction.copy(Earth.position).sub(raycaster.ray.origin);
		raycaster.far = raycaster.ray.direction.length();
		raycaster.ray.direction.normalize();
		raycaster.ray.origin.addScaledVector(raycaster.ray.direction, -0.01);

		var intersect = raycaster.intersectObjects(portals, false)[0];

		if (intersect) {
				if (intersect.object.uuid == portal.uuid) {
					var entry = portal;
					var exit = portal2;
				} else if (intersect.object.uuid == portal2.uuid) {
					var entry = portal2;
					var exit = portal;
				}
				tm4.getInverse(entry.matrixWorld);

				Earth.applyMatrix4(tm4);
				Earth.userData.vel.transformLocalVector(tm4);
				Earth.userData.rotAxis.transformLocalVector(tm4);
				camera.applyMatrix4(tm4);
				camera.up.transformLocalVector(tm4);
				var fs = tm4.getMaxScaleOnAxis();
				sr *= fs;
				camdistance *= fs;

				tm4.copy(exit.matrixWorld);
				tm4.scale(portalTransform);

				Earth.applyMatrix4(tm4);
				Earth.userData.vel.transformLocalVector(tm4);
				Earth.userData.rotAxis.transformLocalVector(tm4);
				camera.applyMatrix4(tm4);
				camera.up.transformLocalVector(tm4);
				fs = tm4.getMaxScaleOnAxis();
				sr *= fs;
				camdistance *= fs;
		}
	}


	var is = collideSphere(Earth, sr);





	if (antigrav) {
		Earth.userData.vel.addScaledVector(is.face.normal, -delta);
	} else {
		Earth.userData.vel.y -= delta;
	}

	/*Earth.userData.vel.x = THREE.MathUtils.damp(Earth.userData.vel.x, 0, 10, delta);
	Earth.userData.vel.z = THREE.MathUtils.damp(Earth.userData.vel.z, 0, 10, delta);*/


	if (Earth.position.y < 0) {
		teleport(Math.random() - 0.5, 15.5 + Math.random(), Math.random() - 0.5);
		Earth.userData.vel.y = 0;
	}


	if (antigrav) {
		camera.up.lerp(is.face.normal, 1/100);
		Earth.material.emissiveIntensity = THREE.MathUtils.lerp(Earth.material.emissiveIntensity, 2, 1/5);
	} else {
		camera.up.lerp(Earth.up, 1/100);
		Earth.material.emissiveIntensity = THREE.MathUtils.lerp(Earth.material.emissiveIntensity, 0, 1/5);
	}


	if (jump == true) {
		if (Earth.userData.onground == true) {
			if (antigrav) {
				Earth.userData.vel.addScaledVector(is.face.normal, 0.4);
			} else {
				Earth.userData.vel.y += 0.4;
			}
		}
	}




	Earth.rotateOnWorldAxis(Earth.userData.rotAxis, Earth.userData.rotVel);



	//ct.lerp(Earth.position, 0.01);
	ct.copy(Earth.position);
	if (antigrav) {
		Earth.userData.shadow.material.blending = THREE.AdditiveBlending;
		Earth.userData.shadow.material.color.set(0x004040);
	} else {
		Earth.userData.shadow.material.blending = THREE.SubtractiveBlending;
		Earth.userData.shadow.material.color.set(0x404040);
	}
	camera.lookAt(ct.clone().addScaledVector(camera.up, 1));
	camera.translateZ(-(camera.position.distanceTo(ct) - camdistance) / 5);
	camera.lookAt(ct.clone().addScaledVector(camera.up, 0.5));


	/*if (antigrav) {
		collideSphere(camera, 1);
	}*/

	s.position.copy(Earth.position);
	s.position.addScalar(20);
	s.position.y += 40;



	Earth.userData.shadow.scale.setScalar(sr * 2);


	Earth.updateMatrixWorld();
	camera.updateMatrixWorld();

	if (portal.visible == true && portal2.visible == true) {
		if (Earth.position.distanceToSquared(portal.position) > Earth.position.distanceToSquared(portal2.position)) {
			var closep = portal;
			var farp = portal2;
		} else {
			var closep = portal2;
			var farp = portal;
		}
		if (farp.geometry.boundsTree.closestPointToPoint(farp.worldToLocal(Earth.position.clone())).distance < sr) {
			pEarth.matrix.copy(Earth.matrix);
			pEarth.userData.shadow.matrix.copy(Earth.userData.shadow.matrix);
			tm4.getInverse(farp.matrixWorld);
			pEarth.applyMatrix4(tm4);
			pEarth.userData.shadow.applyMatrix4(tm4);
			tm4.copy(closep.matrixWorld);
			tm4.scale(portalTransform);
			pEarth.applyMatrix4(tm4);
			pEarth.userData.shadow.applyMatrix4(tm4);
			if (pEarth.visible == false) {
				pEarth.visible = true;
				pEarth.userData.shadow.visible = Earth.userData.shadow.visible;
			}
		} else {
			if (pEarth.visible == true) {
				pEarth.visible = false;
				pEarth.userData.shadow.visible = false;
			}
		}

		portal.userData.visibleToCamera = portal.userData.visibleToCamera && portal.getWorldDirection().dot(portal.position.clone().directionTo(camera.position)) > 0;
		portal2.userData.visibleToCamera = portal2.userData.visibleToCamera && portal2.getWorldDirection().dot(portal2.position.clone().directionTo(camera.position)) > 0;

		if (ping == true) {
			if (portal.userData.visibleToCamera) {
				renderPortal(portal, portal2, prta);
			}
			if (portal2.userData.visibleToCamera) {
				renderPortal(portal2, portal, prt2);
			}
			portal.material.map = prta;
			portal2.material.map = prt2;
		} else {
			if (portal.userData.visibleToCamera) {
				renderPortal(portal, portal2, prt);
			}
			if (portal2.userData.visibleToCamera) {
				renderPortal(portal2, portal, prt2a);
			}
			portal.material.map = prt;
			portal2.material.map = prt2a;
		}
		ping = !ping;
		portal.userData.visibleToCamera = false;
		portal2.userData.visibleToCamera = false;


		renderer.setRenderTarget(null);
		clipPlane.setFromNormalAndCoplanarPoint(scene.up, new THREE.Vector3(0, -1000000000, 0));
	} else {
		pEarth.visible = false;
	}


	renderer.render(scene, camera);
	stats.update();
	DCPanel.update(renderer.info.render.calls, 1000);
	renderer.info.reset();
	//TWEEN.update();
};

animate();
