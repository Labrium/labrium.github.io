var tau = 6.28318530717958637692528;

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

var camdistance = 3;

var setKey = false;

var onKeyDown = function (event) {
	if (event.repeat) {
		return;
	}
	if (setKey) {
		setKey[0].userData.controls[setKey[1]] = event.code;
		setKey[2].innerHTML = event.code;
		setKey = undefined;
	} else {
		for (var r = 0; r < racers.length; r++) {
			var p = racers[r];
			if (p.userData.type == "localPlayer") {
				switch (event.code) {
					case p.userData.controls[0]:
						p.userData.up = true;
						break;
					case p.userData.controls[1]:
						p.userData.down = true;
						break;
					case p.userData.controls[2]:
						p.userData.left = true;
						break;
					case p.userData.controls[3]:
						p.userData.right = true;
						break;
					case p.userData.controls[4]:
						p.userData.drift = true;
						if (p.position.y == 0) {
							p.userData.velocity.y = 0.1;
						}
						break;
				}
			}
		}
	}
};
var onKeyUp = function (event) {
	for (var r = 0; r < racers.length; r++) {
		var p = racers[r];
		if (p.userData.type == "localPlayer") {
			switch (event.code) {
				case p.userData.controls[0]:
					p.userData.up = false;
					break;
				case p.userData.controls[1]:
					p.userData.down = false;
					break;
				case p.userData.controls[2]:
					p.userData.left = false;
					break;
				case p.userData.controls[3]:
					p.userData.right = false;
					break;
				case p.userData.controls[4]:
					p.userData.drift = false;
					break;
			}
		}
	}
};
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);

var windowHeight = 0;
var windowWidth = 0;
var rs = new THREE.Vector2();

function updateScreens() {
	windowHeight = window.innerHeight;
	windowWidth = window.innerWidth;
	renderer.getSize(rs);
}
window.addEventListener("resize", updateScreens, false);

var display = document.getElementById("display");

var tl = new THREE.TextureLoader();






// Basic setup

var stats = new Stats(0.5);
stats.showPanel(0);
document.body.appendChild(stats.dom);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
var camera = new THREE.PerspectiveCamera(60, 0, 0.1, 1000);
var renderer = new THREE.WebGL1Renderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;

camera.position.set(0, 2, 5);






// Particle systems

var particle = tl.load('Images/particle.png');
particle.minFilter = THREE.NearestFilter;
particle.magFilter = THREE.NearestFilter;
particle.encoding = THREE.sRGBEncoding;
var smoke = new SPE.Group({
	texture: {
		value: particle,
	},
	depthTest: true,
	depthWrite: false,
	blending: THREE.NormalBlending,
	scale: 1,
	transparent: true,
	alphaTest: 0,
	maxParticleCount: 10000
});

var opt = {
	maxAge: {
		value: 0.1,
		spread: 0
	},
	position: {
		value: new THREE.Vector3(0, 0, 0),
		spread: new THREE.Vector3(1, 0.1, 1)
	},

	acceleration: {
		value: new THREE.Vector3(0, 0, 0),
		spread: new THREE.Vector3(0, 0, 0)
	},

	velocity: {
		value: new THREE.Vector3(0, 0, 0),
		spread: new THREE.Vector3(2, 2, 2)
	},

	color: {
		value: [new THREE.Color(0xffffff)]
	},

	opacity: {
		value: [0.8, 0.5, 0.1, 0]
	},
	size: {
		value: [20, 100],
		spread: 5
	},

	particleCount: 5
};

smoke.mesh.frustumCulled = false;
smoke.mesh.renderOrder = 2;
scene.add(smoke.mesh);








