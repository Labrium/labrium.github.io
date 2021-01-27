var tau = Math.PI * 2;

function deg(number) {
    return (number * tau) / 360;
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

stats = new Stats(0.1);
stats.showPanel(0);
document.body.appendChild(stats.dom);

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
    throw: false
}

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
    var frontLeftPuff = new THREE.Mesh(new THREE.SphereBufferGeometry(0.3, radialSegments, radialSegments), whiteFabric);
    frontLeftPuff.scale.set(1.5, 1.25, 1.5);
    var frontCenterPuff = frontLeftPuff.clone();
    var frontRightPuff = frontLeftPuff.clone();
    var backLeftPuff = frontLeftPuff.clone();
    var backCenterPuff = frontLeftPuff.clone();
    var backRightPuff = frontLeftPuff.clone();
    var head = new THREE.Mesh(new THREE.SphereBufferGeometry(0.7, radialSegments, radialSegments), skin);
    var bandana = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.6, 0.6, 0.2, radialSegments, 1, true), coloredFabric);
    var coat = new THREE.Mesh(new THREE.SphereBufferGeometry(1.1, radialSegments, radialSegments, 0, deg(360), 0, deg(80)), coloredFabric);
    var rightHand = new THREE.Mesh(new THREE.SphereBufferGeometry(0.35, radialSegments, radialSegments), skin);
    var leftHand = rightHand.clone();
    var apron = new THREE.Mesh(new THREE.SphereBufferGeometry(1.15, radialSegments, radialSegments, deg(230), deg(80), 0, deg(82.5)), whiteFabric);
    var apronRibbon = new THREE.Mesh(new THREE.SphereBufferGeometry(1.14, radialSegments, 1, 0, deg(360), deg(60), deg(5)), whiteFabric);
    var body = new THREE.Mesh(new THREE.SphereBufferGeometry(1, radialSegments, radialSegments, 0, deg(360), deg(90), deg(90)), whiteFabric);
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
        chefCollisionBoxes[name] = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ opacity: 0.2, transparent: true, depthWrite: false }));
        physicalObjects.add(chefCollisionBoxes[name]);
    }

    return model
}

var clock = new THREE.Clock();

var kitchens = [
    [[1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'order'],
    ['trash', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'order'],
    [1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 'plates'],
    ['fish', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'shrimp'],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 'cut', 'cut', 0, 0, 0, 0, 0, 0, 0, 'cut', 'cut', 1]]
];

var socket;
var chef;


