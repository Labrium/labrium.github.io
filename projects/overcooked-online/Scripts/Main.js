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

var socket;

function socketConnect() {
    socket = io("http://Overcooked-Online-socketio-server.techlabsinc.repl.co");

    do {
        var username = prompt("Enter your chef's name:");
    } while (username == null);

    socket.on("connect", function () {
        document.getElementById("usersConnected").innerHTML = "Users Connected:<br/>" + username + "<br/>";
        socket.emit("register", { name: username });
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
                    chefList[data.name].position.set(data.list[id].position.x, data.list[id].position.y, data.list[id].position.z);
                }
            }
        });

        socket.on("getUsers", function (data) {
            document.getElementById("usersConnected").innerHTML = "Users Connected:<br/>";
            for (var id in data.list) {
                if (data.list[id].name == username) {
                    document.getElementById("usersConnected").innerHTML += data.list[id].name + " (Me)<br/>";
                } else {
                    document.getElementById("usersConnected").innerHTML += data.list[id].name + "<br/>";

                    try {
                        var selectedObject = scene.getObjectByName(data.name);
                        scene.remove(selectedObject);
                    } catch (e) { console.log(e); }

                    chefList[data.name] = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/GlossyGreen.png") }));
                    chefList[data.name].position.set(0, 1, 0);
                    chefList[data.name].rotation.order = "YXZ";
                    scene.add(chefList[data.name]);

                    var chefShadow = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: artist.load("Images/roundshadowMask.png"), transparent: true, opacity: 0.4 }));
                    chefShadow.position.set(chefList[data.name].position.x, -chefList[data.name].position.y, chefList[data.name].position.z);
                    chefShadow.rotation.x = deg(-90);
                    scene.add(chefShadow);
                }
            }
        });
        // know when a user has joined the server
        socket.on("user-connect", function (data) {
            console.log("user " + data.name + " has connected to the server");
        });

        // or left the server
        socket.on("user-disconnect", function (data) {
            console.log("user " + data.name + " has disconnected from the server");
        });
    });
}

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef6ff);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000000);
camera.position.set(0, 10, -5);
camera.lookAt(scene.position);


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

var artist = new THREE.TextureLoader();

artist.load("Images/sky.png", function (texture) {
    var rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt;
});

var physicalObjects = new THREE.Group();

function init() {
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize, false);

    var chef = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshMatcapMaterial({ matcap: artist.load("Images/Materials/GlossyGreen.png") }));
    chef.position.set(0, 1, 0);
    chef.rotation.order = "YXZ";
    scene.add(chef);

    var chefShadow = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: artist.load("Images/roundshadowMask.png"), transparent: true, opacity: 0.5 }));
    chefShadow.position.set(chef.position.x, -chef.position.y, chef.position.z);
    chefShadow.rotation.x = deg(-90);
    scene.add(chefShadow);


    var groundTile = artist.load("Images/floor_tiles/floor_tiles_06_diff_1k.jpg");
    groundTile.wrapS = THREE.RepeatWrapping;
    groundTile.wrapT = THREE.RepeatWrapping;
    groundTile.repeat.set(10, 10);
    var groundTileNrm = artist.load("Images/floor_tiles/floor_tiles_06_nor_1k.jpg");
    groundTileNrm.wrapS = THREE.RepeatWrapping;
    groundTileNrm.wrapT = THREE.RepeatWrapping;
    groundTileNrm.repeat.set(10, 10);
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(75, 75), new THREE.MeshMatcapMaterial({ map: groundTile, normalMap: groundTileNrm, matcap: artist.load("Images/Materials/GlossyWhite.png") }));
    ground.rotation.set(deg(-90), 0, 0);
    scene.add(ground);

    ground.material.depthWrite = false;




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
        requestAnimationFrame(animate);


        if (chefControls.up == true) {
            chef.position.z += 0.1;
        }
        if (chefControls.down == true) {
            chef.position.z -= 0.1;
        }
        if (chefControls.left == true) {
            chef.position.x += 0.1;
        }
        if (chefControls.right == true) {
            chef.position.x -= 0.1;
        }

        chefLinearVelocity.x *= chefDamping;
        chefLinearVelocity.z *= chefDamping;

        chef.rotation.x += 0.025;
        chef.rotation.y += 0.025;
        chef.rotation.z += 0.025;

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
            socket.emit("position", { position: chef.position });
        } catch (e) { }
        chefShadow.position.set(chef.position.x, -chef.position.y, chef.position.z);
        renderer.render(scene, camera);
        stats.update();
    };

    animate();
}
init();