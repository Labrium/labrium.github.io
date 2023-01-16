// Racer functions

function loadRacer(image, name) {
	tl.load(image, function (tex) {
		var scnvs = document.createElement("canvas").getContext("2d");
		var icnvs = document.createElement("canvas").getContext("2d");

		scnvs.canvas.width = tex.image.naturalWidth;
		scnvs.canvas.height = tex.image.naturalHeight;

		icnvs.canvas.width = tex.image.naturalHeight;
		icnvs.canvas.height = tex.image.naturalHeight;

		scnvs.drawImage(tex.image, 0, 0);


		// Tamagotchi transparency method
		var transp = scnvs.getImageData(0, 0, 1, 1);
		var data = scnvs.getImageData(0, 0, scnvs.canvas.width, scnvs.canvas.height);
		for (var i = 0; i < data.data.length; i += 4) {
			if (data.data[i] == transp.data[0] && data.data[i + 1] == transp.data[1] && data.data[i + 2] == transp.data[2] && data.data[i + 3] == transp.data[3]) {
				data.data[i] = 0;
				data.data[i + 1] = 0;
				data.data[i + 2] = 0;
				data.data[i + 3] = 0;
			}
		}
		scnvs.putImageData(data, 0, 0);



		var tmploader = tl;
		racerSprites[name] = [];
		for (var i = 0; i < Math.round(tex.image.naturalWidth / tex.image.naturalHeight); i++) {
			var data = scnvs.getImageData(tex.image.naturalHeight * i, 0, tex.image.naturalHeight, tex.image.naturalHeight);
			icnvs.putImageData(data, 0, 0);
			var ntex = tmploader.load(icnvs.canvas.toDataURL());
			ntex.magFilter = THREE.NearestFilter;
			ntex.minFilter = THREE.NearestFilter;
			ntex.encoding = THREE.sRGBEncoding;
			racerSprites[name].push(ntex);
		}
	});
}

function updateRacerList() {
	var rlist = document.getElementById("racerlist");
	var newlist = '<tr><td><button onclick="rcount++;">+</button></td> <td>#</td> <td>Character</td>  <td>Type</td> <td><div>Forward Backward Left Right Drift Item</div></td> <td>Screen</td> </tr>'
	for (r in racers) {
		newlist += '<tr><td><button onclick="destroyRacer(racers[' + r + ']);">-</button></td><td>' + (Number(r) + 1) + '</td> <td><select onchange="racers[' + r + '].userData.racer = this.value;">';
		for (opta in racerlist) {
			if (racerlist[opta] == racers[r].userData.racer) {
				newlist += '<option selected value="' + racerlist[opta] + '">' + racerlist[opta] + "</option>";
			} else {
				newlist += '<option value="' + racerlist[opta] + '">' + racerlist[opta] + "</option>";
			}
		}
		newlist += '</select></td> <td><select onchange="racers[' + r + '].userData.type = this.value;">';
		switch (racers[r].userData.type) {
			case "localPlayer":
				newlist += "<option selected>localPlayer</option>";
				newlist += "<option>CPU</option>";
				newlist += "<option disabled>remotePlayer</option>";
				break;
			case "CPU":
				newlist += "<option>localPlayer</option>";
				newlist += "<option selected>CPU</option>";
				newlist += "<option disabled>remotePlayer</option>";
				break;
			case "remotePlayer":
				newlist += "<option>localPlayer</option>";
				newlist += "<option>CPU</option>";
				newlist += "<option selected disabled>remotePlayer</option>";
				break;
		}
		newlist += "</select></td> <td><div>";

		for (var x = 0; x < 6; x++) {
			if (racers[r].userData.controls) {
				if (racers[r].userData.controls[x]) {
					newlist += '<button onclick="setKey=[racers[' + r + '], ' + x + ', this];">' + racers[r].userData.controls[x] + "</button>";
				} else {
					newlist += '<button onclick="setKey=[racers[' + r + '], ' + x + ', this];">&nbsp;</button>';
				}
			} else {
				newlist += '<button onclick="setKey=[racers[' + r + '], ' + x + ', this];">&nbsp;</button>';
			}
		}

		newlist += '</div></td> <td><button onclick="assignScreen(racers[' + r + ']);">+</button><button onclick="unassignScreen(racers[' + r + ']);">-</button></td></tr>';
	}
	rlist.innerHTML = newlist;
}

