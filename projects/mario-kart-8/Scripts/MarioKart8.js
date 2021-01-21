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


var settings = {
	players: 1,
	mode: 0,
	cc: 150,
	track: 0
};

var P1 = {
	character: 0,
	kart: 0,
	tires: 0,
	glider: 0
};


var trackLib = [
	{
		name: "Mario Circuit",
		model: "Models/Tracks/Mario Circuit/Mario Circuit.dae",
		music: "Sounds/1-05 Mario Circuit.mp3",
		position: new THREE.Vector3(293.33, -1533, -360),
		scale: new THREE.Vector3(20, 20, 20),
		rotation: new THREE.Vector3(0, 0, 0)
	}, {
		name: "Toad Harbor",
		model: "Models/Tracks/Toad Harbor/MK8_Toad_Harbor.dae",
		music: "Sounds/1-06 Toad Harbor.mp3",
		position: new THREE.Vector3(-666.67, 233, -533.33),
		scale: new THREE.Vector3(0.4, 0.4, 0.4),
		rotation: new THREE.Vector3(0, deg(90), 0)
	}, {
		name: "Sweet Sweet Canyon",
		model: "Models/Tracks/Sweet Sweet Canyon/Sweet Sweet Canyon.dae",
		music: "Sounds/1-03 Sweet Sweet Canyon.mp3",
		position: new THREE.Vector3(0, 0, 0),
		scale: new THREE.Vector3(0, 0, 0),
		rotation: new THREE.Vector3(0, 0, 0)
	}, {
		name: "GBA Ribbon Road",
		model: "Models/Tracks/GBA Ribbon Road/GBA Ribbon Road.dae",
		music: "Sounds/2-17 GBA Ribbon Road.mp3",
		position: new THREE.Vector3(0, 0, 0),
		scale: new THREE.Vector3(0, 0, 0),
		rotation: new THREE.Vector3(0, 0, 0)
	}, {
		name: "Mario Kart Stadium",
		model: "Models/Tracks/Mario Kart Stadium/Mario Kart Stadium.dae",
		music: "Sounds/1-01 Mario Kart Stadium.mp3",
		position: new THREE.Vector3(0, 0, 0),
		scale: new THREE.Vector3(0, 0, 0),
		rotation: new THREE.Vector3(0, 0, 0)
	}, {
		name: "Super Bell Subway",
		model: "Models/Tracks/Super Bell Subway/Super Bell Subway.dae",
		music: "Sounds/2-18 Super Bell Subway.mp3",
		position: new THREE.Vector3(0, 0, 0),
		scale: new THREE.Vector3(0, 0, 0),
		rotation: new THREE.Vector3(0, 0, 0)
	}, {
		name: "Big Blue",
		model: "Models/Tracks/Big Blue/Big Blue.dae",
		music: "Sounds/1-05 Mario Circuit.mp3",
		position: new THREE.Vector3(0, 0, 0),
		scale: new THREE.Vector3(0, 0, 0),
		rotation: new THREE.Vector3(0, 0, 0)
	}, {
		name: "Rainbow Road",
		model: "Models/Tracks/Rainbow Road/Rainbow Road.dae",
		music: "Sounds/1-17 Rainbow Road.mp3",
		position: new THREE.Vector3(0, 0, 0),
		scale: new THREE.Vector3(0, 0, 0),
		rotation: new THREE.Vector3(0, 0, 0)
	}, {
		name: "Shy Guy Falls",
		model: "Models/Tracks/Shy Guy Falls/Shy Guy Falls.dae",
		music: "Sounds/1-08 Shy Guy Falls.mp3",
		position: new THREE.Vector3(0, 0, 0),
		scale: new THREE.Vector3(0, 0, 0),
		rotation: new THREE.Vector3(0, 0, 0)
	}, {
		name: "Cloudtop Cruise",
		model: "Models/Tracks/Cloudtop Cruise/Cloudtop Cruise.dae",
		music: "Sounds/1-08 Shy Guy Falls.mp3",
		position: new THREE.Vector3(0, 0, 0),
		scale: new THREE.Vector3(0, 0, 0),
		rotation: new THREE.Vector3(0, 0, 0)
	}
];

