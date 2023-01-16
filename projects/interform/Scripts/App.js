var tau = Math.PI * 2;

function deg(number) {
	return (number * tau) / 360;
}

function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		}
	}
}

document.addEventListener("keydown", function (event) {
	switch (event.key) {
		case "h":
			oc.reset();
			break;
		case "Delete":
			try {
				selected.parent.remove(selected);
				selected = null;
				tc.detach();
				bb.visible = false;
			} catch (e) { }
			break;
	}
}, false);

document.addEventListener("keyup", function (event) {
	switch (event.key) {
	}
}, false);

var windowDidResize = true;
window.addEventListener("resize", function () {
	windowDidResize = true;
	render();
}, false);




var scene = new THREE.Scene();
var model = new THREE.Group();
scene.add(model);

var container = document.getElementById("viewcontainer");
var camera = new THREE.PerspectiveCamera(60, 1, 0.01, 10000);
var renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
renderer.physicallyCorrectLights = true;

container.appendChild(renderer.domElement);

function setCursor(string) {
	container.style.cursor = string;
}





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
scene.environment = skytex;





// Lights
var dlight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(dlight);

var hlight = new THREE.HemisphereLight(0xffffff, 0x777777, 2);
scene.add(hlight);

/*var lightProbe = new THREE.LightProbe();
scene.add(lightProbe);
lightProbe.copy(THREE.LightProbeGenerator.fromCubeRenderTarget(renderer, skytex));*/





// Helpers
var gh = new THREE.GridHelper(100, 100, 0xff0000, 0xeeeeee);
scene.add(gh);

var bb = new THREE.BoxHelper();
bb.material.linewidth = 2;
bb.material.color = new THREE.Color(0xffffff);
scene.add(bb);

var helperPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, side: THREE.DoubleSide }));
helperPlane.renderOrder = 2;
helperPlane.rotation.x = deg(-90);
scene.add(helperPlane);

var helperCube = new THREE.AxisCubeHelper(document.getElementById("helpercube"), 1, 3, new THREE.MeshPhongMaterial());





// Input Controls
var selected = null;
var mode = "none";

var oc = new THREE.OrbitControls(camera, container);
oc.mouseButtons = {
	LEFT: null,
	MIDDLE: THREE.MOUSE.DOLLY,
	RIGHT: THREE.MOUSE.ROTATE
};
//oc.screenSpacePanning = false;

oc.addEventListener('change', function () {
	helperCube.update(camera, oc.target);
	render();
});

camera.position.set(5, 5, 5);
camera.lookAt(scene.position);
oc.saveState();

var tc = new THREE.TransformControls(camera, container);
tc.enabled = true;
tc.addEventListener("dragging-changed", function (event) {
	oc.enabled = !event.value;
});
tc.addEventListener("change", function () {
	bb.update();
	render();
});
scene.add(tc);
tc.setSpace("world");
//tc.setMode("translate");
//tc.setMode("rotate");
//tc.setMode("scale");





// Mouse
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var point1 = new THREE.Vector3();
var dragged = null;
var dragThreshold = 3;

function updateRaycaster() {
	raycaster.setFromCamera(mouse, camera);
	switch (mode) {
		case "none":
			try {
				if (matbuffer) {
					model.getObjectById(matbuffer[1]).material = matbuffer[0];
					matbuffer = null;
				}
			} catch (e) { }
			intersect = raycaster.intersectObjects(model.children, true)[0];
			try {
				if (intersect.object != selected) {
					matbuffer = [intersect.object.material, intersect.object.id];
					intersect.object.material = new THREE.MeshNormalMaterial();
				}
			} catch (e) { }
			break;
		case "place":
			intersect = raycaster.intersectObject(helperPlane)[0];
			try {
				point1.copy(intersect.point);
				selected.position.copy(intersect.point);
			} catch (e) { }
			break;
		case "size":
			intersect = raycaster.intersectObject(helperPlane)[0];
			try {
				switch (selected.geometry.type) {
					case "SphereGeometry":
						selected.geometry = new THREE.SphereBufferGeometry(point1.distanceTo(intersect.point), 32, 32);
						break;
					case "BoxGeometry":
						selected.geometry = new THREE.BoxBufferGeometry(point1.distanceTo(intersect.point), point1.distanceTo(intersect.point), point1.distanceTo(intersect.point));
						break;
					case "CylinderGeometry":
						selected.geometry = new THREE.CylinderBufferGeometry(point1.distanceTo(intersect.point), point1.distanceTo(intersect.point), point1.distanceTo(intersect.point), 32, 32);
						break;
				}
			} catch (e) { }
			break;
	}
}

var sbuffer = { object: { id: 0 } };