// Track setup
var ground;
tl.load("Images/Tracks/MarioCircuit.png", function (texa) {
	texa.encoding = THREE.sRGBEncoding;
	texa.minFilter = THREE.NearestFilter;
	texa.magFilter = THREE.NearestFilter;
	ground = new THREE.Mesh(new THREE.PlaneGeometry(texa.image.naturalWidth / 8, texa.image.naturalHeight / 8), new THREE.MeshBasicMaterial({
		map: texa,
		side: THREE.DoubleSide
	}));
	//ground.material.depthTest = false;
	ground.rotation.x = deg(-90);
	scene.add(ground);

	tl.load("Images/background2.png", function (tex2) {
		tex2.encoding = THREE.sRGBEncoding;
		tex2.minFilter = THREE.NearestFilter;
		tex2.magFilter = THREE.NearestFilter;
		/*tex2.repeat = new THREE.Vector2(1.25, 1);
		tex2.wrapS = THREE.RepeatWrapping;
		tex2.wrapT = THREE.RepeatWrapping;*/
		var radius = ((texa.image.naturalWidth / 8) / 2) / Math.sin(deg(45));
		var height = ((tau * radius) * tex2.image.naturalHeight / tex2.image.naturalWidth) / 1;
		var foreground = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, height, 4, 1, true), new THREE.MeshBasicMaterial({
			map: tex2,
			side: THREE.DoubleSide,
			transparent: true,
			alphaTest: 1
		}));
		foreground.position.y = height / 2;
		foreground.rotation.y = deg(45);
		scene.add(foreground);
	});

	tl.load("Images/background.png", function (tex) {
		var skyw = tex.image.width * 2;
		var skyh = Math.round(tex.image.width);
		var ctx = document.createElement("canvas").getContext("2d");
		var ctx2 = document.createElement("canvas").getContext("2d");
		var ctx3 = document.createElement("canvas").getContext("2d");
		ctx.canvas.width = skyw;
		ctx.canvas.height = skyh;
		ctx2.canvas.width = tex.image.width;
		ctx2.canvas.height = tex.image.height;

		ctx2.drawImage(tex.image, 0, 0);
		var skycolor = ctx2.getImageData(0, 0, 1, 1);

		ctx2.canvas.width = texa.image.width;
		ctx2.canvas.height = texa.image.height;

		ctx2.drawImage(texa.image, 0, 0);
		var groundimage = ctx2.getImageData(texa.image.width - 24, 8, 8, 8);

		var length = groundimage.data.length;
		var count = 0;
		var rgb = {
			r: 0,
			g: 0,
			b: 0
		};
		var i = 0;
		while ((i += 4) < length) {
			++count;
			rgb.r += groundimage.data[i];
			rgb.g += groundimage.data[i + 1];
			rgb.b += groundimage.data[i + 2];
		}
		rgb.r = ~~(rgb.r / count);
		rgb.g = ~~(rgb.g / count);
		rgb.b = ~~(rgb.b / count);

		ctx.fillStyle = "rgb(" + skycolor.data[0] + ", " + skycolor.data[1] + ", " + skycolor.data[2] + ")";
		ctx.fillRect(0, 0, skyw, skyh / 2);
		ctx.fillStyle = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
		ctx.fillRect(0, skyh / 2, skyw, skyh / 2);

		ctx.drawImage(tex.image, 0, (skyh / 2) - tex.image.height);
		ctx.drawImage(tex.image, tex.image.width, (skyh / 2) - tex.image.height);

		var cskytex = new THREE.CanvasTexture(ctx.canvas);
		cskytex.magFilter = THREE.NearestFilter;
		cskytex.minFilter = THREE.NearestFilter;
		cskytex.encoding = THREE.sRGBEncoding;
		var skytex = new THREE.WebGLCubeRenderTarget(cskytex.image.height * 2);
		skytex.fromEquirectangularTexture(renderer, cskytex);

		scene.background = skytex;
	});
});



var path = [];
/*for (var p = 0; p < 10; p++) {
	path.push(new THREE.Vector2((Math.random()-0.5)*100, (Math.random()-0.5)*100));
}*/
//path.push(new THREE.Vector2(50, 50), new THREE.Vector2(50, -50), new THREE.Vector2(-50, 50), new THREE.Vector2(-50, -50));


path.push(new THREE.Vector2(53, 6));

//path.push(new THREE.Vector2(53, -4));

//path.push(new THREE.Vector2(49, -14));

path.push(new THREE.Vector2(39, -19));

path.push(new THREE.Vector2(29, -24));

