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

var sculptor = new THREE.ObjectLoader();

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
                    chef.children[3].material.matcap = artist.load("Images/Materials/Metallic" + chefColor + ".png");
                } else {
                    document.getElementById("usersConnected").innerHTML += "<span style='color: " + data.list[id].color + ";'>" + data.list[id].name + "</span><br/>";

                    try {
                        scene.remove(chefList[data.list[id].name]);
                        chefList[data.list[id].name].dispose();
                    } catch (e) { }

                    chefList[data.list[id].name] = chef.clone();
                    chefList[data.list[id].name].position.copy(data.list[id].position);
                    chefList[data.list[id].name].rotation.set(data.list[id].rotation.x, data.list[id].rotation.y, data.list[id].rotation.z);
                    scene.add(chefList[data.list[id].name]);

                    chefList[data.list[id].name].children[3].material = new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/Metallic" + data.list[id].color + ".png") });
                    chefList[data.list[id].name].children[2].material = chefList[data.list[id].name].children[3].material;
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
            console.log("user " + data.name + " has disconnected from the server");
        });
        socket.emit("register", { name: username, color: chefColor, position: new THREE.Vector3(), rotation: new THREE.Vector3() });
    });
}

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef6ff);

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000000000);
camera.position.set(0, 20, -10);
camera.lookAt(scene.position);


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
var rendererAntialias = true;

function toggleAntialias() {
    document.body.removeChild(renderer.domElement);
    if (rendererAntialias == true) {
        renderer = new THREE.WebGLRenderer({ antialias: false });
        rendererAntialias = false;
    } else {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        rendererAntialias = true;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
}

var artist = new THREE.TextureLoader();

var physicalObjects = new THREE.Group();

sculptor.load("Models/Chef.json", function (obj) {
    chef = obj;
    chef.children[9].position.set(0, 0.5, 0);
    chef.rotation.order = "YXZ";
    scene.add(chef);
    init();
});

function init() {
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize, false);

    var groundTile = artist.load("Images/floor_tiles/floor_tiles_06_diff_1k.jpg");
    groundTile.wrapS = THREE.RepeatWrapping;
    groundTile.wrapT = THREE.RepeatWrapping;
    groundTile.repeat.set(10, 10);
    var groundTileNrm = artist.load("Images/floor_tiles/floor_tiles_06_nor_1k.jpg");
    groundTileNrm.wrapS = THREE.RepeatWrapping;
    groundTileNrm.wrapT = THREE.RepeatWrapping;
    groundTileNrm.repeat.set(10, 10);
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(75, 75), new THREE.MeshMatcapMaterial({ map: groundTile, normalMap: groundTileNrm, matcap: artist.load("Images/Materials/MetallicWhite.png") }));
    ground.rotation.set(deg(-90), 0, 0);
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
                var block = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/MetallicWhite.png"), flatShading: true }));
                block.position.set(x, 0.25, -z);
                block.add(chef.children[9].clone());
                block.children[0].position.y = -0.25;
                block.children[0].scale.set(0.75, 0.75, 1);
                kitchen.add(block);
            }
        }
    }
    kitchen.position.set(-xlength, 0, zlength);
    kitchen.scale.set(2, 2, 2);
    scene.add(kitchen);


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



    var chefControls = {
        up: false,
        down: false,
        left: false,
        right: false,
        w: false,
        s: false,
        a: false,
        d: false,
        cutEngine: false
    }

    var chefLinearVelocity = new THREE.Vector3();
    var chefSpeedLimit = 3;
    var chefAcceleration = 0.25;
    var chefDamping = 0.97;
    var chefRestitution = 0.9;
    var chefHeading = 0;
    var chefCollision = new THREE.Raycaster();
    var collisionDirections = [new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)];
    var chefDistances = [1, 1, 5, 5, 5, 5];
    var pposition = new THREE.Vector3();



    var onKeyDown = function (event) {
        switch (event.key) {
            case "ArrowUp":
                chefControls.up = true;
                break;
            case "ArrowDown":
                chefControls.down = true;
                break;
            case "ArrowLeft":
                chefControls.left = true;
                break;
            case "ArrowRight":
                chefControls.right = true;
                break;

            case "w":
                chefControls.w = true;
                break;
            case "s":
                chefControls.s = true;
                break;
            case "a":
                chefControls.a = true;
                break;
            case "d":
                chefControls.d = true;
                break;
        }
    };
    var onKeyUp = function (event) {
        switch (event.key) {
            case "ArrowUp":
                chefControls.up = false;
                break;
            case "ArrowDown":
                chefControls.down = false;
                break;
            case "ArrowLeft":
                chefControls.left = false;
                break;
            case "ArrowRight":
                chefControls.right = false;
                break;

            case "w":
                chefControls.w = false;
                break;
            case "s":
                chefControls.s = false;
                break;
            case "a":
                chefControls.a = false;
                break;
            case "d":
                chefControls.d = false;
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



        chef.scale.y = (Math.sin(Date.now() * 0.008) * 0.025) + 1;
        if (chefControls.up == true) {
            chef.rotation.y = deg(180);
            chef.position.z += 10 * delta;
            chef.scale.y = (Math.sin(Date.now() * 0.035) * 0.05) + 1;
        }
        if (chefControls.down == true) {
            chef.rotation.y = deg(0);
            chef.position.z -= 10 * delta;
            chef.scale.y = (Math.sin(Date.now() * 0.035) * 0.05) + 1;
        }
        if (chefControls.left == true) {
            chef.rotation.y = deg(-90);
            chef.position.x += 10 * delta;
            chef.scale.y = (Math.sin(Date.now() * 0.035) * 0.05) + 1;
        }
        if (chefControls.right == true) {
            chef.rotation.y = deg(90);
            chef.position.x -= 10 * delta;
            chef.scale.y = (Math.sin(Date.now() * 0.035) * 0.05) + 1;
        }

        if (chefControls.up == true && chefControls.right == true) {
            chef.rotation.y = deg(135);
        }
        if (chefControls.up == true && chefControls.left == true) {
            chef.rotation.y = deg(-135);
        }
        if (chefControls.down == true && chefControls.right == true) {
            chef.rotation.y = deg(45);
        }
        if (chefControls.down == true && chefControls.left == true) {
            chef.rotation.y = deg(-45);
        }

        for (chf in chefList) {
            try {
                chefList[chf].scale.y = (Math.sin(Date.now() * 0.008) * 0.05) + 1;
            } catch (e) { }
        }

        chefLinearVelocity.x *= chefDamping;
        chefLinearVelocity.z *= chefDamping;

        for (var i = 0; i < collisionDirections.length; i++) {
            chefCollision.set(chef.position, collisionDirections[i]);
            var intersects = chefCollision.intersectObjects(physicalObjects.children, true);
            var intersect = intersects[0];
            try {
                switch (i) {
                }
            } catch (e) { }
        }
        try {
            if (chef.position.x != pposition.x || chef.position.y != pposition.y || chef.position.z != pposition.z) {
                socket.emit("position", { position: chef.position, rotation: new THREE.Vector3(chef.rotation.x, chef.rotation.y, chef.rotation.z) });
                pposition.copy(chef.position);
            }
        } catch (e) { }
        renderer.render(scene, camera);
        stats.update();
    };

    animate();
}