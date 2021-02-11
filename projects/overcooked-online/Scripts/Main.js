var tau = Math.PI * 2;

THREE.MathUtils.damp = function (x, y, lambda, dt) {
    return THREE.MathUtils.lerp(x, y, 1 - Math.exp(- lambda * dt));
}

function deg(number) {
    return (number * tau) / 360;
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function arrayDifference(a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
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

if (getUrlParameter("debug") != "0") {
    stats = new Stats(0.1);
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
}

var chefList = [];

var chefControls = {
    keyUp: "ArrowUp",
    keyDown: "ArrowDown",
    keyLeft: "ArrowLeft",
    keyRight: "ArrowRight",
    keyPickUp: "z",
    keyAction: "x",
    keyDash: "c",

    up: false,
    down: false,
    left: false,
    right: false,
    dash: false,
    throw: false,
    holding: ""
}

var kitchenObjects = [];

var chefCollisionBoxes = [];
function createChef(name, color) {
    var model = new THREE.Group();
    var radialSegments = 16;

    // materials
    var whiteFabric = new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/MatteWhite.png") });
    var skin = new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/Skin.png") });
    var coloredFabric = new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/Metallic" + color + ".png") });
    var shadowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: artist.load("Images/roundshadowMask.png"), transparent: true, opacity: 0.55, depthWrite: false });

    // meshes
    var hat = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.5, 0.5, 0.5, radialSegments, 1, true), whiteFabric);
    var frontLeftPuff = new THREE.Mesh(new THREE.SphereBufferGeometry(0.3, radialSegments / 2, radialSegments / 2), whiteFabric);
    frontLeftPuff.scale.set(1.5, 1.25, 1.5);
    var frontCenterPuff = frontLeftPuff.clone();
    var frontRightPuff = frontLeftPuff.clone();
    var backLeftPuff = frontLeftPuff.clone();
    var backCenterPuff = frontLeftPuff.clone();
    var backRightPuff = frontLeftPuff.clone();
    var head = new THREE.Mesh(new THREE.SphereBufferGeometry(0.7, radialSegments / 1.5, radialSegments / 1.5), skin);
    var bandana = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.6, 0.6, 0.2, radialSegments, 1, true), coloredFabric);
    var coat = new THREE.Mesh(new THREE.SphereBufferGeometry(1.1, radialSegments, radialSegments / 3, 0, deg(360), 0, deg(80)), coloredFabric);
    var rightHand = new THREE.Mesh(new THREE.SphereBufferGeometry(0.35, radialSegments / 2, radialSegments / 2), skin);
    var leftHand = rightHand.clone();
    var apron = new THREE.Mesh(new THREE.SphereBufferGeometry(1.15, radialSegments / 4, radialSegments / 3, deg(230), deg(80), 0, deg(82.5)), whiteFabric);
    var apronRibbon = new THREE.Mesh(new THREE.SphereBufferGeometry(1.14, radialSegments, 1, 0, deg(360), deg(60), deg(5)), whiteFabric);
    var body = new THREE.Mesh(new THREE.SphereBufferGeometry(1, radialSegments / 2, radialSegments / 3, 0, deg(360), deg(90), deg(90)), whiteFabric);
    var shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(3, 3), shadowMaterial);

    // assembly
    var headGroup = new THREE.Group();
    model.add(headGroup);

    hat.position.set(0, 2.3, 0.275);
    hat.rotation.set(deg(22), 0, 0);
    headGroup.add(hat);

    frontLeftPuff.position.set(-0.35, 0.5, -0.2);
    hat.add(frontLeftPuff);
    frontCenterPuff.position.set(0, 0.5, -0.41);
    hat.add(frontCenterPuff);
    frontRightPuff.position.set(0.35, 0.5, -0.2);
    hat.add(frontRightPuff);
    backLeftPuff.position.set(-0.35, 0.5, 0.2);
    hat.add(backLeftPuff);
    backCenterPuff.position.set(0, 0.5, 0.4);
    hat.add(backCenterPuff);
    backRightPuff.position.set(0.35, 0.5, 0.2);
    hat.add(backRightPuff);

    head.position.set(0, 1.75, 0);
    head.scale.set(1, 0.8, 1);
    headGroup.add(head);

    bandana.position.set(0, 1.4, 0);
    model.add(bandana);

    coat.position.set(0, 0.4, 0);
    model.add(coat);

    rightHand.position.set(1.4, 0.75, 0);
    model.add(rightHand);
    leftHand.position.set(-1.4, 0.75, 0);
    model.add(leftHand);

    apron.position.set(0, 0.35, 0);
    model.add(apron);
    apronRibbon.position.set(0, 0.35, 0);
    model.add(apronRibbon);

    body.position.set(0, 0.7, 0);
    body.scale.set(1, 0.7, 1);
    model.add(body);

    shadow.rotation.set(deg(-90), 0, 0);
    model.add(shadow);

    if (name != "") {
        chefCollisionBoxes[name] = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 3, 2), new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, depthWrite: false }));
        chefCollisionBoxes[name].name = "chefCollisionBox";
        physicalObjects.add(chefCollisionBoxes[name]);
    }

    return model
}