var characterLib = [
	{
		name: "Mario",
		model: "Models/Characters/Mario/Mario.dae",
		kart: "M Kart.dae",
		sitPosition: function () {
			Mario.children[3].visible = false;
			Mario.children[4].visible = false;
			Mario.getObjectByName("Mario").position.z = -3;
			Mario.getObjectByName("Skl_Root_1").rotation.x += deg(-25);
			Mario.getObjectByName("Spine2_1").rotation.z += deg(20);
			Mario.getObjectByName("ArmR_1").rotation.z += deg(-90);
			Mario.getObjectByName("ArmL_1").rotation.z += deg(90);
			Mario.getObjectByName("ElbowR_1").rotation.z += deg(-0);
			Mario.getObjectByName("ElbowL_1").rotation.z += deg(0);
			Mario.getObjectByName("ArmR_1").rotation.y += deg(-5);
			Mario.getObjectByName("ArmL_1").rotation.y += deg(5);
			Mario.getObjectByName("HandR_1").rotation.set(deg(180), deg(180), deg(90));
			Mario.getObjectByName("HandL_1").rotation.set(deg(180), 0, deg(-90));
			Mario.getObjectByName("Finger1R_1").rotation.y += deg(40);
			Mario.getObjectByName("Finger1L_1").rotation.y += deg(-40);
			Mario.getObjectByName("Finger2R_1").rotation.z += deg(-80);
			Mario.getObjectByName("Finger2L_1").rotation.z += deg(-80);
			Mario.getObjectByName("Hip_1").rotation.x += deg(-25);
			Mario.getObjectByName("LegL_1").rotation.z += deg(65);
			Mario.getObjectByName("LegR_1").rotation.z += deg(-65);
			Mario.getObjectByName("LegL_1").rotation.x += deg(-20);
			Mario.getObjectByName("LegR_1").rotation.x += deg(20);
			Mario.getObjectByName("KneeL_1").rotation.z = deg(-70);
			Mario.getObjectByName("KneeR_1").rotation.z = deg(70);
			Mario.position.z += 0.25;
		},
		bikePosition: function () {
			Mario.children[3].visible = false;
			Mario.children[4].visible = false;
			Mario.getObjectByName("Skl_Root_1").rotation.x += deg(-25);
			Mario.getObjectByName("Spine2_1").rotation.z += deg(20);
			Mario.getObjectByName("ArmR_1").rotation.z += deg(-90);
			Mario.getObjectByName("ArmL_1").rotation.z += deg(90);
			Mario.getObjectByName("ElbowR_1").rotation.z += deg(-0);
			Mario.getObjectByName("ElbowL_1").rotation.z += deg(0);
			Mario.getObjectByName("ArmR_1").rotation.y += deg(-5);
			Mario.getObjectByName("ArmL_1").rotation.y += deg(5);
			Mario.getObjectByName("HandR_1").rotation.set(deg(180), deg(180), deg(90));
			Mario.getObjectByName("HandL_1").rotation.set(deg(180), 0, deg(-90));
			Mario.getObjectByName("Finger1R_1").rotation.y += deg(40);
			Mario.getObjectByName("Finger1L_1").rotation.y += deg(-40);
			Mario.getObjectByName("Finger2R_1").rotation.z += deg(-80);
			Mario.getObjectByName("Finger2L_1").rotation.z += deg(-80);
			Mario.getObjectByName("Hip_1").rotation.x += deg(-25);
			Mario.getObjectByName("LegL_1").rotation.z += deg(65);
			Mario.getObjectByName("LegR_1").rotation.z += deg(-65);
			Mario.getObjectByName("LegL_1").rotation.x += deg(-20);
			Mario.getObjectByName("LegR_1").rotation.x += deg(20);
			Mario.getObjectByName("KneeL_1").rotation.z = deg(-70);
			Mario.getObjectByName("KneeR_1").rotation.z = deg(70);
			Mario.position.z += 0.25;
		}
	}, {
		name: "Luigi",
		model: "Models/Characters/Luigi/Luigi.dae",
		kart: "L Kart.dae",
		sitPosition: function () {
			Mario.children[3].visible = false;
			Mario.children[4].visible = false;
			Mario.getObjectByName("Luigi").position.z = -3;
			Mario.getObjectByName("Skl_Root_1").rotation.x += deg(-25);
			Mario.getObjectByName("Spine2_1").rotation.z += deg(20);
			Mario.getObjectByName("ArmR_1").rotation.z += deg(-90);
			Mario.getObjectByName("ArmL_1").rotation.z += deg(90);
			Mario.getObjectByName("ElbowR_1").rotation.z += deg(-0);
			Mario.getObjectByName("ElbowL_1").rotation.z += deg(0);
			Mario.getObjectByName("ArmR_1").rotation.y += deg(-5);
			Mario.getObjectByName("ArmL_1").rotation.y += deg(5);
			Mario.getObjectByName("HandR_1").rotation.set(deg(180), deg(180), deg(90));
			Mario.getObjectByName("HandL_1").rotation.set(deg(180), 0, deg(-90));
			Mario.getObjectByName("Finger1R_1").rotation.y += deg(40);
			Mario.getObjectByName("Finger1L_1").rotation.y += deg(-40);
			Mario.getObjectByName("Finger2R_1").rotation.z += deg(-80);
			Mario.getObjectByName("Finger2L_1").rotation.z += deg(-80);
			Mario.getObjectByName("Hip_1").rotation.x += deg(-25);
			Mario.getObjectByName("LegL_1").rotation.z += deg(65);
			Mario.getObjectByName("LegR_1").rotation.z += deg(-65);
			Mario.getObjectByName("LegL_1").rotation.x += deg(-20);
			Mario.getObjectByName("LegR_1").rotation.x += deg(20);
			Mario.getObjectByName("KneeL_1").rotation.z = deg(-70);
			Mario.getObjectByName("KneeR_1").rotation.z = deg(70);
			Mario.position.z += 0.25;
		}
	}, {
		name: "Toad",
		model: "Models/Characters/Toad/Toad.dae",
		kart: "T Kart.dae",
		sitPosition: function () {
			Mario.children[3].visible = false;
			Mario.children[4].visible = false;
			Mario.getObjectByName("Kinopio").scale.set(1.1, 1.1, 1.1);
			Mario.getObjectByName("Kinopio").position.z = -5;
			Mario.getObjectByName("ArmR_1").rotation.z += deg(-90);
			Mario.getObjectByName("ArmL_1").rotation.z += deg(90);
			Mario.getObjectByName("ElbowR_1").rotation.z += deg(-0);
			Mario.getObjectByName("ElbowL_1").rotation.z += deg(0);
			Mario.getObjectByName("ArmR_1").rotation.y += deg(-5);
			Mario.getObjectByName("ArmL_1").rotation.y += deg(5);
			Mario.getObjectByName("HandR_1").rotation.set(deg(180), deg(180), deg(90));
			Mario.getObjectByName("HandL_1").rotation.set(deg(180), 0, deg(-90));
			Mario.getObjectByName("Finger1R_1").rotation.y += deg(40);
			Mario.getObjectByName("Finger1L_1").rotation.y += deg(-40);
			Mario.getObjectByName("Finger2R_1").rotation.z += deg(-80);
			Mario.getObjectByName("Finger2L_1").rotation.z += deg(-80);
			Mario.getObjectByName("Hip_1").rotation.x += deg(-25);
			Mario.getObjectByName("LegL_1").rotation.z += deg(65);
			Mario.getObjectByName("LegR_1").rotation.z += deg(-65);
			Mario.getObjectByName("LegL_1").rotation.x += deg(-20);
			Mario.getObjectByName("LegR_1").rotation.x += deg(20);
			Mario.getObjectByName("KneeL_1").rotation.z = deg(-70);
			Mario.getObjectByName("KneeR_1").rotation.z = deg(70);
			Mario.position.z += 1;
		}
	}, {
		name: "Yoshi",
		model: "Models/Characters/Yoshi/Yoshi.dae",
		kart: "Y Kart.dae",
		sitPosition: function () {
			Mario.children[1].visible = false;
			Mario.children[2].visible = false;
			Mario.getObjectByName("Yoshi").position.z = -4;
			Mario.getObjectByName("Skl_Root_2").rotation.x += deg(-25);
			Mario.getObjectByName("Spine2_2").rotation.z += deg(20);
			Mario.getObjectByName("ArmR_2").rotation.z += deg(-90);
			Mario.getObjectByName("ArmL_2").rotation.z += deg(90);
			Mario.getObjectByName("ElbowR_2").rotation.z += deg(-0);
			Mario.getObjectByName("ElbowL_2").rotation.z += deg(0);
			Mario.getObjectByName("ArmR_2").rotation.y += deg(-5);
			Mario.getObjectByName("ArmL_2").rotation.y += deg(5);
			Mario.getObjectByName("HandR_2").rotation.set(deg(180), deg(180), deg(90));
			Mario.getObjectByName("HandL_2").rotation.set(deg(180), 0, deg(-90));
			Mario.getObjectByName("Finger1R_2").rotation.y += deg(40);
			Mario.getObjectByName("Finger1L_2").rotation.y += deg(-40);
			Mario.getObjectByName("Finger2R_2").rotation.z += deg(-80);
			Mario.getObjectByName("Finger2L_2").rotation.z += deg(-80);
			Mario.getObjectByName("Hip_2").rotation.x += deg(-25);
			Mario.getObjectByName("LegL_2").rotation.z += deg(65);
			Mario.getObjectByName("LegR_2").rotation.z += deg(-65);
			Mario.getObjectByName("LegL_2").rotation.x += deg(-20);
			Mario.getObjectByName("LegR_2").rotation.x += deg(20);
			Mario.getObjectByName("KneeL_2").rotation.z = deg(-70);
			Mario.getObjectByName("KneeR_2").rotation.z = deg(70);
			Mario.position.z += 1;
			Mario.getObjectByName("Tongue1_2").scale.y = 0.25;
		}
	}, {
		name: "Toadette",
		model: "Models/Characters/Toadette/Toadette.dae",
		kart: "TE Kart.dae",
		sitPosition: function () {
			Mario.children[3].visible = false;
			Mario.children[4].visible = false;
			Mario.getObjectByName("Kinopico").scale.set(1.1, 1.1, 1.1);
			Mario.getObjectByName("Kinopico").position.z = -5;
			Mario.getObjectByName("ArmR_1").rotation.z += deg(-90);
			Mario.getObjectByName("ArmL_1").rotation.z += deg(90);
			Mario.getObjectByName("ElbowR_1").rotation.z += deg(-0);
			Mario.getObjectByName("ElbowL_1").rotation.z += deg(0);
			Mario.getObjectByName("ArmR_1").rotation.y += deg(-5);
			Mario.getObjectByName("ArmL_1").rotation.y += deg(5);
			Mario.getObjectByName("HandR_1").rotation.set(deg(180), deg(180), deg(90));
			Mario.getObjectByName("HandL_1").rotation.set(deg(180), 0, deg(-90));
			Mario.getObjectByName("Finger1R_1").rotation.y += deg(40);
			Mario.getObjectByName("Finger1L_1").rotation.y += deg(-40);
			Mario.getObjectByName("Finger2R_1").rotation.z += deg(-80);
			Mario.getObjectByName("Finger2L_1").rotation.z += deg(-80);
			Mario.getObjectByName("Hip_1").rotation.x += deg(-25);
			Mario.getObjectByName("LegL_1").rotation.z += deg(65);
			Mario.getObjectByName("LegR_1").rotation.z += deg(-65);
			Mario.getObjectByName("LegL_1").rotation.x += deg(-20);
			Mario.getObjectByName("LegR_1").rotation.x += deg(20);
			Mario.getObjectByName("KneeL_1").rotation.z = deg(-70);
			Mario.getObjectByName("KneeR_1").rotation.z = deg(70);
			Mario.position.z += 1;
		}
	}, {
		name: "Peach",
		model: "Models/Characters/Peach/Peach.dae",
		kart: "P Kart.dae",
		sitPosition: function () {
			Mario.children[3].visible = false;
			Mario.children[4].visible = false;
			/*Mario.getObjectByName("Peach").position.z = -3;
			Mario.getObjectByName("Skl_Root_1").rotation.x += deg(-25);
			Mario.getObjectByName("Spine2_1").rotation.z += deg(20);
			Mario.getObjectByName("ArmR_1").rotation.z += deg(-90);
			Mario.getObjectByName("ArmL_1").rotation.z += deg(90);
			Mario.getObjectByName("ElbowR_1").rotation.z += deg(-0);
			Mario.getObjectByName("ElbowL_1").rotation.z += deg(0);
			Mario.getObjectByName("ArmR_1").rotation.y += deg(-5);
			Mario.getObjectByName("ArmL_1").rotation.y += deg(5);
			Mario.getObjectByName("HandR_1").rotation.set(deg(180), deg(180), deg(90));
			Mario.getObjectByName("HandL_1").rotation.set(deg(180), 0, deg(-90));
			Mario.getObjectByName("Finger1R_1").rotation.y += deg(40);
			Mario.getObjectByName("Finger1L_1").rotation.y += deg(-40);
			Mario.getObjectByName("Finger2R_1").rotation.z += deg(-80);
			Mario.getObjectByName("Finger2L_1").rotation.z += deg(-80);
			Mario.getObjectByName("Hip_1").rotation.x += deg(-25);
			Mario.getObjectByName("LegL_1").rotation.z += deg(65);
			Mario.getObjectByName("LegR_1").rotation.z += deg(-65);
			Mario.getObjectByName("LegL_1").rotation.x += deg(-20);
			Mario.getObjectByName("LegR_1").rotation.x += deg(20);
			Mario.getObjectByName("KneeL_1").rotation.z = deg(-70);
			Mario.getObjectByName("KneeR_1").rotation.z = deg(70);
			Mario.position.z += 0.25;*/
		}
	}, {
		name: "Daisy",
		model: "Models/Characters/Daisy/Daisy.dae",
		kart: "D Kart.dae",
		sitPosition: function () {
			Mario.children[3].visible = false;
			Mario.children[4].visible = false;
			/*Mario.getObjectByName("Daisy").position.z = -3;
			Mario.getObjectByName("Skl_Root_1").rotation.x += deg(-25);
			Mario.getObjectByName("Spine2_1").rotation.z += deg(20);
			Mario.getObjectByName("ArmR_1").rotation.z += deg(-90);
			Mario.getObjectByName("ArmL_1").rotation.z += deg(90);
			Mario.getObjectByName("ElbowR_1").rotation.z += deg(-0);
			Mario.getObjectByName("ElbowL_1").rotation.z += deg(0);
			Mario.getObjectByName("ArmR_1").rotation.y += deg(-5);
			Mario.getObjectByName("ArmL_1").rotation.y += deg(5);
			Mario.getObjectByName("HandR_1").rotation.set(deg(180), deg(180), deg(90));
			Mario.getObjectByName("HandL_1").rotation.set(deg(180), 0, deg(-90));
			Mario.getObjectByName("Finger1R_1").rotation.y += deg(40);
			Mario.getObjectByName("Finger1L_1").rotation.y += deg(-40);
			Mario.getObjectByName("Finger2R_1").rotation.z += deg(-80);
			Mario.getObjectByName("Finger2L_1").rotation.z += deg(-80);
			Mario.getObjectByName("Hip_1").rotation.x += deg(-25);
			Mario.getObjectByName("LegL_1").rotation.z += deg(65);
			Mario.getObjectByName("LegR_1").rotation.z += deg(-65);
			Mario.getObjectByName("LegL_1").rotation.x += deg(-20);
			Mario.getObjectByName("LegR_1").rotation.x += deg(20);
			Mario.getObjectByName("KneeL_1").rotation.z = deg(-70);
			Mario.getObjectByName("KneeR_1").rotation.z = deg(70);
			Mario.position.z += 0.25;*/
		}
	}, {
		name: "Rosalina",
		model: "Models/Characters/Rosalina/Rosalina.dae",
		kart: "R Kart.dae",
		sitPosition: function () {
			Mario.children[1].visible = false;
			Mario.children[2].visible = false;
			/*Mario.getObjectByName("Rosetta").position.z = -3;
			Mario.getObjectByName("Skl_Root_2").rotation.x += deg(-25);
			Mario.getObjectByName("Spine2_2").rotation.z += deg(20);
			Mario.getObjectByName("ArmR_2").rotation.z += deg(-90);
			Mario.getObjectByName("ArmL_2").rotation.z += deg(90);
			Mario.getObjectByName("ElbowR_2").rotation.z += deg(-0);
			Mario.getObjectByName("ElbowL_2").rotation.z += deg(0);
			Mario.getObjectByName("ArmR_2").rotation.y += deg(-5);
			Mario.getObjectByName("ArmL_2").rotation.y += deg(5);
			Mario.getObjectByName("HandR_2").rotation.set(deg(180), deg(180), deg(90));
			Mario.getObjectByName("HandL_2").rotation.set(deg(180), 0, deg(-90));
			Mario.getObjectByName("Finger1R_2").rotation.y += deg(40);
			Mario.getObjectByName("Finger1L_2").rotation.y += deg(-40);
			Mario.getObjectByName("Finger2R_2").rotation.z += deg(-80);
			Mario.getObjectByName("Finger2L_2").rotation.z += deg(-80);
			Mario.getObjectByName("Hip_2").rotation.x += deg(-25);
			Mario.getObjectByName("LegL_2").rotation.z += deg(65);
			Mario.getObjectByName("LegR_2").rotation.z += deg(-65);
			Mario.getObjectByName("LegL_2").rotation.x += deg(-20);
			Mario.getObjectByName("LegR_2").rotation.x += deg(20);
			Mario.getObjectByName("KneeL_2").rotation.z = deg(-70);
			Mario.getObjectByName("KneeR_2").rotation.z = deg(70);
			Mario.position.z += 0.25;*/
		}
	}
];