path.push(new THREE.Vector2(19, -29));

path.push(new THREE.Vector2(9, -34));

path.push(new THREE.Vector2(-1, -39));

path.push(new THREE.Vector2(-11, -44));

path.push(new THREE.Vector2(-21, -49));

//path.push(new THREE.Vector2(-31, -54));

//path.push(new THREE.Vector2(-41, -55));

//path.push(new THREE.Vector2(-50, -51));

//path.push(new THREE.Vector2(-54, -43));

path.push(new THREE.Vector2(-54, -33));

path.push(new THREE.Vector2(-54, -23));

path.push(new THREE.Vector2(-54, -13));

path.push(new THREE.Vector2(-54, -3));

path.push(new THREE.Vector2(-54, 7));

//path.push(new THREE.Vector2(-54, 17));

//path.push(new THREE.Vector2(-51, 27));

//path.push(new THREE.Vector2(-41, 26));

path.push(new THREE.Vector2(-31, 22));

path.push(new THREE.Vector2(-21, 17));

path.push(new THREE.Vector2(-11, 12));

//path.push(new THREE.Vector2(-1, 9));

//path.push(new THREE.Vector2(9, 18));

path.push(new THREE.Vector2(14, 28));

path.push(new THREE.Vector2(19, 38));

//path.push(new THREE.Vector2(26, 48));

//path.push(new THREE.Vector2(36, 50));

//path.push(new THREE.Vector2(46, 48));

//path.push(new THREE.Vector2(52, 42));

path.push(new THREE.Vector2(53, 32));

path.push(new THREE.Vector2(53, 22));

path.push(new THREE.Vector2(53, 13));



var waypointRadius = 7;

/*for (pa in path) {
	var tmppa = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({alphaMap: tl.load("Images/ring.png"), transparent: true, depthWrite: false}));
	tmppa.scale.setScalar(waypointRadius);
	tmppa.renderOrder = 2;
	tmppa.rotation.x = -tau/4;
	tmppa.position.set(path[pa].x, 0, path[pa].y);
	scene.add(tmppa);
}*/

var shadowMap = tl.load("Images/roundshadow.png");
shadowMap.encoding = THREE.sRGBEncoding;


var racerlist = [
	"SNES Mario",
	"SNES Mario Test",
	"SNES Luigi",
	"SNES Toad",

	"SNES Black Toad",
	"SNES Blue Toad",
	"SNES Brown Toad",
	"SNES Cyan Toad",
	"SNES Green Toad",
	"SNES Lavender Toad",
	"SNES Orange Toad",
	"SNES Pink Toad",
	"SNES Purple Toad",
	"SNES Yellow Toad",

	"SNES Yoshi",

	"SNES Black Yoshi",
	"SNES Blue Yoshi",
	"SNES Brown Yoshi",
	"SNES Orange Yoshi",
	"SNES Pink Yoshi",
	"SNES Purple Yoshi",
	"SNES Red Yoshi",
	"SNES White Yoshi",
	"SNES Yellow Yoshi",

	"SNES Peach",
	"SNES Koopa Troopa",
	"SNES Daisy",
	"SNES Bowser",
	"SNES Donkey Kong Jr",
	"SNES Diddy Kong",
	"SNES Toadette",
	"SNES Daisy2",
	"SNES Dry Bones",
	"SNES Toadsworth",
	"SNES Bowser Jr",
	"SNES Onigiri",
	"Bullet Bill",

	"SNES Hover Mario",

	"GBA Mario",
	"GBA Toad",
	"GBA Yoshi",
	"GBA Peach",
	"GBA Wario",
	"GBA Luigi",
	"GBA Bowser",
	"test",
	//"test2"
];




// Racer setup

for (var r = 0; r < racerlist.length; r++) {
	loadRacer("Images/Racers/" + racerlist[r].replace(/ /g, "") + ".png", racerlist[r]);
}