function createRacer(name, type, controls) {
	var p1 = new THREE.Group();
	p1.userData.velocity = new THREE.Vector3();
	p1.userData.racer = name;
	p1.userData.type = type;
	if (controls) {
		p1.userData.controls = controls;
	} else {
		p1.userData.controls = [];
	}
	while (p1.userData.controls.length < 6) {
		p1.userData.controls.push(undefined);
	}
	//p1.userData.target = Math.floor(Math.random() * path.length);
	p1.userData.target = 0;
	p1.userData.coins = Math.round(Math.random() * 50);
	p1.userData.character = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
		transparent: true,
		side: THREE.DoubleSide,
		alphaTest: 1,
	}));
	p1.add(p1.userData.character);


	/*p1.userData.character.onBeforeRender = function (_, _, cam) {
		updateAngle(this.parent, cam);
	};*/


	scene.add(p1);

	p1.userData.shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.8), new THREE.MeshBasicMaterial({
		map: shadowMap,
		transparent: true,
		opacity: 0.625,
		depthTest: false
	}));
	p1.userData.shadow.renderOrder = -1;
	p1.userData.shadow.rotation.x = deg(-90);
	p1.userData.shadow.position.y = 0;
	scene.add(p1.userData.shadow);

	/*var t = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.2), new THREE.MeshNormalMaterial({ opacity: 0.5, transparent: true }));
	t.renderOrder = 1;
	t.position.y = 0.05;
	p1.add(t);*/

	racers.push(p1);
	if (type == "localPlayer") {
		assignScreen(p1);
	}

	try {
		p1.userData.rtsmoke = new SPE.Emitter(opt);
		p1.userData.ltsmoke = new SPE.Emitter(opt);
		p1.userData.rtsmoke.disable();
		p1.userData.ltsmoke.disable();
		smoke.addEmitter(p1.userData.rtsmoke);
		smoke.addEmitter(p1.userData.ltsmoke);
	} catch (e) {}

	try {
		updateRacerList();
	} catch (e) {}
}


function destroyRacer(p1) {
	try {
		unassignScreen(p1);
	} catch (e) {}
	racers.splice(racers.indexOf(p1), 1);
	scene.remove(p1);
	scene.remove(p1.userData.shadow);
	delete p1.userData;
	/*smoke.removeEmitter(p1.userData.rtsmoke);
	smoke.removeEmitter(p1.userData.ltsmoke);*/
	delete p1;
	try {
		updateRacerList();
	} catch (e) {}
}


function assignScreen(p1) {
	if (!p1.userData.camera) {
		p1.userData.camera = camera.clone();
	}
	if (!p1.userData.screen) {
		p1.userData.screen = document.createElement("div");
		p1.userData.screen.classList = "screen";
		p1.userData.screen.innerHTML += `<div class="item-container"></div>
		<div class="gauge-container">
			<div class="gauge-data"></div>
			<div class="gauge-label">mph</div>
			<div class="gauge"></div>
			<div class="gauge-fill"></div>
		</div>`;
		display.appendChild(p1.userData.screen);
	}


	var scrns = display.getElementsByClassName("screen");
	for (var s = 0; s < scrns.length; s++) {
		scrns[s].style.minWidth = "calc(150vh / " + Math.ceil(Math.sqrt(scrns.length)) + ")";
	}
}


function unassignScreen(p1) {
	if (p1.userData.camera) {
		delete p1.userData.camera;
	}
	if (p1.userData.screen) {
		p1.userData.screen.remove();
		delete p1.userData.screen;
	}

	var scrns = display.getElementsByClassName("screen");
	for (var s = 0; s < scrns.length; s++) {
		scrns[s].style.minWidth = "calc(150vh / " + Math.ceil(Math.sqrt(scrns.length)) + ")";
	}
}





// Physics functions

var tmpvec = new THREE.Vector3();

function accelerateRacer(p1, amount) {
	tmpvec.set(0, 0, -amount);
	tmpvec.applyAxisAngle(new THREE.Vector3(0, 1, 0), p1.rotation.y);
	p1.userData.velocity.add(tmpvec);
}