var tireLib = [
	{
		name: "Standard",
		model: ["Models/Vehicles/Tires/Standard/TireK_Std.dae", "Models/Vehicles/Tires/Standard/TireB_Std.dae"]
	}, {
		name: "Leaf",
		model: ["Models/Vehicles/Tires/Leaf/TireK_Leaf.dae", "Models/Vehicles/Tires/Leaf/TireB_Leaf.dae"]
	}, {
		name: "Slick",
		model: ["Models/Vehicles/Tires/Slick/TireK_Slk.dae", "Models/Vehicles/Tires/Slick/TireB_Slk.dae"]
	}, {
		name: "Cyber Slick",
		model: ["Models/Vehicles/Tires/Cyber Slick/TireK_Zsl.dae", "Models/Vehicles/Tires/Cyber Slick/TireB_Zsl.dae"]
	}, {
		name: "Ancient",
		model: ["Models/Vehicles/Tires/Ancient/TireK_Bow.dae", "Models/Vehicles/Tires/Ancient/TireB_Bow.dae"]
	}, {
		name: "Futuristic",
		model: ["Models/Vehicles/Tires/Futuristic/TireK_Ftr.dae", "Models/Vehicles/Tires/Futuristic/TireB_Ftr.dae"]
	}, {
		name: "Blue Standard",
		model: ["Models/Vehicles/Tires/Blue Standard/TireK_Std.dae", "Models/Vehicles/Tires/Blue Standard/TireB_Std.dae"]
	}, {
		name: "Gold Standard",
		model: ["Models/Vehicles/Tires/Gold Standard/TireK_Std.dae", "Models/Vehicles/Tires/Gold Standard/TireB_Std.dae"]
	}
];