createRacer("SNES Mario Test", "localPlayer", ["KeyW", "KeyS", "KeyA", "KeyD", "ShiftLeft"]);
racers[racers.length - 1].position.set((Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5);
createRacer("SNES Mario Test", "localPlayer", ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftRight"]);
racers[racers.length - 1].position.set((Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5);
/*createRacer("GBA Toad", "localPlayer", ["KeyW", "KeyS", "KeyA", "KeyD", "ShiftLeft"]);
racers[racers.length - 1].position.set((Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5);
createRacer("GBA Yoshi", "localPlayer", ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftRight"]);
racers[racers.length - 1].position.set((Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5);*/
var rcount = 10;









// Start game loop

document.body.appendChild(renderer.domElement);
updateScreens();

console.log(scene);

var lt = 0;

var tmpobj = new THREE.Object3D();
var animate = function () {
	requestAnimationFrame(animate);

	if (rcount > 0) {
	while (performance.now() < lt + (1000/30)) {
	if (rcount > 0) {
		createRacer(racerlist[Math.floor(Math.random() * racerlist.length)], "CPU");
		//createRacer("SNES Mario Test", "CPU");
		racers[racers.length - 1].position.set((Math.random() - 0.5) * 100, 0, (Math.random() - 0.5) * 100);
		racers[racers.length - 1].rotation.y = Math.random() * tau;
		//assignScreen(racers[racers.length - 1]);
		rcount--;
	}
	}
	}
	lt = performance.now();


	if (rs.x != windowWidth || rs.y != windowHeight) {
		renderer.setSize(windowWidth, windowHeight);
	}


	for (var r = 0; r < racers.length; r++) {
		racers[r].userData.rtsmoke.disable();
		racers[r].userData.ltsmoke.disable();
		if (racers[r].userData.type == "localPlayer") {
			var speed = racers[r].userData.velocity.length();
			if (racers[r].userData.up === true) {
				accelerateRacer(racers[r], topSpeed + (racers[r].userData.coins * 0.0001));
				if (speed < 0.25) {
					racers[r].userData.rtsmoke.enable();
					racers[r].userData.ltsmoke.enable();
				}
			}
			if (racers[r].userData.down === true) {
				accelerateRacer(racers[r], -topSpeed);
			}
			if (racers[r].userData.right === true) {
				racers[r].rotation.y -= 0.025;
				if (racers[r].userData.drift === true) {
					if (racers[r].position.y == 0) {
						racers[r].rotation.y -= 0.025;
						accelerateRacer(racers[r], topSpeed);
						racers[r].userData.velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.025);
						racers[r].userData.rtsmoke.enable();
						racers[r].userData.ltsmoke.enable();
					}
				}
			}
			if (racers[r].userData.left === true) {
				racers[r].rotation.y += 0.025;
				if (racers[r].userData.drift === true) {
					if (racers[r].position.y == 0) {
						racers[r].rotation.y += 0.025;
						accelerateRacer(racers[r], topSpeed);
						racers[r].userData.velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.025);
						racers[r].userData.rtsmoke.enable();
						racers[r].userData.ltsmoke.enable();
					}
				}
			}
		} else if (racers[r].userData.type == "CPU") {
			var speed = racers[r].userData.velocity.length();
			if (racers[r].position.y == 0 && speed < 0.25) {
				racers[r].userData.rtsmoke.enable();
				racers[r].userData.ltsmoke.enable();
			}

			var targetpos = new THREE.Vector3(path[racers[r].userData.target].x, racers[r].position.y, path[racers[r].userData.target].y);

			tmpobj.position.copy(racers[r].position);
			tmpobj.lookAt(targetpos);
			//tmpobj.lookAt(racers[0].position.x, p1.position.y, racers[0].position.z);
			tmpobj.rotateY(tau / 2);
			if (tmpobj.rotation.x != 0) {
				tmpobj.rotation.y = -tmpobj.rotation.y + (tau / 2);
			}
			if (tmpobj.rotation.y > (tau / 2)) {
				tmpobj.rotation.y = tmpobj.rotation.y - tau;
			}
			tmpobj.rotation.x = 0;
			tmpobj.rotation.z = 0;

			while (tmpobj.rotation.y > tau) {
				tmpobj.rotation.y = tmpobj.rotation.y - tau;
			}
			while (tmpobj.rotation.y < 0) {
				tmpobj.rotation.y = tmpobj.rotation.y + tau;
			}

			while (racers[r].rotation.y > tau) {
				racers[r].rotation.y = racers[r].rotation.y - tau;
			}
			while (racers[r].rotation.y < 0) {
				racers[r].rotation.y = racers[r].rotation.y + tau;
			}

			var d = tmpobj.rotation.y - racers[r].rotation.y;
			while (d > tau / 2) {
				d -= tau;
			}
			while (d < -tau / 2) {
				d += tau;
			}
			//p1.rotation.y += d;
			if (d > 0.1) {
				racers[r].rotation.y += 0.025;
				if (d > 0.4) {
					if (racers[r].position.y == 0) {
						accelerateRacer(racers[r], topSpeed);
						racers[r].rotation.y += 0.025;
						racers[r].userData.velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.025);
						racers[r].userData.rtsmoke.enable();
						racers[r].userData.ltsmoke.enable();
					}
				}
			} else if (d < -0.1) {
				racers[r].rotation.y -= 0.025;
				if (d < -0.4) {
					if (racers[r].position.y == 0) {
						accelerateRacer(racers[r], topSpeed);
						racers[r].rotation.y -= 0.025;
						racers[r].userData.velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.025);
						racers[r].userData.rtsmoke.enable();
						racers[r].userData.ltsmoke.enable();
					}
				}
			}

			accelerateRacer(racers[r], topSpeed + (racers[r].userData.coins * 0.0001));

			if (racers[r].position.distanceTo(targetpos) < waypointRadius) {
				racers[r].userData.target += 1;
				if (racers[r].userData.target > path.length - 1) {
					racers[r].userData.target = 0;
				}
			}
		}



		updatePhysics(racers[r]);
		updateShadow(racers[r]);

		if (racers[r].userData.rtsmoke.alive == true) {
			racers[r].userData.rtsmoke.position.value = racers[r].position; //p1.localToWorld(new THREE.Vector3(0.3, 0, 0.4 - speed));
			racers[r].userData.ltsmoke.position.value = racers[r].position; //p1.localToWorld(new THREE.Vector3(-0.3, 0, 0.4 - speed));
		}





		for (r2 in racers) {
			if (r != r2) {
				var dist = racers[r].position.distanceTo(racers[r2].position);
				if (dist < 1) {
					collide(racers[r], false, racers[r2], false, dist);
				}
			}
			if (racers[r].userData.camera) {
				updateAngle(racers[r2], racers[r].userData.camera);
				//racers[r2].userData.character.lookAt(racers[r].userData.camera.position);
			}
		}
		if (racers[r].userData.camera) {
			racers[r].userData.camera.position.y = 1.3;
			racers[r].userData.camera.lookAt(new THREE.Vector3(racers[r].position.x, racers[r].position.y + 0.85, racers[r].position.z));
			racers[r].userData.camera.translateZ(-(racers[r].userData.camera.position.distanceTo(racers[r].position) - camdistance) / 3);
			//racers[r].userData.camera.lookAt(racers[r].localToWorld(new THREE.Vector3(0, 0.85, -0.5)));



			var speed = racers[r].userData.velocity.length();
			var mph = Math.max(speed * 100, 1) - 1;
			racers[r].userData.screen.querySelector(".gauge-data").innerHTML = Math.round(mph);
			racers[r].userData.screen.querySelector(".gauge").style.transform = "rotate(" + (mph - 45) + "deg";


			var view = racers[r].userData.screen.getBoundingClientRect();
			smoke.uniforms.scale.value = view.height / 100;
			racers[r].userData.camera.aspect = view.width / view.height;
			racers[r].userData.camera.updateProjectionMatrix();
			renderer.setViewport(view.left, windowHeight - view.bottom, view.width, view.height);
			renderer.setScissor(view.left, windowHeight - view.bottom, view.width, view.height);
			renderer.setScissorTest(true);

			renderer.render(scene, racers[r].userData.camera);


		}
	}
	smoke.tick();
	stats.update();
};

animate();