function socketConnect() {
    var colors = ["Red", "Yellow", "Green", "Blue", "Black", "White"];
    var chefColor = colors[Math.floor(Math.random() * colors.length)];
    do {
        var username = prompt("Enter your chef's name:");
    } while (username == null);

    socket = io("Overcooked-Online-socketio-server.techlabsinc.repl.co");

    socket.on("connect", function () {
        document.getElementById("usersConnected").innerHTML = "Users Connected:<br/>" + username + "<br/>";
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
                        chefCollisionBoxes[data.list[id].name].position.set(data.list[id].position.x, data.list[id].position.y, data.list[id].position.z);
                    } catch (e) { }
                }
            }
        });

        socket.on("getUsers", function (data) {
            document.getElementById("usersConnected").innerHTML = "Users Connected:<br/>";
            for (var id in data.list) {
                if (data.list[id].name != username) {
                    if (data.list[id].color == chefColor) {
                        chefColor = colors[Math.floor(Math.random() * colors.length)];
                        socket.emit("register", { name: username, color: chefColor, position: chef.position });
                    }
                }
                if (data.list[id].name == username) {
                    document.getElementById("usersConnected").innerHTML += "<span style='color: " + data.list[id].color + ";'>" + data.list[id].name + " (Me)</span><br/>";
                    chef.children[2].material.matcap = artist.load("Images/Materials/Metallic" + chefColor + ".png");
                } else {
                    document.getElementById("usersConnected").innerHTML += "<span style='color: " + data.list[id].color + ";'>" + data.list[id].name + "</span><br/>";

                    try {
                        scene.remove(chefList[data.list[id].name]);
                        chefList[data.list[id].name].dispose();
                        scene.remove(chefCollisionBoxes[data.name]);
                        chefCollisionBoxes[data.name].dispose();
                    } catch (e) { }

                    chefList[data.list[id].name] = createChef(data.list[id].name, data.list[id].color);
                    chefList[data.list[id].name].position.copy(data.list[id].position);
                    chefList[data.list[id].name].rotation.set(data.list[id].rotation.x, data.list[id].rotation.y, data.list[id].rotation.z);
                    scene.add(chefList[data.list[id].name]);
                    console.log(chefList[data.list[id].name]);
                }
            }
        });
        // know when a user has joined the server
        socket.on("user-connect", function (data) {
            console.log("user " + data.name + " has connected to the server");
        });

        // or left the server
        socket.on("user-disconnect", function (data) {
            scene.remove(chefList[data.name]);
            chefList[data.name].dispose();
            scene.remove(chefCollisionBoxes[data.name]);
            chefCollisionBoxes[data.name].dispose();
            chefCollisionBoxes[data.name].pop();
            console.log("user " + data.name + " has disconnected from the server");
        });
        socket.emit("register", { name: username, color: chefColor, position: new THREE.Vector3(), rotation: new THREE.Vector3() });
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
    } else if (loq == 2) {
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
    for (var z = 0; z < kitchens[level - 1].length; z++) {
        if (z > zlength) {
            zlength = z;
        }
        for (var x = 0; x < kitchens[level - 1][z].length; x++) {
            if (x > xlength) {
                xlength = x;
            }
            if (kitchens[level - 1][z][x] != 0) {
                var block = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.2, 1), new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/GlossyWhite.png"), normalMap: artist.load("Images/counter.png") }));
                block.position.set(x, 0.4, -z);
                block.add(chef.children[8].clone());
                block.children[0].position.y = -0.4;
                block.children[0].scale.set(0.75, 0.75, 1);
                block.add(new THREE.Mesh(new THREE.BoxBufferGeometry(1.3, 0.5, 1.3), new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })));
                block.children[1].position.y = -0.3;
                block.add(new THREE.Mesh(new THREE.BoxBufferGeometry(0.975, 0.3, 0.975), new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/GlossyWhite.png") })));
                block.children[2].position.y = -0.25;
                kitchen.add(block);
            }
        }
    }
    kitchen.position.set(-xlength, 0, zlength);
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


    var chefLinearVelocity = new THREE.Vector3();
    var chefSpeedLimit = 2;
    var chefAcceleration = 1.25;
    var chefDamping = 54;
    var chefRestitution = 0.9;
    var chefHeading = 0;
    var chefCollision = new THREE.Raycaster();
    var collisionDirections = [new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)];
    var chefDistances = [1, 1, 1, 1, 1, 1];
    var pposition = new THREE.Vector3();



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

                break;
            case chefControls.keyAction:
                chefControls.throw = true;
                break;
            case chefControls.keyDash:

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
                chefLinearVelocity.x = 0;
                chefLinearVelocity.z = 0;
                break;
            case chefControls.keyDash:

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

        chefLinearVelocity.x = (chefLinearVelocity.x * chefDamping) * delta;
        chefLinearVelocity.z = (chefLinearVelocity.z * chefDamping) * delta;

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
                        if (intersect.distance <= chefDistances[i]) {
                            chef.position.x -= (chefDistances[i] - intersect.distance);
                        }
                        break;
                    case 3:
                        if (intersect.distance <= chefDistances[i]) {
                            chef.position.x += (chefDistances[i] - intersect.distance);
                        }
                        break;
                    case 4:
                        if (intersect.distance <= chefDistances[i]) {
                            chef.position.z -= (chefDistances[i] - intersect.distance);
                        }
                        break;
                    case 5:
                        if (intersect.distance <= chefDistances[i]) {
                            chef.position.z += (chefDistances[i] - intersect.distance);
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
        chef.children[8].position.set(0, -chef.position.y, 0);
        renderer.render(scene, camera);
        stats.update();
    };

    animate();
}
init();