var kartLib = [
	{
		name: "Standard kart",
		model: "Models/Vehicles/Karts/Standard kart/",
		type: 0
	}, {
		name: "Landship",
		model: "Models/Vehicles/Karts/Landship/",
		type: 0
	}, {
		name: "Flame Rider",
		model: "Models/Vehicles/Bikes/Flame Rider/",
		type: 1
	}, {
		name: "City Tripper",
		model: "Models/Vehicles/Bikes/City Tripper/",
		type: 1
	}, {
		name: "Standard Bike",
		model: "Models/Vehicles/Bikes/Standard Bike/",
		type: 1
	}
];

//scene
var scene = new THREE.Scene();
//scene.fog = new THREE.FogExp2(0xdffdff, 0.0005);
var sky = new THREE.CubeTextureLoader().load(["Images/skybox/right.png", "Images/skybox/left.png", "Images/skybox/top.png", "Images/skybox/bottom.png", "Images/skybox/front.png", "Images/skybox/back.png"]);
scene.background = sky;



//camera
var camdistance = 20;
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 30000);
camera.position.set(0, 5, camdistance);
//camera.rotation.z = deg(180);
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);



//sun
var sun = new THREE.DirectionalLight(0xffffee, 1);
sun.position.set(0, 1000, 0);
sun.position.multiplyScalar(1);
sun.castShadow = true;
sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;
var d = 200;
sun.shadow.camera.left = - d;
sun.shadow.camera.right = d;
sun.shadow.camera.top = d;
sun.shadow.camera.bottom = - d;
sun.shadow.camera.near = 10;
sun.shadow.camera.far = 10000000;
scene.add(sun);
scene.add(new THREE.HemisphereLight(0xffffff, 0x888888, 0.75));
//scene.add(new THREE.AmbientLight(0xdddddd));