var matbuffer = null;
container.addEventListener('mousemove', function (event) {
	var canvasBounds = container.getBoundingClientRect();
	mouse.x = ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
	mouse.y = -((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;
	if (dragged != null && dragged.distanceTo(new THREE.Vector3(event.clientX, event.clientY, 0)) > dragThreshold) {
		dragged = null;
		setCursor("move");
	}
	updateRaycaster();
	if (mode != "none") {
		render();
	} else {
		if (sbuffer != intersect) {
			try {
				if ((sbuffer == undefined || intersect == undefined) || (sbuffer.object.id != intersect.object.id)) {
					render();
				}
			} catch (e) { }
			sbuffer = intersect;
		}
	}
}, false);

container.addEventListener('mousedown', function (event) {
	if (event.button == 0) {
		switch (mode) {
			case "none":
				if (oc.enabled) {
					if (intersect) {
						selected = intersect.object;
						tc.attach(selected);
						bb.setFromObject(selected);
						bb.visible = true;
					} else {
						selected = null;
						tc.detach();
						bb.visible = false;
					}
				}
				break;
			case "place":
				mode = "size";
				setCursor("crosshair");
				break;
			case "size":
				mode = "none";
				setCursor("default");
				selected.material.transparent = false;
				selected.material.opacity = 1;
				tc.attach(selected);
				bb.setFromObject(selected);
				bb.visible = true;
				render();
				break;
		}
	} else {
		dragged = new THREE.Vector3(event.clientX, event.clientY, 0);
	}
	updateRaycaster();
});
container.addEventListener('mouseup', function (event) {
	if (event.button == 2) {
		setCursor("default");
		if (dragged != null) {
			try {
				alert("Right clicked object with id " + intersect.object.id + ".");
			} catch (e) { }
			dragged = null;
		}
	}
});
container.addEventListener('dblclick', function (e) {
	try {
		var pos = intersect.object.getWorldPosition();
		camera.position.copy(camera.position.clone().sub(oc.target).add(pos));
		oc.target.copy(pos);
		oc.update();
	} catch (e) { }
});





// UI Setup
function UIButton(name, dest, func) {
	var btn = document.createElement("button");
	btn.innerHTML = name;
	btn.onclick = func;
	document.getElementById(dest).appendChild(btn);
}

var a;

function transferSceneData() {
	if (a) {
		if (model.children.length > 0) {
		new a.THREE.ObjectLoader().parse(model.toJSON(), function (obj) {
			try {
				a.scene.remove(a.scene.getObjectByName("model"));
			} catch (e) {
				a.scene.children = [];
			}
			obj.name = "model";
			a.scene.add(obj);
		});
		} else {
			try {
				a.scene.remove(a.scene.getObjectByName("model"));
			} catch (e) {
				a.scene.children = [];
			}
		}
		a.camera.position.copy(camera.position);
		a.camera.rotation.copy(camera.rotation);
		try {
			a.scene.background.dispose();
		} catch (e) { }
		a.scene.background = new a.THREE.CanvasTexture(c);
		a.scene.updateMatrixWorld();
		a.camera.updateMatrixWorld();
		a.camera.updateProjectionMatrix();
		a.renderer.resetSamples();
		a.GLRenderer.render(a.scene, a.camera);
		//a.render();
	}
}

UIButton('<img src="Images/sidebar.svg">', "toolbar", function () {
	dropArea.classList.toggle("show");
});

UIButton("Sphere", "toolbar", function () {
	mode = "place";
	setCursor("crosshair");
	selected = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setRGB(Math.random(), Math.random(), Math.random()), roughness: 0.5, reflectivity: 1, opacity: 0.5, transparent: true }));
	model.add(selected);
});

UIButton("Box", "toolbar", function () {
	mode = "place";
	setCursor("crosshair");
	selected = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setRGB(Math.random(), Math.random(), Math.random()), roughness: 0, reflectivity: 1, opacity: 0.5, transparent: true }));
	model.add(selected);
});

UIButton("Cylinder", "toolbar", function () {
	mode = "place";
	setCursor("crosshair");
	selected = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.5, 0.5, 0.5, 32, 32), new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setRGB(Math.random(), Math.random(), Math.random()), roughness: 0, reflectivity: 1, opacity: 0.5, transparent: true }));
	model.add(selected);
});

UIButton("Render", "toolbar", function () {
	a = window.open("file:///Volumes/BYUSD/code/JavaScript/Interform/MonteRayForInterform/index.html", "MonteRay", "scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=0,top=0");
	setTimeout(transferSceneData, 500);
});

UIButton('<img src="Images/translate.svg">', "dock", function () {
	tc.setMode("translate");
});
UIButton('<img src="Images/rotate.svg">', "dock", function () {
	tc.setMode("rotate");
});
UIButton('<img src="Images/scale.svg">', "dock", function () {
	tc.setMode("scale");
});





// Loaders
var dropArea = document.getElementById('sidebar');
/*dropArea.addEventListener("webkitTransitionEnd", function () {
	windowDidResize = true;
	render();
});*/

var loader = new THREE.ImportController();

container.addEventListener('dragover', function (event) {
	event.stopPropagation();
	event.preventDefault();
	event.dataTransfer.dropEffect = 'copy';
});

container.addEventListener('drop', function (event) {
	event.stopPropagation();
	event.preventDefault();
	if (event.dataTransfer.types[0] === 'text/plain') return;
	if (event.dataTransfer.items) {
		loader.loadItemList(event.dataTransfer.items);
	} else {
		loader.loadFiles(event.dataTransfer.files);
	}
});





// Render Loop
var intersect;

var rendering = false;
var ts;
//model.add(new THREE.Mesh(new THREE.SphereBufferGeometry(), new THREE.MeshLambertMaterial({ emissive: 0xffffff, emissiveIntensity: 1 })));
function render() {
	if (rendering == false) {
		rendering = true;
		ts = Date.now();
		requestAnimationFrame(function () {
			if (windowDidResize == true) {
				camera.aspect = container.offsetWidth / container.offsetHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(container.offsetWidth, container.offsetHeight, false);
				windowDidResize = false;
			}
			renderer.render(scene, camera);
			document.getElementById("timeline").innerHTML = (Date.now() - ts) + "ms";
			rendering = false;
			transferSceneData();
		});
	}
}

helperCube.update(camera, oc.target);
render();