var restitution = 1;

function collide(p1, p1static, p2, p2static, distance) {

	var vCollisionNorm = new THREE.Vector2(p2.position.x - p1.position.x, p2.position.z - p1.position.z).normalize();
	var vRelativeVelocity = new THREE.Vector2(p1.userData.velocity.x - p2.userData.velocity.x, p1.userData.velocity.z - p2.userData.velocity.z);
	var speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y + 0.025;
	p1.userData.velocity.x -= (speed * vCollisionNorm.x) * restitution;
	p1.userData.velocity.z -= (speed * vCollisionNorm.y) * restitution;
	p2.userData.velocity.x += (speed * vCollisionNorm.x) * restitution;
	p2.userData.velocity.z += (speed * vCollisionNorm.y) * restitution;

	var rot = p1.rotation.y;
	p1.lookAt(p2.position.x, p1.position.y, p2.position.z);
	p1.translateZ(-(1 - distance) / 2);
	p1.rotation.y = rot;
	p1.rotation.x = 0;
	p1.rotation.z = 0;
}

var topSpeed = 0.01; //0.006;
function updatePhysics(p1) {

	p1.position.y += p1.userData.velocity.y;
	p1.userData.velocity.y -= 0.01;
	var height = 0;
	if (p1.userData.racer == "SNES Hover Mario") {
		height = Math.sin(Date.now() / 200) / 20 + 0.2;
	}
	if (p1.position.y < height) {
		p1.userData.velocity.y = 0;
		p1.position.y = height;
	}

	p1.position.x += p1.userData.velocity.x;
	p1.position.z += p1.userData.velocity.z;

	p1.userData.velocity.x = p1.userData.velocity.x * 0.97;
	p1.userData.velocity.z = p1.userData.velocity.z * 0.97;
}




// Graphics functions

var depthCorrection = "ZShift"; // or "YShift"

function updateShadow(p1) {
	p1.userData.shadow.position.set(p1.position.x, 0, p1.position.z);
	p1.userData.shadow.rotation.z = p1.rotation.y;
}

//var ys = 1.25;
function updateAngle(p1, camera) {
	if (depthCorrection == "YShift") {
		p1.userData.character.scale.setScalar(1.25); //ys);
		p1.userData.character.position.y = 0.4125; //0.25 * ys;
		try {
			if (ground.material.depthTest != false) {
				ground.material.depthTest = false;
			}
		} catch (e) {}
	} else if (depthCorrection == "ZShift") {
		p1.userData.character.scale.setScalar(1);
		p1.userData.character.position.y = 0.5;
		try {
			if (ground.material.depthTest != true) {
				ground.material.depthTest = true;
			}
		} catch (e) {}
	}

	p1.userData.character.position.x = 0;
	p1.userData.character.position.z = 0;
	p1.userData.character.lookAt(new THREE.Vector3(camera.position.x, p1.position.y + p1.userData.character.position.y, camera.position.z));
	if (p1.userData.character.rotation.x != 0) {
		p1.userData.character.rotation.y = -p1.userData.character.rotation.y + (tau / 2);
	}
	if (p1.userData.character.rotation.y > (tau / 2)) {
		p1.userData.character.rotation.y = p1.userData.character.rotation.y - tau;
	}
	p1.userData.character.rotation.z = 0;
	p1.userData.character.rotation.x = 0;
	if (depthCorrection == "ZShift") {
		p1.userData.character.translateZ(0.5);
	}
	p1.userData.character.material.map = racerSprites[p1.userData.racer][Math.round(Math.abs((p1.userData.character.rotation.y / (tau / 2)) * (racerSprites[p1.userData.racer].length - 1)))];

	if (p1.userData.character.rotation.y < 0) {
		if (depthCorrection == "YShift") {
			p1.userData.character.scale.x = -1.25; //-ys;
		} else {
			p1.userData.character.scale.x = -1;
		}
	} else {
		if (depthCorrection == "YShift") {
			p1.userData.character.scale.x = 1.25; //ys;
		} else {
			p1.userData.character.scale.x = 1;
		}
	}
}









// Racer variables/constants

var racers = [];
var racerSprites = {};