//catch light
var main = new THREE.TextureLoader().load("Images/lensflare/main.png");
var burst = new THREE.TextureLoader().load("Images/lensflare/burst.png");
var hex = new THREE.TextureLoader().load("Images/lensflare/hexangle.png");
var round = new THREE.TextureLoader().load("Images/lensflare/round.png");
var small = new THREE.TextureLoader().load("Images/lensflare/small.png");
var lensflare = new THREE.Lensflare();
lensflare.addElement(new THREE.LensflareElement(main, 1000, 0, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(burst, 500, 0, new THREE.Color(0x444433)));
lensflare.addElement(new THREE.LensflareElement(small, 15, 0.1, new THREE.Color(0xffffee)));
lensflare.addElement(new THREE.LensflareElement(hex, 70, 0.125, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(hex, 90, 0.15, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(hex, 50, 0.2, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(hex, 100, 0.225, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(burst, 350, 0.275, new THREE.Color(0x444433)));
lensflare.addElement(new THREE.LensflareElement(small, 30, 0.275, new THREE.Color(0xffffee)));
lensflare.addElement(new THREE.LensflareElement(round, 200, 0.6, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(round, 500, 0.7, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(round, 50, 0.7, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(small, 20, 0.825, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(hex, 75, 0.9, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(small, 30, 0.95, new THREE.Color(0x888877)));
lensflare.addElement(new THREE.LensflareElement(round, 200, 1, new THREE.Color(0x888877)));
sun.add(lensflare);



//renderer
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;


//smoke
function initParticles() {
	particleGroup = new SPE.Group({
		texture: {
			value: THREE.ImageUtils.loadTexture("Images/smokeparticle.png")
		},
		blending: THREE.NormalBlending
	});

	REmitter = new SPE.Emitter({
		maxAge: {
			value: 0.75
		},
		position: {
			value: new THREE.Vector3(3.3, 4.0, -7.5),
			spread: new THREE.Vector3(0, 0, 0)
		},

		acceleration: {
			value: new THREE.Vector3(0, 0, 0),
			spread: new THREE.Vector3(0, 0, 0)
		},

		velocity: {
			value: new THREE.Vector3(0, 1, -2),
			spread: new THREE.Vector3(1, 1, 1)
		},

		color: {
			value: [new THREE.Color(0xffffff)]
		},

		opacity: {
			value: [0.75, 0.75, 0.75, 0]
		},
		size: {
			value: [4, 10],
			spread: 0
		},

		particleCount: 3
	});

	LEmitter = new SPE.Emitter({
		maxAge: {
			value: REmitter.maxAge.value
		},
		position: {
			value: new THREE.Vector3(-REmitter.position.value.x, REmitter.position.value.y, REmitter.position.value.z),
			spread: new THREE.Vector3(REmitter.position.spread.x, REmitter.position.spread.y, REmitter.position.spread.z)
		},

		acceleration: {
			value: new THREE.Vector3(REmitter.acceleration.value.x, REmitter.acceleration.value.y, REmitter.acceleration.value.z),
			spread: new THREE.Vector3(REmitter.acceleration.spread.x, REmitter.acceleration.spread.y, REmitter.acceleration.spread.z)
		},

		velocity: {
			value: new THREE.Vector3(REmitter.velocity.value.x, REmitter.velocity.value.y, REmitter.velocity.value.z),
			spread: new THREE.Vector3(REmitter.velocity.spread.x, REmitter.velocity.spread.y, REmitter.velocity.spread.z)
		},

		color: {
			value: REmitter.color.value
		},

		opacity: {
			value: REmitter.opacity.value
		},
		size: {
			value: REmitter.size.value,
			spread: REmitter.size.spread
		},

		particleCount: REmitter.particleCount
	});

	particleGroup.addEmitter(REmitter).addEmitter(LEmitter);
	console.log(particleGroup);
	particleGroup.mesh.renderOrder = 2;
	if (P1.kart == 0) {
		Mkart.children[0].children[0].add(particleGroup.mesh);
	}
}



//Models
var loadingManager = new THREE.LoadingManager(init);
var loader = new THREE.ColladaLoader(loadingManager);
//loader.options.convertUpAxis = true;
loader.load(trackLib[settings.track].model, function (collada) {
	track = collada.scene;
});
console.log(kartLib[P1.kart].model + characterLib[P1.character].kart);
loader.load(kartLib[P1.kart].model + characterLib[P1.character].kart, function (collada) {
	Mkart = collada.scene;
});
loader.load(tireLib[P1.tires].model[kartLib[P1.kart].type], function (collada) {
	Mwheels = collada.scene;
});
loader.load(characterLib[P1.character].model, function (collada) {
	Mario = collada.scene;
});



function init() {
	scene.add(track);
	track.position.set(trackLib[settings.track].position.x, trackLib[settings.track].position.y, trackLib[settings.track].position.z);
	track.scale.set(trackLib[settings.track].scale.x, trackLib[settings.track].scale.y, trackLib[settings.track].scale.z);
	track.rotation.set(trackLib[settings.track].rotation.x, trackLib[settings.track].rotation.y, trackLib[settings.track].rotation.z);

	scene.add(Mkart);
	Mkart.up.set(0, 1, 0);
	Mkart.rotation.order = "ZXY";
	if (kartLib[P1.kart].type == 0) {
		Mkart.children[1].skeleton.bones[0].scale.set(4.5, 4.5, 4.5);
		Mkart.children[1].skeleton.bones[0].rotation.set(deg(-87.5), 0, 0);
		characterLib[P1.character].sitPosition();
	} else if (kartLib[P1.kart].type == 1) {
		Mkart.scale.set(1, 1, 1);
		characterLib[P1.character].bikePosition();
		Mkart.children[1].skeleton.bones[0].position.y = 3.5;
		Mkart.children[1].skeleton.bones[0].position.z -= 0.15;
		Mkart.children[1].skeleton.bones[0].scale.set(0.75, 0.75, 0.75);
		Mkart.children[1].skeleton.bones[0].rotation.set(0, 0, 0);

	}



	if (kartLib[P1.kart].type == 0) {
		var BWRadius = 1.4;
		var FWRadius = 1.1;
		Mkart.add(Mwheels);
		console.log(Mwheels);
		Mwheels.position.set(0, 0, 0.75);
		Mwheels.scale.set(20, 20, 20);
		Mwheels.children[0].children[0].children[0].children[0].scale.set(BWRadius, BWRadius, BWRadius);
		Mwheels.children[0].children[0].children[0].children[0].position.y = -BWRadius + (BWRadius / 2);
		Mwheels.children[0].children[0].children[0].children[1].position.y = -FWRadius + (FWRadius / 1);
		Mwheels.children[0].children[0].children[0].children[0].position.z += 0.3;
		Mwheels.children[0].children[0].children[0].children[1].position.z -= 0.1;
		Mwheels.children[0].children[0].children[0].children[0].position.x += 0.3;
		Mwheels.children[0].children[0].children[0].children[1].scale.set(FWRadius, FWRadius, FWRadius);
		Mwheels.children[0].children[0].children[0].children[2].position.x += 0.3;
		Mwheels.children[0].children[0].children[0].children[2].position.z += 0.3;
		Mwheels.children[0].children[0].children[0].children[2].position.y = -BWRadius + (BWRadius / 2);
		Mwheels.children[0].children[0].children[0].children[2].scale.set(BWRadius, BWRadius, BWRadius);
		Mwheels.children[0].children[0].children[0].children[3].scale.set(FWRadius, FWRadius, FWRadius);
		Mwheels.children[0].children[0].children[0].children[3].position.z -= 0.1;
		Mwheels.children[0].children[0].children[0].children[3].position.y = -FWRadius + (FWRadius / 1);
	} else if (kartLib[P1.kart].type == 1) {
		var BWRadius = 2;
		var FWRadius = 1.5;
		Mkart.add(Mwheels);
		console.log(Mwheels);
		Mwheels.position.set(0, 0, 0.75);
		Mwheels.scale.set(20, 20, 20);
		Mwheels.children[0].children[0].children[0].children[0].scale.set(BWRadius, BWRadius, BWRadius);
		Mwheels.children[0].children[0].children[0].children[0].position.y = -BWRadius + (BWRadius / 2);
		Mwheels.children[0].children[0].children[0].children[1].position.y = -FWRadius + (FWRadius / 2);
		Mwheels.children[0].children[0].children[0].children[0].position.z -= 4;
		Mwheels.children[0].children[0].children[0].children[1].position.z += 3.5;
		Mwheels.children[0].children[0].children[0].children[0].position.x += 0.3;
		Mwheels.children[0].children[0].children[0].children[1].scale.set(FWRadius, FWRadius, FWRadius);
	}

	Mkart.add(Mario);
	Mario.scale.set(0.55, 0.55, 0.55);



	console.log(Mkart);
	console.log(Mwheels.children);
	console.log(Mario.children);
	console.log(track.children);
	sun.target = Mkart;
	var WSP = Mwheels.children[0].children[0].children[0].children[0].position.x;
	console.log(WSP);



	//water
	var riverGeometry = track.children[0].children[0].children[23].geometry;//new THREE.PlaneBufferGeometry(10000, 10000);
	river = new THREE.Water(riverGeometry, {
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: new THREE.TextureLoader().load("Models/Mario Circuit/ef_water_nrm.png", function (texture) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		}),
		alpha: 1,
		sunDirection: sun.position.clone().normalize(),
		sunColor: sun.color,
		waterColor: "skyblue", //0x001e0f,
		distortionScale: 1,
		fog: scene.fog !== undefined,
		//side: THREE.DoubleSide
	});
	river.scale.set(15, 15, 15);
	river.position.set(track.children[0].children[0].children[23].position.x, track.children[0].children[0].children[23].position.y - 764, track.children[0].children[0].children[23].position.z);
	/*track.children[0].children[0].children[23].visible = false;
	scene.add(river);*/



	var waterfallGeometry = track.children[0].children[0].children[64].geometry;
	waterfall = new THREE.Water(waterfallGeometry, {
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: new THREE.TextureLoader().load("Models/Mario Circuit/ef_water_nrm.png", function (texture) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		}),
		alpha: 1,
		sunDirection: sun.position.clone().normalize(),
		sunColor: sun.color,
		waterColor: "skyblue", //0x001e0f,
		distortionScale: 1,
		fog: scene.fog !== undefined,
		//side: THREE.DoubleSide
	});
	waterfall.scale.set(15, 15, 15);
	waterfall.position.set(track.children[0].children[0].children[64].position.x, track.children[0].children[0].children[64].position.y - 764, track.children[0].children[0].children[64].position.z);
	/*track.children[0].children[0].children[64].visible = false;
	scene.add(waterfall);*/



	var moatGeometry = track.children[0].children[0].children[34].geometry;
	moat = new THREE.Water(moatGeometry, {
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: new THREE.TextureLoader().load("Models/Mario Circuit/ef_water_nrm.png", function (texture) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		}),
		alpha: 1,
		sunDirection: sun.position.clone().normalize(),
		sunColor: sun.color,
		waterColor: "skyblue", //0x001e0f,
		distortionScale: 1,
		fog: scene.fog !== undefined,
		//side: THREE.DoubleSide
	});
	moat.scale.set(15, 15, 15);
	moat.position.set(track.children[0].children[0].children[34].position.x, track.children[0].children[0].children[34].position.y - 764, track.children[0].children[0].children[34].position.z);
	/*track.children[0].children[0].children[34].visible = false;
	scene.add(moat);*/



	if (settings.track == 1) {
		var seaGeometry = new THREE.PlaneGeometry(20000, 20000);//track.children[0].children[0].children[123].geometry;
		sea = new THREE.Water(seaGeometry, {
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load("Models/Tracks/Toad Harbor/ef_seawater_nrm.png", function (texture) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			}),
			alpha: 1,
			sunDirection: sun.position.clone().normalize(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 20,
			fog: scene.fog !== undefined,
			//side: THREE.DoubleSide
		});
		//sea.scale.set(15, 15, 15);
		//sea.position.set(track.children[0].children[0].children[123].position.x, track.children[0].children[0].children[123].position.y, track.children[0].children[0].children[123].position.z);
		sea.rotation.set(deg(-90), 0, 0);
		sea.position.set(5000, -15, 5000);
		track.children[0].children[0].children[123].visible = false;
		scene.add(sea);
	}




	//kart wheel lights
	var kartColorLib = [0x00ffff, 0xffbb00, 0xff44ff, 0x44ff44, 0xffffff];
	var kartLightColor = kartColorLib[0];
	var LightEffects = [new THREE.PointLight(kartLightColor, 0, 6, 1), new THREE.PointLight(kartLightColor, 0, 6, 1), new THREE.PointLight(kartLightColor, 0, 6, 1), new THREE.PointLight(kartLightColor, 0, 6, 1)];
	for (var i = 0; i < 4; i++) {
		LightEffects[i].target = scene;
		LightEffects[i].castShadow = false;
		try {
			Mwheels.children[0].children[0].children[0].children[i].add(LightEffects[i]);
		} catch (error) { }
	}



	var orbitUp, orbitDown, orbitLeft, orbitRight;
	var MkartForward, MkartBack, MkartLeft, MkartRight, steerangle = 0, drivespeed = 0, height = 2.01, drift = false, hover = false, forceStop = 0, direction = 0;
	var target = Mkart.position;
	var driftside = null;
	var onground = false;
	/*var tiltarget = new THREE.Object3D();
	var rotationMatrix = new THREE.Matrix4();
	var targetQuaternion = new THREE.Quaternion();*/
	var velocity = new THREE.Vector3();



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
			case "r":
				if (kartLightColor === kartColorLib[0]) {
					kartLightColor = kartColorLib[1];
				} else if (kartLightColor === kartColorLib[1]) {
					kartLightColor = kartColorLib[2];
				} else if (kartLightColor === kartColorLib[2]) {
					kartLightColor = kartColorLib[3];
				} else if (kartLightColor === kartColorLib[3]) {
					kartLightColor = kartColorLib[4];
				} else if (kartLightColor === kartColorLib[4]) {
					kartLightColor = kartColorLib[0];
				}
				break;
			case " ":
				if (hover === false) {
					hover = true;
				} else if (hover === true) {
					hover = false;
				}
				break;
			case "+":
				camdistance -= 5;
				break;
			case "-":
				camdistance += 5;
				break;
			case "=":
				camdistance = 20;
				break;
			case "ArrowUp":
				MkartForward = true;
				break;
			case "ArrowLeft":
				MkartLeft = true;
				break;
			case "ArrowDown":
				MkartBack = true;
				break;
			case "ArrowRight":
				MkartRight = true;
				break;
			case "Shift":
				if (MkartRight == true) {
					driftside = false;
				} else if (MkartLeft == true) {
					driftside = true;
				} else {
					driftside = null;
				}
				drift = true;
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
			case "ArrowUp":
				MkartForward = false;
				break;
			case "ArrowLeft":
				MkartLeft = false;
				break;
			case "ArrowDown":
				MkartBack = false;
				break;
			case "ArrowRight":
				MkartRight = false;
				break;
			case "Shift":
				drift = false;
				break;
		}
	};
	document.addEventListener("keydown", onKeyDown, false);
	document.addEventListener("keyup", onKeyUp, false);



	document.body.appendChild(renderer.domElement);


	initParticles();
	function animate() {
		requestAnimationFrame(animate);

		scene.traverse(function (child) {
			if (child instanceof THREE.SkinnedMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
				//child.material.normalMapType = THREE.ObjectSpaceNormalMap;
				//child.material.clearcoat = 1;
				//child.material.clearcoatRoughness = 0;
				//child.material.reflectivity = 5.2;
				//child.material.shininess = 32;
				child.material.specular = new THREE.Color(0xffffff);
				//child.material.envMap = sky;
				child.material.combine = THREE.MixOperation;
			} else if (child instanceof THREE.Mesh && child.id != river.id && child.id != waterfall.id && child.id != moat.id) {
				child.material.flatShading = false;
				child.material.reflectivity = 0.1;
				//child.material.envMap = sky;
				//child.material.shininess = 0;
				//child.material.specular = new THREE.Color(0xffffff);
				child.material.combine = THREE.MixOperation;
				child.castShadow = true;
				child.receiveShadow = true;
				if (child.material.map != null && child.name == "pPlane450__sign_all") {
					//child.material.map.anisotropy = 16;
				}
				if (child.material.transparent == true && child.name != "pPlane458__m_mist") {
					child.material.alphaTest = 0.5;
					if (child.name == "flowerA_white100_1_1__ct_ry_flowers01" || child.name == "polySurface8361345_1_1__mc_kusa" || child.name == "polySurface8361349_1_48__mc_kusa" || child.name == "polySurface83385__mc_Kusa") {
						child.material.side = THREE.DoubleSide;
					}
				}
				/*if (child.name == "polySurface8362054__m_CmnStartGrid") {
					child.visible = false;
				}*/
				if (child.name == "polySurface8361643__m_road_loght") {
					child.material.emissive = new THREE.Color(0xffffff);
					child.material.emissiveIntenisty = 100;
				}
				if (child.name == "polySurface1419__Road_ura" || child.name == "polySurface1419__Road_hakusen_ura" || child.name == "polySurface8362056__Road_exchange" || child.name == "pCube208_10__mc_hashi") {
					child.material.emissive = new THREE.Color(kartColorLib[0]);
					child.material.emissiveIntenisty = 100;
				}
				if (child.name == "polySurface83424__ef_river03" || child.name == "polySurface5949__ef_waterF" || child.name == "Water_Fall_01__ef_waterfall02") {
					child.material = new THREE.MeshBasicMaterial({
						color: "white",
						envMap: sky
					});
				}
			}
		});


		for (var i = 0; i < 4; i++) {
			try {
				Mwheels.children[0].children[0].children[0].children[i].children[0].material.emissive = new THREE.Color(kartLightColor);
			} catch (error) { }
		}
		for (var i = 0; i < 4; i++) {
			LightEffects[i].color = new THREE.Color(kartLightColor);
		}
		Mkart.children[1].material.emissive = new THREE.Color(kartLightColor);
		if (P1.kart == 1) {
			Mkart.children[3].material.emissive = new THREE.Color(kartLightColor);
			Mkart.children[4].material.emissive = new THREE.Color(kartLightColor);
		} else if (kartLib[P1.kart].type == 1) {
			Mkart.children[2].material.emissive = new THREE.Color(kartLightColor);
			Mkart.children[3].material.emissive = new THREE.Color(kartLightColor);
			Mkart.children[4].material.emissive = new THREE.Color(kartLightColor);
			Mkart.children[5].material.emissive = new THREE.Color(kartLightColor);
		}



		if (hover === true) {
			height = 2.49;
			if (kartLib[P1.kart].type == 0) {
				Mkart.children[1].skeleton.bones[0].rotation.z = -steerangle * 5;
			} else if (kartLib[P1.kart].type == 1) {
				Mkart.children[1].skeleton.bones[0].position.y = 0;
				Mkart.children[1].skeleton.bones[0].position.x = 0;
				Mkart.children[1].skeleton.bones[0].rotation.z = -steerangle * 5;
				Mkart.children[1].skeleton.bones[0].translateY(3.5);
			}
			if (Mwheels.children[0].children[0].children[0].children[0].rotation.z < deg(90)) {//deg(-(Math.abs(steerangle) * 500 + 5) + 82.5)) {
				Mkart.children[1].material.emissiveIntensity += 0.1;
				if (kartLib[P1.kart].type == 0) {
					Mkart.children[1].skeleton.bones[0].position.z = (Math.abs(steerangle) * -125);
				}
				if (P1.kart == 1) {
					Mkart.children[3].material.emissiveIntensity += 0.1;
					Mkart.children[4].material.emissiveIntensity += 0.1;
				} else if (kartLib[P1.kart].type == 1) {
					Mkart.children[2].material.emissiveIntensity += 0.1;
					Mkart.children[3].material.emissiveIntensity += 0.1;
					Mkart.children[4].material.emissiveIntensity += 0.1;
					Mkart.children[5].material.emissiveIntensity += 0.1;
				}
				for (var i = 0; i < 4; i++) {
					try {
						Mwheels.children[0].children[0].children[0].children[i].children[0].material.emissiveIntensity += 0.25;
					} catch (error) { }
				}
				/*for (var i = 0; i < 4; i++) {
					LightEffects[i].intensity += 0.25;
				}*/
				for (var i = 0; i < 4; i++) {
					try {
						Mwheels.children[0].children[0].children[0].children[i].rotation.x = 0;
					} catch (error) { }
				}
				Mwheels.children[0].children[0].children[0].children[0].rotation.z += 0.1;
				Mwheels.children[0].children[0].children[0].children[1].rotation.z += 0.1;

				if (kartLib[P1.kart].type == 0) {
					Mwheels.children[0].children[0].children[0].children[0].position.x += 0.05;
					Mwheels.children[0].children[0].children[0].children[1].position.x += 0.05;
					Mwheels.children[0].children[0].children[0].children[2].rotation.z -= 0.1;
					Mwheels.children[0].children[0].children[0].children[3].rotation.z -= 0.1;
					Mwheels.children[0].children[0].children[0].children[2].position.x -= 0.05;
					Mwheels.children[0].children[0].children[0].children[3].position.x -= 0.05;
				}
			} else {
				Mkart.children[1].material.emissiveIntensity = 1.5;
				if (P1.kart == 1) {
					Mkart.children[3].material.emissiveIntensity = 1.5;
					Mkart.children[4].material.emissiveIntensity = 1.5;
				} else if (kartLib[P1.kart].type == 1) {
					Mkart.children[2].material.emissiveIntensity = 1.5;
					Mkart.children[3].material.emissiveIntensity = 1.5;
					Mkart.children[4].material.emissiveIntensity = 1.5;
					Mkart.children[5].material.emissiveIntensity = 1.5;
				}
				for (var i = 0; i < 4; i++) {
					try {
						Mwheels.children[0].children[0].children[0].children[i].children[0].material.emissiveIntensity = 5;
					} catch (error) { }
				}
				for (var i = 0; i < 4; i++) {
					LightEffects[i].intensity = ((Math.sin(Date.now() * 0.0082) * 0.25) + 1);
				}
				for (var i = 0; i < 4; i++) {
					try {
						Mwheels.children[0].children[0].children[0].children[i].rotation.x = 0;
					} catch (error) { }
				}
				Mwheels.children[0].children[0].children[0].children[1].rotation.y += Math.abs(drivespeed * (settings.cc / 100)) + 0.205;
				Mwheels.children[0].children[0].children[0].children[0].rotation.y += Math.abs(drivespeed * (settings.cc / 100)) + 0.205;
				if (kartLib[P1.kart].type == 0) {
					Mwheels.children[0].children[0].children[0].children[2].rotation.y -= Math.abs(drivespeed * (settings.cc / 100)) + 0.205;
					Mwheels.children[0].children[0].children[0].children[3].rotation.y -= Math.abs(drivespeed * (settings.cc / 100)) + 0.205;
					Mwheels.children[0].children[0].children[0].children[2].rotation.z = deg(-90);//deg((Math.abs(steerangle) * 500) - 82.5);
					Mwheels.children[0].children[0].children[0].children[3].rotation.z = deg(-90);//deg((Math.abs(steerangle) * 500) - 82.5);
					Mwheels.children[0].children[0].children[0].children[2].position.x = -WSP - 0.75;
					Mwheels.children[0].children[0].children[0].children[3].position.x = -WSP - 0.1;
					Mwheels.children[0].children[0].children[0].children[0].position.x = WSP + 0.75;
					Mwheels.children[0].children[0].children[0].children[1].position.x = WSP + 0.1;
				}
				Mwheels.children[0].children[0].children[0].children[0].rotation.z = deg(90);//deg(-(Math.abs(steerangle) * 500) + 82.5);
				Mwheels.children[0].children[0].children[0].children[1].rotation.z = deg(90);//deg(-(Math.abs(steerangle) * 500) + 82.5);
			}

		} else {
			height = 2.01;
			if (kartLib[P1.kart].type == 0) {
				Mkart.children[1].skeleton.bones[0].rotation.z = 0;
			} else if (kartLib[P1.kart].type == 1) {
				Mkart.children[1].skeleton.bones[0].position.y = 0;
				Mkart.children[1].skeleton.bones[0].position.x = 0;
				Mkart.children[1].skeleton.bones[0].rotation.z = -steerangle * 5;
				Mkart.children[1].skeleton.bones[0].translateY(3.5);
			}
			if (Mwheels.children[0].children[0].children[0].children[0].rotation.z > 0) {
				Mkart.children[1].material.emissiveIntensity -= 0.1;
				if (P1.kart == 1) {
					Mkart.children[1].skeleton.bones[0].position.z = -8.25 * 0.5;
					Mkart.children[3].material.emissiveIntensity -= 0.1;
					Mkart.children[4].material.emissiveIntensity -= 0.1;
				} else if (kartLib[P1.kart].type == 1) {
					Mkart.children[1].skeleton.bones[0].position.z = -8.25 * 0.5 + 4;
					Mkart.children[2].material.emissiveIntensity -= 0.1;
					Mkart.children[3].material.emissiveIntensity -= 0.1;
					Mkart.children[4].material.emissiveIntensity -= 0.1;
					Mkart.children[5].material.emissiveIntensity -= 0.1;
				}
				for (var i = 0; i < 4; i++) {
					try {
						Mwheels.children[0].children[0].children[0].children[i].children[0].material.emissiveIntensity -= 0.25;
					} catch (error) { }
				}
				/*for (var i = 0; i < 4; i++) {
					LightEffects[i].intensity -= 0.25;
				}*/
				for (var i = 0; i < 4; i++) {
					try {
						Mwheels.children[0].children[0].children[0].children[i].rotation.x = 0;
					} catch (error) { }
				}
				if (kartLib[P1.kart].type == 0) {
					Mwheels.children[0].children[0].children[0].children[2].rotation.y = 0;
					Mwheels.children[0].children[0].children[0].children[3].rotation.y = 0;
					Mwheels.children[0].children[0].children[0].children[2].rotation.z += 0.1;
					Mwheels.children[0].children[0].children[0].children[3].rotation.z += 0.1;
					Mwheels.children[0].children[0].children[0].children[2].position.x += 0.05;
					Mwheels.children[0].children[0].children[0].children[3].position.x += 0.05;
					Mwheels.children[0].children[0].children[0].children[0].position.x -= 0.05;
					Mwheels.children[0].children[0].children[0].children[1].position.x -= 0.05;
				}


				Mwheels.children[0].children[0].children[0].children[0].rotation.y = 0;
				Mwheels.children[0].children[0].children[0].children[1].rotation.y = 0;
				Mwheels.children[0].children[0].children[0].children[0].rotation.z -= 0.1;
				Mwheels.children[0].children[0].children[0].children[1].rotation.z -= 0.1;

			} else {
				Mkart.children[1].material.emissiveIntensity = 0;
				if (P1.kart == 1) {
					Mkart.children[3].material.emissiveIntensity = 0;
					Mkart.children[4].material.emissiveIntensity = 0;
				} else if (kartLib[P1.kart].type == 1) {
					Mkart.children[2].material.emissiveIntensity = 0;
					Mkart.children[3].material.emissiveIntensity = 0;
					Mkart.children[4].material.emissiveIntensity = 0;
					Mkart.children[5].material.emissiveIntensity = 0;
				}
				for (var i = 0; i < 4; i++) {
					try {
						Mwheels.children[0].children[0].children[0].children[i].children[0].material.emissiveIntensity = 0;
					} catch (error) { }
				}
				for (var i = 0; i < 4; i++) {
					LightEffects[i].intensity = 0;
				}
				for (var i = 0; i < 4; i++) {
					LightEffects[i].intensity = 0;
				}
				for (var i = 0; i < 4; i++) {
					try {
						Mwheels.children[0].children[0].children[0].children[i].rotation.z = 0;
					} catch (error) { }
				}
				if (MkartForward == true) {
					Mwheels.children[0].children[0].children[0].children[0].rotation.x += (-2.5 * (settings.cc / 100)) / BWRadius;
					Mwheels.children[0].children[0].children[0].children[1].rotation.x += (-2.5 * (settings.cc / 100)) / FWRadius;

					if (kartLib[P1.kart].type == 0) {
						Mwheels.children[0].children[0].children[0].children[2].rotation.x += (-2.5 * (settings.cc / 100)) / BWRadius;
						Mwheels.children[0].children[0].children[0].children[3].rotation.x += (-2.5 * (settings.cc / 100)) / FWRadius;
						Mwheels.children[0].children[0].children[0].children[2].position.x = -WSP;
						Mwheels.children[0].children[0].children[0].children[3].position.x = -WSP + 0.2;
					}

					Mwheels.children[0].children[0].children[0].children[0].position.x = WSP;
					Mwheels.children[0].children[0].children[0].children[1].position.x = WSP - 0.2;
				} else {
					Mwheels.children[0].children[0].children[0].children[0].rotation.x += (drivespeed * (settings.cc / 100)) / BWRadius;
					Mwheels.children[0].children[0].children[0].children[1].rotation.x += (drivespeed * (settings.cc / 100)) / FWRadius;

					if (kartLib[P1.kart].type == 0) {
						Mwheels.children[0].children[0].children[0].children[2].rotation.x += (drivespeed * (settings.cc / 100)) / BWRadius;
						Mwheels.children[0].children[0].children[0].children[3].rotation.x += (drivespeed * (settings.cc / 100)) / FWRadius;
						Mwheels.children[0].children[0].children[0].children[2].position.x = -WSP;
						Mwheels.children[0].children[0].children[0].children[3].position.x = -WSP + 0.2;
					}

					Mwheels.children[0].children[0].children[0].children[0].position.x = WSP;
					Mwheels.children[0].children[0].children[0].children[1].position.x = WSP - 0.2;
				}
			}

		}

		var heightcaster = new THREE.Raycaster();
		var vector = new THREE.Vector3(0, -1, 0);
		vector.applyQuaternion(Mkart.quaternion);
		heightcaster.set(new THREE.Vector3(Mkart.position.x, Mkart.position.y, Mkart.position.z), vector);

		var intersects = heightcaster.intersectObjects(track.children, true);

		if (intersects[0] != undefined) {
			//tiltarget.position.set(intersects[0].face.normal.x * 15000, intersects[0].face.normal.y * 15000, intersects[0].face.normal.z * 15000);
			//rotationMatrix.lookAt(tiltarget.position, Mkart.position, Mkart.up);
			//targetQuaternion.setFromRotationMatrix(rotationMatrix);
			//if (!Mkart.quaternion.equals(targetQuaternion)) {
			//Mkart.quaternion.rotateTowards(targetQuaternion, 0.0001);
			//}
			if (height > intersects[0].distance) {
				if (settings.track == 0) {
					Mkart.lookAt(new THREE.Vector3(Mkart.position.x + intersects[0].face.normal.x, Mkart.position.y + intersects[0].face.normal.y, Mkart.position.z + intersects[0].face.normal.z));
				} else if (settings.track == 1) {
					Mkart.lookAt(new THREE.Vector3(Mkart.position.x + intersects[0].face.normal.z, Mkart.position.y + intersects[0].face.normal.y, Mkart.position.z + -intersects[0].face.normal.x));
				}
				Mkart.rotateX(deg(90));
				Mkart.rotation.y = 0;
				Mkart.rotateY(direction);
				onground = true;
				Mkart.translateY((height - intersects[0].distance) - 0.5);
				velocity.y = 0;
			} else {
				velocity.y -= 0.05;
				onground = false;
			}
			if (height >= intersects[0].distance && velocity.y <= 0) {
				velocity.y = 0;
			} else if (height <= intersects[0].distance && velocity.y === 0) {
				velocity.y += 2;
			}
		} else {
			velocity.y += 0.05;
			Mkart.rotation.x = 0;
			Mkart.rotation.z = 0;
		}
		Mkart.translateY(velocity.y);




		if (orbitUp === true) {
			camera.translateY(camdistance / 20);
		}
		if (orbitDown === true) {
			camera.translateY(-camdistance / 20);
		}
		if (orbitRight === true) {
			camera.translateX(camdistance / 20);
		}
		if (orbitLeft === true) {
			camera.translateX(-camdistance / 20);
		}


		REmitter.acceleration.value = REmitter.acceleration.value.set(steerangle * 125, (-(drivespeed * (settings.cc / 100)) * 2) + 1, ((drivespeed * (settings.cc / 100)) * 5) - 2);
		LEmitter.acceleration.value = LEmitter.acceleration.value.set(steerangle * 125, (-(drivespeed * (settings.cc / 100)) * 2) + 1, ((drivespeed * (settings.cc / 100)) * 5) - 2);
		if (onground) {
			if (MkartForward === true) {
				//REmitter.particleCount = 5;
				//REmitter.velocity.value = REmitter.velocity.value.set(0, -drivespeed/2, drivespeed);
				//LEmitter.velocity.value = LEmitter.velocity.value.set(0, -drivespeed/2, drivespeed);
				//LEmitter.particleCount = 5;
				if (drivespeed > -2.5) {
					drivespeed -= 0.1;
				}
			} else if (MkartBack === true) {
				//REmitter.particleCount = 5;
				//LEmitter.particleCount = 5;
				if (drivespeed < 1.5) {
					drivespeed += 0.1;
				}
			} else {
				//REmitter.velocity.value = REmitter.velocity.value.set(0, 0, 0);
				//LEmitter.velocity.value = LEmitter.velocity.value.set(0, 0, 0);
				//REmitter.particleCount = 2;
				//LEmitter.particleCount = 2;
				drivespeed = drivespeed * 0.97;
				if (drivespeed < 0.05 && drivespeed > -0.05) {
					drivespeed = 0;
				}
			}
			if (drivespeed < -2) {
				REmitter.disable();
				LEmitter.disable();
			} else {
				REmitter.enable();
				LEmitter.enable();
			}


			if (MkartRight === true) {
				steerangle -= (0.05 - 0.005) * (-drivespeed / 25);
			} else if (MkartLeft === true) {
				steerangle += (0.05 - 0.005) * (-drivespeed / 25);
			}
			steerangle = steerangle * 0.9;

			if (drift == true) {
				if (driftside == true) {
					Mkart.translateX((drivespeed * (settings.cc / 100)) / 2);
					direction += ((steerangle * 0.5) + 0.025);
				} else if (driftside == false) {
					Mkart.translateX((-drivespeed * (settings.cc / 100)) / 2);
					direction += ((steerangle * 0.5) - 0.025);
				}
			} else {
				direction += (steerangle);
			}
		}
		if (forceStop == 0) {
			Mkart.translateZ(-drivespeed * (settings.cc / 100));

			if (target === Mkart.position) {
				camera.translateY(Math.abs(drivespeed * (settings.cc / 100)) / 5);
			}
			if (target === Mkart.position) {
				camera.translateX(steerangle / 2 * camdistance);
			}
		}
		Mwheels.rotation.set(deg(90), Mkart.children[1].skeleton.bones[0].rotation.z + deg(180), 0);
		Mwheels.position.y = ((-Mkart.children[1].skeleton.bones[0].position.z) / 8.25) - 0.5;
		Mario.rotation.y = -Mkart.children[1].skeleton.bones[0].rotation.z;
		Mario.position.y = -Mkart.children[1].skeleton.bones[0].position.z / 10;


		camera.lookAt(target);
		//camera.rotation.z += deg(180);
		camera.translateZ(-(distance(camera.position, target) - camdistance) / 5);


		/*river.material.uniforms["time"].value += 1.0 / 60.0;
		waterfall.material.uniforms["time"].value += 1.0 / 60.0;
		moat.material.uniforms["time"].value += 1.0 / 60.0;*/
		if (settings.track == 1) {
			sea.material.uniforms["time"].value += 2.0 / 60.0;
		}
		particleGroup.tick(0.05);

		//REmitter.position.value = REmitter.position.value.set(Mkart.position.x, Mkart.position.y, Mkart.position.z);
		//LEmitter.position.value = LEmitter.position.value.set(Mkart.position.x, Mkart.position.y, Mkart.position.z);


		if (forceStop != 0) {
			forceStop -= 1;
		}

		sun.position.set(Mkart.position.x + 1000, Mkart.position.y + 2000, Mkart.position.z - 1000);

		renderer.render(scene, camera);
	}
	animate();
}