function createFood(kind, position) {
    switch (kind) {
        case "box":
            kitchenObjects.push(new THREE.Mesh(new THREE.BoxBufferGeometry(1.25, 1.25, 1.25), new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/GlossyRed.png") })));
            kitchenObjects[kitchenObjects.length - 1].userData.bottom = 0.5;
            kitchenObjects[kitchenObjects.length - 1].userData.kind = "box";
            break;
        case "sphere":
            kitchenObjects.push(new THREE.Mesh(new THREE.SphereBufferGeometry(0.75), new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/GlossyRed.png") })));
            kitchenObjects[kitchenObjects.length - 1].userData.bottom = 0.5;
            kitchenObjects[kitchenObjects.length - 1].userData.kind = "sphere";
            break;
    }
    kitchenObjects[kitchenObjects.length - 1].position.copy(position);
    kitchenObjects[kitchenObjects.length - 1].userData.pickup = true;
    kitchenObjects[kitchenObjects.length - 1].userData.linearVelocity = new THREE.Vector3();
    kitchenObjects[kitchenObjects.length - 1].userData.angularVelocity = new THREE.Vector3();
    kitchenObjects[kitchenObjects.length - 1].userData.type = "food";
    kitchenObjects[kitchenObjects.length - 1].userData.onTopOf = "";
    return kitchenObjects[kitchenObjects.length - 1];
}

var clock = new THREE.Clock();

var kitchens = [
    [[1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "order"],
    ["trash", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, "plates"],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, "cut", "cut", 0, 0, 0, 0, 0, 0, 0, "cut", "cut", 1]]
];
var kitchenIngredients = [["box", "sphere"]];

var socket;
var chef;


function socketConnect() {
    var colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Black", "White"];
    var chefColor = colors[Math.floor(Math.random() * colors.length)];
    do {
        var username = prompt("Enter your chef's name: ");
    } while (username == null);

    socket = io("https://Overcooked-Online-socketio-server.techlabsinc.repl.co", { transports: ['websocket', 'polling'] });

    socket.on("connect", function () {
        document.getElementById("usersConnected").innerHTML = "Users Connected: 1<br/>" + username + "<br/>";
        // receive a message from anyone
        socket.on("message", function (message) {
            console.log("received a message", message);
        });

        // receive a direct message
        socket.on("direct-message", function (message) {
            console.log("received a direct message", message);
        });

        socket.on("updatePositions", function (data) {
            for (var id in data.list) {
                if (data.list[id].name != username) {
                    try {
                        chefList[data.list[id].name].position.set(data.list[id].position.x, data.list[id].position.y, data.list[id].position.z);
                        chefList[data.list[id].name].rotation.set(data.list[id].rotation.x, data.list[id].rotation.y, data.list[id].rotation.z);
                        chefCollisionBoxes[data.list[id].name].position.set(data.list[id].position.x, data.list[id].position.y + 1.5, data.list[id].position.z);
                    } catch (e) { }
                }
            }
        });

        socket.on("getUsers", function (data) {
            var usedColors = [];
            var colorTaken = false;
            document.getElementById("usersConnected").innerHTML = "Users Connected: " + Object.keys(data.list).length + "<br/>";
            for (var id in data.list) {
                if (data.list[id].name != username) {
                    usedColors.push(data.list[id].color);
                    if (data.list[id].color == chefColor) {
                        colorTaken = true;
                    }
                }
                if (data.list[id].name == username) {
                    document.getElementById("usersConnected").innerHTML += "<span style='color: " + data.list[id].color + ";'>" + data.list[id].name + " (Me)</span><br/>";
                    chef.children[2].material.matcap = artist.load("Images/Materials/Metallic" + chefColor + ".png");
                } else {
                    document.getElementById("usersConnected").innerHTML += "<span style='color: " + data.list[id].color + ";'>" + data.list[id].name + "</span><br/>";

                    try {
                        scene.remove(chefList[data.list[id].name]);
                    } catch (e) { console.log(e); }
                    try {
                        physicalObjects.remove(chefCollisionBoxes[data.list[id].name]);
                    } catch (e) { console.log(e); }


                    chefList[data.list[id].name] = createChef(data.list[id].name, data.list[id].color);
                    chefList[data.list[id].name].position.copy(data.list[id].position);
                    chefCollisionBoxes[data.list[id].name].position.set(data.list[id].position.x, data.list[id].position.y + 1.5, data.list[id].position.z);
                    try {
                        chefList[data.list[id].name].rotation.set(data.list[id].rotation.x, data.list[id].rotation.y, data.list[id].rotation.z);
                    } catch (e) { }
                    scene.add(chefList[data.list[id].name]);
                    console.log(chefList[data.list[id].name]);
                }
            }
            if (colorTaken == true) {
                chefColor = arrayDifference(colors, usedColors)[Math.floor(Math.random() * colors.length)] || "White";
                socket.emit("register", { name: username, color: chefColor, position: chef.position });
            }
        });
        // know when a user has joined the server
        socket.on("user-connect", function (data) {
            console.log("user " + data.name + " has connected to the server");
        });

        // or left the server
        socket.on("user-disconnect", function (data) {
            try {
                scene.remove(chefList[data.name]);
            } catch (e) { console.log(e); }
            try {
                physicalObjects.remove(chefCollisionBoxes[data.name]);
            } catch (e) { console.log(e); }
            console.log("user " + data.name + " has disconnected from the server");
        });
        socket.emit("register", { name: username, color: chefColor, position: new THREE.Vector3(), rotation: new THREE.Vector3(), kitchenObjects: {} });
    });
}

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef6ff);

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000000000);
camera.position.set(0, 20, -11.5);
camera.lookAt(scene.position.x, scene.position.y, scene.position.z - 1.5);


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

function changeQuality(loq) {
    if (loq == 3) {
        document.body.removeChild(renderer.domElement);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
    } else if (loq == 2) {
        document.body.removeChild(renderer.domElement);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
    } else {
        document.body.removeChild(renderer.domElement);
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
    }
}

var artist = new THREE.TextureLoader();

var physicalObjects = new THREE.Group();

window.addEventListener("touchmove", function (e) {
    e.preventDefault();
})

function init() {
    chef = createChef("", "White");
    scene.add(chef);


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize, false);

    var groundTile = artist.load("Images/ClassicFloor.jpg");
    groundTile.wrapS = THREE.RepeatWrapping;
    groundTile.wrapT = THREE.RepeatWrapping;
    groundTile.repeat.set(25, 25);

    var groundTileNrm = artist.load("Images/ClassicFloorNrm.jpg");
    groundTileNrm.wrapS = THREE.RepeatWrapping;
    groundTileNrm.wrapT = THREE.RepeatWrapping;
    groundTileNrm.repeat.set(25, 25);

    var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshMatcapMaterial({ map: groundTile, normalMap: groundTileNrm, matcap: artist.load("Images/Materials/MatteWhite.png") }));
    ground.rotation.set(deg(-90), 0, 0);
    ground.position.z = 1;
    scene.add(ground);

    ground.material.depthWrite = false;
    var level = 1;
    var zlength = 0;
    var xlength = 0;
    var kitchen = new THREE.Group();
    var boxNumber = 0;
    for (var z = 0; z < kitchens[level - 1].length; z++) {
        if (z > zlength) {
            zlength = z;
        }
        for (var x = 0; x < kitchens[level - 1][z].length; x++) {
            if (x > xlength) {
                xlength = x;
            }
            switch (kitchens[level - 1][z][x]) {
                case 1:
                    var block = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.1, 1), new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/GlossyWhite.png"), normalMap: artist.load("Images/counter.png") }));
                    block.position.y = 0.45;
                    block.add(new THREE.Mesh(new THREE.BoxBufferGeometry(0.95, 0.4, 0.95), block.material));
                    block.children[0].position.y = -0.2;
                    block.userData.objectOnTop = false;
                    break;
                case 2:
                    var block = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.5, 1), new THREE.MeshMatcapMaterial({ map: artist.load("Images/crate.gif"), matcap: artist.load("Images/Materials/GlossyWhite.png") }));
                    block.name = "foodBox";
                    block.userData.Ingredient = kitchenIngredients[level - 1][boxNumber];
                    boxNumber++;
                    block.position.y = 0.25;
                    block.userData.objectOnTop = false;
                    break;
                case "cut":
                    var block = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.2, 1), new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/GlossyWhite.png"), normalMap: artist.load("Images/counter.png") }));
                    block.position.y = 0.4;
                    block.add(new THREE.Mesh(new THREE.BoxBufferGeometry(0.975, 0.3, 0.975), block.material));
                    block.children[0].position.y = -0.25;
                    block.userData.objectOnTop = false;
                    break;
                case "trash":
                    var block = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.5, 1), new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/GlossyWhite.png"), side: THREE.BackSide }));
                    block.name = "trash";
                    block.position.y = 0.25;
                    break;
            }
            if (kitchens[level - 1][z][x] != 0) {
                block.add(chef.children[8].clone());
                block.children[block.children.length - 1].position.y = -0.4;
                block.children[block.children.length - 1].scale.set(0.75, 0.75, 1);
                block.add(new THREE.Mesh(new THREE.BoxBufferGeometry(1.3, 0.5, 1.3), new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, depthWrite: false })));
                block.children[block.children.length - 1].position.y = -0.3;
                block.position.x = -x;
                block.position.z = -z;
                kitchen.add(block);
            }
        }
    }
    kitchen.position.set(xlength, 0, zlength);
    kitchen.scale.set(2, 2, 2);
    physicalObjects.add(kitchen);
    scene.add(physicalObjects);


    var group = new SPE.Group({
        texture: {
            value: THREE.ImageUtils.loadTexture("Images/sprite-explosion2.png"),
            frames: new THREE.Vector2(5, 5),
            loop: 1
        },
        depthTest: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        scale: 600
    }),
        shockwaveGroup = new SPE.Group({
            texture: {
                value: THREE.ImageUtils.loadTexture("Images/smokeParticle.png"),
            },
            depthTest: false,
            depthWrite: true,
            blending: THREE.NormalBlending,
        }),
        shockwave = new SPE.Emitter({
            particleCount: 200,
            type: SPE.distributions.DISC,
            position: {
                radius: 5,
                spread: new THREE.Vector3(5)
            },
            maxAge: {
                value: 2,
                spread: 0
            },
            // duration: 1,
            activeMultiplier: 2000,

            velocity: {
                value: new THREE.Vector3(40)
            },
            rotation: {
                axis: new THREE.Vector3(1, 0, 0),
                angle: Math.PI * 0.5,
                static: true
            },
            size: { value: 5 },
            color: {
                value: [
                    new THREE.Color(0.4, 0.2, 0.1),
                    new THREE.Color(0.2, 0.2, 0.2)
                ]
            },
            opacity: { value: [0.5, 0.2, 0] }
        }),
        debris = new SPE.Emitter({
            particleCount: 100,
            type: SPE.distributions.SPHERE,
            position: {
                radius: 0.1,
            },
            maxAge: {
                value: 2
            },
            // duration: 2,
            activeMultiplier: 40,

            velocity: {
                value: new THREE.Vector3(100)
            },
            acceleration: {
                value: new THREE.Vector3(0, -20, 0),
                distribution: SPE.distributions.BOX
            },
            size: { value: 2 },
            drag: {
                value: 1
            },
            color: {
                value: [
                    new THREE.Color(1, 1, 1),
                    new THREE.Color(1, 1, 0),
                    new THREE.Color(1, 0, 0),
                    new THREE.Color(0.4, 0.2, 0.1)
                ]
            },
            opacity: { value: [0.4, 0] }
        }),
        fireball = new SPE.Emitter({
            particleCount: 20,
            type: SPE.distributions.SPHERE,
            position: {
                radius: 1,
                distribution: SPE.distributions.SPHERE
            },
            maxAge: { value: 2 },
            // duration: 1,
            activeMultiplier: 20,
            velocity: {
                value: new THREE.Vector3(10)
            },
            size: { value: [20, 100] },
            color: {
                value: [
                    new THREE.Color(0.5, 0.1, 0.05),
                    new THREE.Color(0.2, 0.2, 0.2)
                ]
            },
            opacity: { value: [0.5, 0.35, 0.1, 0] }
        }),
        mist = new SPE.Emitter({
            particleCount: 50,
            position: {
                spread: new THREE.Vector3(10, 10, 10),
                distribution: SPE.distributions.SPHERE
            },
            maxAge: { value: 2 },
            // duration: 1,
            activeMultiplier: 2000,
            velocity: {
                value: new THREE.Vector3(8, 3, 10),
                distribution: SPE.distributions.SPHERE
            },
            size: { value: 40 },
            color: {
                value: new THREE.Color(0.2, 0.2, 0.2)
            },
            opacity: { value: [0, 0, 0.2, 0] }
        }),
        flash = new SPE.Emitter({
            particleCount: 50,
            position: { spread: new THREE.Vector3(5, 5, 5) },
            velocity: {
                spread: new THREE.Vector3(30),
                distribution: SPE.distributions.SPHERE
            },
            size: { value: [2, 20, 20, 20] },
            maxAge: { value: 2 },
            activeMultiplier: 2000,
            opacity: { value: [0.5, 0.25, 0, 0] }
        });

    group.addEmitter(fireball).addEmitter(flash);
    shockwaveGroup.addEmitter(debris).addEmitter(mist);
    scene.add(shockwaveGroup.mesh);
    scene.add(group.mesh);

    group.mesh.frustumCulled = false;
    shockwaveGroup.mesh.frustumCulled = false;

    fireball.disable();
    mist.disable();
    debris.disable();
    flash.disable();
    shockwave.disable();


    var propSmoke = new SPE.Group({
        texture: {
            value: THREE.ImageUtils.loadTexture("Images/smokeParticleDark.png"),
        },
        depthTest: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        transparent: true,
        alphaTest: 0.5,
    });

    var propSmokeParams = {
        maxAge: {
            value: 0.5
        },
        position: {
            value: new THREE.Vector3(3.3, 4.0, -7.5),
            spread: new THREE.Vector3(3, 3, 3)
        },

        acceleration: {
            value: new THREE.Vector3(0, -30, 0),
            spread: new THREE.Vector3(30, 0, 30)
        },

        velocity: {
            value: new THREE.Vector3(0, 30, 0),
            spread: new THREE.Vector3(10, 10, 10)
        },

        color: {
            value: [new THREE.Color(0xffffff)]
        },

        opacity: {
            value: [0.75, 0.75, 0.75, 0]
        },
        size: {
            value: [5, 10],
            spread: 0
        },

        particleCount: 100
    };

    var propSmoke1 = new SPE.Emitter(propSmokeParams);
    var propSmoke2 = new SPE.Emitter(propSmokeParams);
    var propSmoke3 = new SPE.Emitter(propSmokeParams);
    var propSmoke4 = new SPE.Emitter(propSmokeParams);
    propSmoke1.disable();
    propSmoke2.disable();
    propSmoke3.disable();
    propSmoke4.disable();
    propSmoke.addEmitter(propSmoke1).addEmitter(propSmoke2).addEmitter(propSmoke3).addEmitter(propSmoke4);
    scene.add(propSmoke.mesh);
    propSmoke.mesh.frustumCulled = false;
    propSmoke.mesh.renderOrder = 2;

    var screenShot = false;
    var chefLinearVelocity = new THREE.Vector3();
    var chefSpeedLimit = 2;
    var chefAcceleration = 1.25;
    var chefDamping = 5;
    var chefRestitution = 0.95;
    var chefHeading = 0;
    THREE.BufferGeometry.prototype.computeBoundsTree = MeshBVHLib.computeBoundsTree;
    THREE.BufferGeometry.prototype.disposeBoundsTree = MeshBVHLib.disposeBoundsTree;
    THREE.Mesh.prototype.raycast = MeshBVHLib.acceleratedRaycast;
    var chefCollision = new THREE.Raycaster();
    chefCollision.firstHitOnly = true;
    var objectCollision = new THREE.Raycaster();
    objectCollision.firstHitOnly = true;
    var collisionDirections = [new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)];
    var chefDistances = [1, 1, 1, 1, 1, 1];
    var pposition = new THREE.Vector3();
    var selected = [false, 10000];


    var holdanimation;
    var handanimations = [];
    var onKeyDown = function (event) {
        switch (event.key) {
            case chefControls.keyUp:
                chefControls.up = true;
                break;
            case chefControls.keyDown:
                chefControls.down = true;
                break;
            case chefControls.keyLeft:
                chefControls.left = true;
                break;
            case chefControls.keyRight:
                chefControls.right = true;
                break;

            case chefControls.keyPickUp:
                var selectedObject = scene.getObjectById(selected[0], true);
                if (chefControls.holding == "") {
                    if (selectedObject.userData.pickup) {
                        chefControls.holding = selectedObject;
                        chefControls.holding.position.set(0, 1.5, -1.5);
                        chefControls.holding.rotation.set(0, 0, 0);
                        chef.add(chefControls.holding);
                        chefControls.holding.userData.onGround = false;
                        if (chefControls.holding.userData.onTopOf != "") {
                            kitchen.getObjectById(chefControls.holding.userData.onTopOf).userData.objectOnTop = "";
                            chefControls.holding.userData.onTopOf = "";
                        }
                        try {
                            handanimations[0].stop();
                            handanimations[1].stop();
                        } catch (e) { }
                        handanimations[0] = new TWEEN.Tween(chef.children[3].position).to({ x: 0.75, y: 1, z: -1 }, 100).easing(TWEEN.Easing.Cubic.Out).start();
                        handanimations[1] = new TWEEN.Tween(chef.children[4].position).to({ x: -0.75, y: 1, z: -1 }, 100).easing(TWEEN.Easing.Cubic.Out).start();
                    } else {
                        if (selectedObject.name == "foodBox") {
                            chefControls.holding = createFood(selectedObject.userData.Ingredient, new THREE.Vector3(0, 1.5, -1.5));
                            chef.add(chefControls.holding);
                            chefControls.holding.userData.onGround = false;
                            try {
                                handanimations[0].stop();
                                handanimations[1].stop();
                            } catch (e) { }
                            handanimations[0] = new TWEEN.Tween(chef.children[3].position).to({ x: 0.75, y: 1, z: -1 }, 100).easing(TWEEN.Easing.Cubic.Out).start();
                            handanimations[1] = new TWEEN.Tween(chef.children[4].position).to({ x: -0.75, y: 1, z: -1 }, 100).easing(TWEEN.Easing.Cubic.Out).start();
                            try {
                                socket.emit("newObject", { id: chefControls.holding.id, type: chefControls.holding.userData.type, kind: chefControls.holding.userData.kind });
                            } catch (e) { }
                            console.log(kitchenObjects);
                        }
                    }
                } else {
                    try {
                        if (selectedObject.parent == kitchen) {
                            if (selectedObject.name == "trash") {
                                chefControls.holding.userData.pickup = false;
                                chefControls.holding.position.copy(kitchen.localToWorld(new THREE.Vector3().copy(selectedObject.position)));
                                chefControls.holding.position.y = 1.5;
                                physicalObjects.add(chefControls.holding);
                                var trashedObject = chefControls.holding;
                                var spinSpeed = randomBetween(-10, 10);
                                new TWEEN.Tween(trashedObject.scale).to({ x: 0, y: 0, z: 0 }, 300).easing(TWEEN.Easing.Cubic.In).start();
                                new TWEEN.Tween(trashedObject.position).to({ y: -1 }, 300).easing(TWEEN.Easing.Cubic.In).onComplete(function () {
                                    try {
                                        socket.emit("trashObject", { id: trashedObject.id });
                                    } catch (e) { }
                                    physicalObjects.remove(trashedObject);
                                    kitchenObjects.splice(kitchenObjects.indexOf(trashedObject), 1);
                                    console.log(kitchenObjects);
                                }).onUpdate(function () {
                                    trashedObject.rotation.y += deg(spinSpeed);
                                }).start();
                                chefControls.holding = "";
                            } else {
                                chefControls.holding.position.copy(kitchen.localToWorld(new THREE.Vector3().copy(selectedObject.position)));
                                selectedObject.userData.objectOnTop = chefControls.holding.userData.type;
                                chefControls.holding.userData.onTopOf = selectedObject.id;
                                chefControls.holding.position.y = 1.5;
                                physicalObjects.add(chefControls.holding);
                                chefControls.holding.userData.onGround = false;
                                chefControls.holding = "";
                            }
                        } else {
                            chef.localToWorld(chefControls.holding.position);
                            physicalObjects.add(chefControls.holding);
                            chefControls.holding.userData.onGround = true;
                            chefControls.holding = "";
                        }
                    } catch (e) {
                        chef.localToWorld(chefControls.holding.position);
                        physicalObjects.add(chefControls.holding);
                        chefControls.holding.userData.onGround = true;
                        chefControls.holding = "";
                    }
                    handanimations[0] = new TWEEN.Tween(chef.children[3].position).to({ x: 1.4, y: 0.75, z: 0 }, 100).easing(TWEEN.Easing.Cubic.Out).start();
                    handanimations[1] = new TWEEN.Tween(chef.children[4].position).to({ x: -1.4, y: 0.75, z: 0 }, 100).easing(TWEEN.Easing.Cubic.Out).start();
                }
                break;
            case chefControls.keyAction:
                chefControls.throw = true;
                if (chefControls.holding != "") {
                    holdanimation = new TWEEN.Tween(chefControls.holding.position).to({ x: 1, y: 2.5, z: 1 }, 100).easing(TWEEN.Easing.Cubic.Out).start();
                    handanimations[0] = new TWEEN.Tween(chef.children[3].position).to({ x: 1, y: 2, z: 1 }, 100).easing(TWEEN.Easing.Cubic.Out).start();
                    handanimations[1] = new TWEEN.Tween(chef.children[4].position).to({ x: -1, y: 0.75, z: -1 }, 100).easing(TWEEN.Easing.Cubic.Out).start();
                }
                break;
            case chefControls.keyDash:
                if (chefControls.dash == false) {
                    chefLinearVelocity.x = -Math.sin(chef.rotation.y) * 0.75;
                    chefLinearVelocity.z = -Math.cos(chef.rotation.y) * 0.75;
                    if (chef.rotation.x != 0) {
                        chefLinearVelocity.z = -chefLinearVelocity.z;
                    }
                    chefControls.dash = true;
                }
                break;
            case "0":
                screenShot = true;
                break;
        }
    };
    var onKeyUp = function (event) {
        switch (event.key) {
            case chefControls.keyUp:
                chefControls.up = false;
                break;
            case chefControls.keyDown:
                chefControls.down = false;
                break;
            case chefControls.keyLeft:
                chefControls.left = false;
                break;
            case chefControls.keyRight:
                chefControls.right = false;
                break;

            case chefControls.keyPickUp:

                break;
            case chefControls.keyAction:
                chefControls.throw = false;
                if (chefControls.holding != "") {
                    try {
                        holdanimation.stop();
                    } catch (e) { }
                    chefControls.holding.position.x = 0;
                    chef.localToWorld(chefControls.holding.position);
                    chef.remove(chefControls.holding);
                    physicalObjects.add(chefControls.holding);
                    handanimations[0] = new TWEEN.Tween(chef.children[3].position).to({ x: 0, y: 2, z: -2 }, 100).easing(TWEEN.Easing.Cubic.Out).chain(new TWEEN.Tween(chef.children[3].position).to({ x: 1.4, y: 0.75, z: 0 }, 100).easing(TWEEN.Easing.Cubic.Out).delay(300)).start();
                    handanimations[1] = new TWEEN.Tween(chef.children[4].position).to({ x: -1, y: 0.75, z: 1 }, 100).easing(TWEEN.Easing.Cubic.Out).chain(new TWEEN.Tween(chef.children[4].position).to({ x: -1.4, y: 0.75, z: 0 }, 100).easing(TWEEN.Easing.Cubic.Out).delay(300)).start();
                    chefControls.holding.userData.linearVelocity.x = -Math.sin(chef.rotation.y) / 2.25;
                    chefControls.holding.userData.linearVelocity.z = -Math.cos(chef.rotation.y) / 2.25;
                    if (chef.rotation.x != 0) {
                        chefControls.holding.userData.linearVelocity.z = -chefControls.holding.userData.linearVelocity.z;
                    }
                    chefControls.holding.userData.linearVelocity.y = 0.05;
                    var randSpin = new THREE.Vector3(randomBetween(deg(-3), deg(3)), randomBetween(deg(-3), deg(3)), randomBetween(deg(-3), deg(3)));
                    chefControls.holding.userData.angularVelocity.x = randSpin.x;
                    chefControls.holding.userData.angularVelocity.y = randSpin.y;
                    chefControls.holding.userData.angularVelocity.z = randSpin.z;
                    chefControls.holding.userData.onGround = true;
                    chefControls.holding = "";
                }
                chefLinearVelocity.x = 0;
                chefLinearVelocity.z = 0;
                break;
            case chefControls.keyDash:
                chefControls.dash = false;
                break;
        }
    };
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    console.log(scene);
    document.body.appendChild(renderer.domElement);
    function animate() {
        var delta = clock.getDelta();
        requestAnimationFrame(animate);

        //chefLinearVelocity.x = chefLinearVelocity.x * Math.pow(chefDamping, delta);
        //chefLinearVelocity.z = chefLinearVelocity.z * Math.pow(chefDamping, delta);
        chefLinearVelocity.x = THREE.MathUtils.damp(chefLinearVelocity.x, 0, chefDamping, delta);
        chefLinearVelocity.z = THREE.MathUtils.damp(chefLinearVelocity.z, 0, chefDamping, delta);

        chef.scale.y = (Math.sin(Date.now() * 0.008) * 0.03) + 1;
        if (chefControls.up == true) {
            if (chefLinearVelocity.z < chefSpeedLimit) {
                chefLinearVelocity.z += chefAcceleration * delta;
            }
            if (chefControls.throw == false) {
                chef.scale.y = (Math.sin(Date.now() * 0.035) * 0.05) + 1;
            }
        }
        if (chefControls.down == true) {
            if (chefLinearVelocity.z > -chefSpeedLimit) {
                chefLinearVelocity.z -= chefAcceleration * delta;
            }
            if (chefControls.throw == false) {
                chef.scale.y = (Math.sin(Date.now() * 0.035) * 0.05) + 1;
            }
        }
        if (chefControls.left == true) {
            if (chefLinearVelocity.x < chefSpeedLimit) {
                chefLinearVelocity.x += chefAcceleration * delta;
            }
            if (chefControls.throw == false) {
                chef.scale.y = (Math.sin(Date.now() * 0.035) * 0.05) + 1;
            }
        }
        if (chefControls.right == true) {
            if (chefLinearVelocity.x > -chefSpeedLimit) {
                chefLinearVelocity.x -= chefAcceleration * delta;
            }
            if (chefControls.throw == false) {
                chef.scale.y = (Math.sin(Date.now() * 0.035) * 0.05) + 1;
            }
        }

        if (chefControls.up != true && chefControls.down != true && chefControls.left != true && chefControls.right != true) {
            chefLinearVelocity.x = THREE.MathUtils.damp(chefLinearVelocity.x, 0, chefDamping, delta);
            chefLinearVelocity.z = THREE.MathUtils.damp(chefLinearVelocity.z, 0, chefDamping, delta);
        }

        chef.position.y += chefLinearVelocity.y;
        if (chefControls.throw == false) {
            chef.position.x += chefLinearVelocity.x;
            chef.position.z += chefLinearVelocity.z;
        }

        if (chefLinearVelocity.x > -0.001 && chefLinearVelocity.x < 0.001) {
            chefLinearVelocity.x = 0;
        }
        if (chefLinearVelocity.z > -0.001 && chefLinearVelocity.z < 0.001) {
            chefLinearVelocity.z = 0;
        }

        if (chefLinearVelocity.x > 0 || chefLinearVelocity.x < 0 || chefLinearVelocity.z > 0 || chefLinearVelocity.z < 0) {
            if (chefControls.up == true || chefControls.down == true || chefControls.left == true || chefControls.right == true) {
                chef.lookAt(chef.position.x - chefLinearVelocity.x, chef.position.y, chef.position.z - chefLinearVelocity.z);
            }
        }

        if (selected[0] != false) {
            scene.getObjectById(selected[0], true).material.color = new THREE.Color(0xffffff);
        }
        selected = [false, 10000];
        for (var i = 0; i < kitchenObjects.length; i++) {
            var distance = CustomMath.Distance(kitchenObjects[i].position, chef.localToWorld(new THREE.Vector3(0, 1.75, -1)));
            if (distance < 3 && chefControls.holding.id != kitchenObjects[i].id) {
                if (distance < selected[1]) {
                    selected = [kitchenObjects[i].id, distance];
                }
            }
        }
        for (var i = 0; i < kitchen.children.length; i++) {
            var distance = CustomMath.Distance(kitchen.localToWorld(new THREE.Vector3().copy(kitchen.children[i].position)), chef.localToWorld(new THREE.Vector3(0, 1.75, -1)));
            if (distance < 3) {
                if (distance < selected[1]) {
                    selected = [kitchen.children[i].id, distance];
                }
            }
        }
        if (selected[0] != false) {
            scene.getObjectById(selected[0], true).material.color = new THREE.Color(0x00ff00);
        }



        for (var i = 0; i < kitchenObjects.length; i++) {
            if (kitchenObjects[i].userData.onGround == true) {
                kitchenObjects[i].position.x += kitchenObjects[i].userData.linearVelocity.x;
                kitchenObjects[i].position.y += kitchenObjects[i].userData.linearVelocity.y;
                kitchenObjects[i].position.z += kitchenObjects[i].userData.linearVelocity.z;
            } else {
                kitchenObjects[i].userData.linearVelocity.x = 0;
                kitchenObjects[i].userData.linearVelocity.y = 0;
                kitchenObjects[i].userData.linearVelocity.z = 0;
                kitchenObjects[i].userData.angularVelocity.x = 0;
                kitchenObjects[i].userData.angularVelocity.y = 0;
                kitchenObjects[i].userData.angularVelocity.z = 0;
            }

            kitchenObjects[i].rotation.x += kitchenObjects[i].userData.angularVelocity.x;
            kitchenObjects[i].rotation.y += kitchenObjects[i].userData.angularVelocity.y;
            kitchenObjects[i].rotation.z += kitchenObjects[i].userData.angularVelocity.z;

            if (kitchenObjects[i].userData.onGround == true) {
                for (var j = 0; j < collisionDirections.length; j++) {
                    objectCollision.set(kitchenObjects[i].position, collisionDirections[j]);
                    var intersects = objectCollision.intersectObjects(physicalObjects.children, true);
                    var intersect = intersects[0];
                    var distance = 0.5;
                    try {
                        switch (j) {
                            case 0:
                                if (intersect.distance < distance) {
                                    if (intersect.object.parent == kitchen || intersect.object.parent.name == "trash") {
                                        kitchenObjects[i].rotation.x = 0;
                                        kitchenObjects[i].rotation.z = 0;
                                        if (intersect.object.parent.name == "trash") {
                                            kitchenObjects[i].userData.pickup = false;
                                            kitchenObjects[i].userData.onGround = false;
                                            kitchenObjects[i].position.copy(kitchen.localToWorld(new THREE.Vector3().copy(intersect.object.parent.position)));
                                            kitchenObjects[i].position.y = 1.5;
                                            physicalObjects.add(kitchenObjects[i]);
                                            var trashedObject = kitchenObjects[i];
                                            var spinSpeed = randomBetween(-10, 10);
                                            new TWEEN.Tween(trashedObject.scale).to({ x: 0, y: 0, z: 0 }, 300).easing(TWEEN.Easing.Cubic.In).start();
                                            new TWEEN.Tween(trashedObject.position).to({ y: -1 }, 300).easing(TWEEN.Easing.Cubic.In).onComplete(function () {
                                                physicalObjects.remove(trashedObject);
                                                console.log(physicalObjects);
                                            }).onUpdate(function () {
                                                trashedObject.rotation.y += deg(spinSpeed);
                                            }).start();
                                        } else {
                                            try {
                                                if (intersect.object.userData.objectOnTop == "container" || intersect.object.userData.objectOnTop == false) {
                                                    kitchenObjects[i].userData.onGround = false;
                                                    kitchenObjects[i].position.copy(kitchen.localToWorld(new THREE.Vector3().copy(intersect.object.position)));
                                                    kitchenObjects[i].position.y = 1.5;
                                                    physicalObjects.add(kitchenObjects[i]);
                                                    intersect.object.userData.objectOnTop = kitchenObjects[i].userData.type;
                                                    kitchenObjects[i].userData.onTopOf = intersect.object.id;
                                                }
                                            } catch (e) { }
                                        }
                                    }

                                    kitchenObjects[i].position.y += (distance - intersect.distance);
                                    kitchenObjects[i].userData.linearVelocity.y = Math.abs(kitchenObjects[i].userData.linearVelocity.y) * 0.5;
                                    kitchenObjects[i].userData.linearVelocity.x = kitchenObjects[i].userData.linearVelocity.x * 0.5;
                                    kitchenObjects[i].userData.linearVelocity.z = kitchenObjects[i].userData.linearVelocity.z * 0.5;

                                    kitchenObjects[i].userData.angularVelocity.x = kitchenObjects[i].userData.angularVelocity.x * 0.5;
                                    kitchenObjects[i].userData.angularVelocity.y = kitchenObjects[i].userData.angularVelocity.y * 0.5;
                                    kitchenObjects[i].userData.angularVelocity.z = kitchenObjects[i].userData.angularVelocity.z * 0.5;
                                }
                            case 2:
                                if (intersect.distance < distance) {
                                    if (intersect.object.name == "chefCollisionBox") {
                                        kitchenObjects[i].position.x -= (distance - intersect.distance) / 2.5;
                                    } else {
                                        kitchenObjects[i].position.x -= (distance - intersect.distance);
                                    }
                                }
                                break;
                            case 3:
                                if (intersect.distance < distance) {
                                    if (intersect.object.name == "chefCollisionBox") {
                                        kitchenObjects[i].position.x += (distance - intersect.distance) / 2.5;
                                    } else {
                                        kitchenObjects[i].position.x += (distance - intersect.distance);
                                    }
                                }
                                break;
                            case 4:
                                if (intersect.distance < distance) {
                                    if (intersect.object.name == "chefCollisionBox") {
                                        kitchenObjects[i].position.z -= (distance - intersect.distance) / 2.5;
                                    } else {
                                        kitchenObjects[i].position.z -= (distance - intersect.distance);
                                    }
                                }
                                break;
                            case 5:
                                if (intersect.distance < distance) {
                                    if (intersect.object.name == "chefCollisionBox") {
                                        kitchenObjects[i].position.z += (distance - intersect.distance) / 2.5;
                                    } else {
                                        kitchenObjects[i].position.z += (distance - intersect.distance);
                                    }
                                }
                                break;
                        }
                    } catch (e) { }
                }
                if (kitchenObjects[i].position.y < 0.5) {
                    kitchenObjects[i].position.y = 0.5;
                    kitchenObjects[i].userData.linearVelocity.y = Math.abs(kitchenObjects[i].userData.linearVelocity.y) * 0.5;
                    kitchenObjects[i].userData.linearVelocity.x = kitchenObjects[i].userData.linearVelocity.x * 0.5;
                    kitchenObjects[i].userData.linearVelocity.z = kitchenObjects[i].userData.linearVelocity.z * 0.5;

                    kitchenObjects[i].userData.angularVelocity.x = kitchenObjects[i].userData.angularVelocity.x * 0.5;
                    kitchenObjects[i].userData.angularVelocity.y = kitchenObjects[i].userData.angularVelocity.y * 0.5;
                    kitchenObjects[i].userData.angularVelocity.z = kitchenObjects[i].userData.angularVelocity.z * 0.5;
                } else {
                    kitchenObjects[i].userData.linearVelocity.y -= 1 * delta;
                }
            }
        }

        for (chf in chefList) {
            try {
                chefList[chf].scale.y = (Math.sin(Date.now() * 0.008) * 0.03) + 1;
            } catch (e) { }
        }

        for (var i = 0; i < collisionDirections.length; i++) {
            chefCollision.set(chef.position, collisionDirections[i]);
            var intersects = chefCollision.intersectObjects(physicalObjects.children, true);
            var intersect = intersects[0];
            try {
                switch (i) {
                    case 2:
                        if (intersect.distance < chefDistances[i]) {
                            if (intersect.object.name == "chefCollisionBox") {
                                chef.position.x -= (chefDistances[i] - intersect.distance) / 2.5;
                            } else {
                                chef.position.x -= (chefDistances[i] - intersect.distance);
                            }
                        }
                        break;
                    case 3:
                        if (intersect.distance < chefDistances[i]) {
                            if (intersect.object.name == "chefCollisionBox") {
                                chef.position.x += (chefDistances[i] - intersect.distance) / 2.5;
                            } else {
                                chef.position.x += (chefDistances[i] - intersect.distance);
                            }
                        }
                        break;
                    case 4:
                        if (intersect.distance < chefDistances[i]) {
                            if (intersect.object.name == "chefCollisionBox") {
                                chef.position.z -= (chefDistances[i] - intersect.distance) / 2.5;
                            } else {
                                chef.position.z -= (chefDistances[i] - intersect.distance);
                            }
                        }
                        break;
                    case 5:
                        if (intersect.distance < chefDistances[i]) {
                            if (intersect.object.name == "chefCollisionBox") {
                                chef.position.z += (chefDistances[i] - intersect.distance) / 2.5;
                            } else {
                                chef.position.z += (chefDistances[i] - intersect.distance);
                            }
                        }
                        break;
                }
            } catch (e) { }
        }
        try {
            if (chef.position.x != pposition.x || chef.position.y != pposition.y || chef.position.z != pposition.z || chefControls.throw == true) {
                socket.emit("position", { position: chef.position, rotation: new THREE.Vector3(chef.rotation.x, chef.rotation.y, chef.rotation.z) });
                pposition.copy(chef.position);
            }
        } catch (e) { }
        TWEEN.update();
        chef.children[8].position.set(0, -chef.position.y, 0);
        renderer.render(scene, camera);

        if (screenShot == true) {
            var SSTime = new Date();
            SSTime = SSTime.toISOString().slice(0, 10) + " at " + SSTime.toLocaleString(undefined, { hour: 'numeric', hour12: true }).slice(0, -3) + "." + SSTime.getMinutes() + "." + SSTime.getSeconds() + " " + SSTime.toLocaleString().slice(-2);
            var element = document.createElement("a");
            element.setAttribute("href", renderer.domElement.toDataURL());
            element.setAttribute("download", "Overcooked! Online Screen Shot " + SSTime + ".png"); //Screen Shot 2021-02-02 at 10.27.29 AM.png
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            screenShot = false;
        }

        try {
            stats.update();
        } catch (e) { }
    };

    animate();
}
init();