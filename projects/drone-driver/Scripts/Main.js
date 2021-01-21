var tau = Math.PI * 2;

function deg(number) {
    return (number * tau) / 360;
}

function feet(number) {
    return number * 0.3048;
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

stats = new Stats(0.1);
stats.showPanel(0);
document.body.appendChild(stats.dom);


var scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef6ff);


var cameraControls = {
    up: false,
    down: false,
    left: false,
    right: false,
    distance: 40
};

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000000);
camera.position.set(cameraControls.distance, cameraControls.distance, -cameraControls.distance);
var currentCamera = camera;



var sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(0, 10, 0);
sun.castShadow = true;
sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;
var d = 400;
sun.shadow.camera.left = - d;
sun.shadow.camera.right = d;
sun.shadow.camera.top = d;
sun.shadow.camera.bottom = - d;
sun.shadow.camera.near = 0;
sun.shadow.camera.far = 10000000;
sun.shadow.radius = 1;

scene.add(sun);
var ambient = new THREE.HemisphereLight(0xeeeeee, 0x999999, 0.8);
ambient.position.set(3, 1, 0)
scene.add(ambient);



var renderer = new THREE.WebGLRenderer({ antialias: true, physicallyCorrectLights: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.physicallyBasedShading = true;

var artist = new THREE.TextureLoader();

artist.load("Images/sky.png", function (texture) {
    var rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt;
});

function init() {
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        playerCam.aspect = window.innerWidth / window.innerHeight;
        playerCam.updateProjectionMatrix();
        droneFlyoverCam.aspect = window.innerWidth / window.innerHeight;
        droneFlyoverCam.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize, false);
    var lastCam;
    function explode() {
        drone.visible = false;
        droneExploded = true;
        group.mesh.position.copy(drone.position);
        shockwaveGroup.mesh.position.copy(drone.position);
        lastCam = currentCamera;
        currentCamera = camera;
        propSmoke1.disable();
        propSmoke2.disable();
        propSmoke3.disable();
        propSmoke4.disable();
        fireball.enable();
        mist.enable();
        debris.enable();
        flash.enable();
        shockwave.enable();
        group.tick();
        shockwaveGroup.tick();
        fireball.disable();
        mist.disable();
        debris.disable();
        flash.disable();
        shockwave.disable();
        setTimeout(resetDrone, 3000);
    }
    function resetDrone() {
        droneHeading = 0;
        drone.position.copy(lastLanded);
        dronePropSpeed = 0;
        droneControls.cutEngine = false;
        drone.visible = true;
        droneExploded = false;
        currentCamera = lastCam;
    }


    var drone = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 7), new THREE.MeshLambertMaterial());
    drone.position.set(0, 1, 0);
    drone.rotation.order = "YXZ";
    scene.add(drone);
    sun.target = drone;

    var droneArm1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 9), new THREE.MeshLambertMaterial());
    droneArm1.rotation.y = deg(45);
    drone.add(droneArm1);

    var droneArm2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 9), new THREE.MeshLambertMaterial());
    droneArm2.rotation.y = deg(-45);
    drone.add(droneArm2);

    var droneProp1 = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 4), new THREE.MeshLambertMaterial());
    droneProp1.position.set(3, 0.5, 3);
    droneProp1.rotateY(deg(22.5));
    droneProp1.add(new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.15, 0.5, 16), new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.5 })));
    drone.add(droneProp1);

    var droneProp2 = droneProp1.clone();
    droneProp2.position.set(-3, 0.5, 3);
    drone.add(droneProp2);

    var droneProp3 = droneProp1.clone();
    droneProp3.position.set(3, 0.5, -3);
    drone.add(droneProp3);

    var droneProp4 = droneProp1.clone();
    droneProp4.position.set(-3, 0.5, -3);
    drone.add(droneProp4);

    var seatHeight = 1;
    var frontRow = 0.75;
    var backRow = -0.75;

    var player = new THREE.Mesh(new THREE.SphereGeometry(feet(2), 16, 16), new THREE.MeshLambertMaterial());
    player.position.set(1.25, seatHeight, frontRow);
    drone.add(player);

    var seats = [false, false, false, false];
    var seatPositions = [new THREE.Vector3(-1.25, seatHeight, frontRow), new THREE.Vector3(1.25, seatHeight, backRow), new THREE.Vector3(0, seatHeight, backRow), new THREE.Vector3(-1.25, seatHeight, backRow)];

    var playerCam = camera.clone();
    playerCam.rotation.y = deg(180);
    player.add(playerCam);

    var droneFlyoverCam = camera.clone();
    droneFlyoverCam.rotation.set(deg(90), deg(180), 0);
    scene.add(droneFlyoverCam);

    physicalObjects = new THREE.Group();

    for (var x = 0; x < randomBetween(100, 30000); x++) {
        var testh = randomBetween(10, 750);
        var test = new THREE.Mesh(new THREE.BoxGeometry(randomBetween(1, 100), testh, randomBetween(1, 100)), new THREE.MeshLambertMaterial());
        test.position.set(randomBetween(-1000, 1000), testh / 2, randomBetween(-1000, 1000));
        physicalObjects.add(test);
    }
    scene.add(physicalObjects);

    var ground = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), new THREE.MeshLambertMaterial({ color: 0xd0d0d0 }));
    ground.rotation.set(deg(-90), 0, 0);
    scene.add(ground);

    ground.material.depthWrite = false;




    var group = new SPE.Group({
        texture: {
            value: THREE.ImageUtils.loadTexture('Images/sprite-explosion2.png'),
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
                value: THREE.ImageUtils.loadTexture('Images/smokeParticle.png'),
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
            value: THREE.ImageUtils.loadTexture('Images/smokeParticleDark.png'),
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



    var droneControls = {
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

    var droneLinearVelocity = new THREE.Vector3();
    var droneSpeedLimit = 3;
    var droneAcceleration = 0.25;
    var droneDamping = 0.97;
    var droneRestitution = 0.9;
    var droneHeading = 0;
    var droneCollision = new THREE.Raycaster();
    var collisionDirections = [new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)];
    var droneDistances = [1, 1, 5, 5, 5, 5];
    var droneGravity = 0.035;
    var onground = false;
    var droneBankAngle = deg(30);
    var dronePropSpeed = 0;
    var droneExploded = false;
    var lastLanded = new THREE.Vector3();
    var crashSpeed = 3.45;



    var onKeyDown = function (event) {
        switch (event.key) {
            case "i":
                cameraControls.up = true;
                break;
            case "j":
                cameraControls.left = true;
                break;
            case "k":
                cameraControls.down = true;
                break;
            case "l":
                cameraControls.right = true;
                break;
            case "=":
                cameraControls.distance -= 1;
                break;
            case "-":
                cameraControls.distance += 1;
                break;
            case "0":
                cameraControls.distance = 40;
                break;

            case "1":
                currentCamera = camera;
                break;
            case "2":
                currentCamera = playerCam;
                break;
            case "3":
                currentCamera = droneFlyoverCam;
                break;

            case "ArrowUp":
                droneControls.up = true;
                break;
            case "ArrowDown":
                droneControls.down = true;
                break;
            case "ArrowLeft":
                droneControls.left = true;
                break;
            case "ArrowRight":
                droneControls.right = true;
                break;

            case "w":
                droneControls.w = true;
                break;
            case "s":
                droneControls.s = true;
                break;
            case "a":
                droneControls.a = true;
                break;
            case "d":
                droneControls.d = true;
                break;

            case " ":
                if (droneControls.cutEngine == true) {
                    droneControls.cutEngine = false;
                } else if (droneControls.cutEngine == false) {
                    droneControls.cutEngine = true;
                }
                break;
        }
    };
    var onKeyUp = function (event) {
        switch (event.key) {
            case "i":
                cameraControls.up = false;
                break;
            case "j":
                cameraControls.left = false;
                break;
            case "k":
                cameraControls.down = false;
                break;
            case "l":
                cameraControls.right = false;
                break;

            case "ArrowUp":
                droneControls.up = false;
                break;
            case "ArrowDown":
                droneControls.down = false;
                break;
            case "ArrowLeft":
                droneControls.left = false;
                break;
            case "ArrowRight":
                droneControls.right = false;
                break;

            case "w":
                droneControls.w = false;
                break;
            case "s":
                droneControls.s = false;
                break;
            case "a":
                droneControls.a = false;
                break;
            case "d":
                droneControls.d = false;
                break;
        }
    };
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    }
    window.addEventListener("mousemove", onMouseMove, false);

    console.log(scene);
    document.body.appendChild(renderer.domElement);
    function animate() {
        requestAnimationFrame(animate);

        for (var i = 0; i < seats.length; i++) {
            if (seats[i] != false) {
                seats[i].position.set(seatPositions[i].x, seatPositions[i].y, seatPositions[i].z);
                drone.add(seats[i]);
            }
        }

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children, true);


        scene.traverse(function (child) {
            if (child instanceof THREE.SkinnedMesh || child instanceof THREE.Mesh) {
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });
        droneProp1.children[0].castShadow = false;
        droneProp2.children[0].castShadow = false;
        droneProp3.children[0].castShadow = false;
        droneProp4.children[0].castShadow = false;


        if (cameraControls.up == true) {
            camera.translateY(cameraControls.distance / 20);
        }
        if (cameraControls.down == true) {
            camera.translateY(-cameraControls.distance / 20);
        }
        if (cameraControls.left == true) {
            camera.translateX(-cameraControls.distance / 20);
        }
        if (cameraControls.right == true) {
            camera.translateX(cameraControls.distance / 20);
        }

        drone.rotation.x = 0;
        drone.rotation.z = 0;

        if (droneControls.cutEngine == false) {
            if (droneControls.w == true) {
                droneLinearVelocity.y += 0.1;
                if (drone.position.y < 2) {
                    if (dronePropSpeed < 1) {
                        dronePropSpeed += 0.1;
                    } else {
                        dronePropSpeed = 1;
                    }
                }
            }
            if (droneControls.s == true) {
                droneLinearVelocity.y -= 0.1;
            }
        } else {
            droneLinearVelocity.y -= droneGravity;
        }

        if (drone.position.y < 2 || droneControls.cutEngine == true || onground == true) {
            lastLanded.copy(drone.position);
            dronePropSpeed *= 0.99;
        }

        if (drone.position.y < 2 || onground == true) {
            if (droneControls.cutEngine == true) {
                drone.rotation.set(0, 0, 0);
            }
        } else {
            if (dronePropSpeed < 1 && droneControls.cutEngine == false && onground == false) {
                dronePropSpeed += 0.1;
            }
            if (droneControls.up == true) {
                drone.rotateX(droneBankAngle);
                if (droneLinearVelocity.z <= droneSpeedLimit && droneLinearVelocity.z >= -droneSpeedLimit) {
                    droneLinearVelocity.z += droneAcceleration * Math.cos(droneHeading);
                }
                if (droneLinearVelocity.x <= droneSpeedLimit && droneLinearVelocity.x >= -droneSpeedLimit) {
                    droneLinearVelocity.x += droneAcceleration * Math.sin(droneHeading);
                }
            }
            if (droneControls.down == true) {
                drone.rotateX(-droneBankAngle);
                if (droneLinearVelocity.z <= droneSpeedLimit && droneLinearVelocity.z >= -droneSpeedLimit) {
                    droneLinearVelocity.z += droneAcceleration * Math.cos(droneHeading + deg(180));
                }
                if (droneLinearVelocity.x <= droneSpeedLimit && droneLinearVelocity.x >= -droneSpeedLimit) {
                    droneLinearVelocity.x += droneAcceleration * Math.sin(droneHeading + deg(180));
                }
            }
            if (droneControls.left == true) {
                drone.rotateZ(-droneBankAngle);
                if (droneLinearVelocity.z <= droneSpeedLimit && droneLinearVelocity.z >= -droneSpeedLimit) {
                    droneLinearVelocity.z += droneAcceleration * Math.cos(droneHeading + deg(90));
                }
                if (droneLinearVelocity.x <= droneSpeedLimit && droneLinearVelocity.x >= -droneSpeedLimit) {
                    droneLinearVelocity.x += droneAcceleration * Math.sin(droneHeading + deg(90));
                }
            }
            if (droneControls.right == true) {
                drone.rotateZ(droneBankAngle);
                if (droneLinearVelocity.z <= droneSpeedLimit && droneLinearVelocity.z >= -droneSpeedLimit) {
                    droneLinearVelocity.z += droneAcceleration * Math.cos(droneHeading - deg(90));
                }
                if (droneLinearVelocity.x <= droneSpeedLimit && droneLinearVelocity.x >= -droneSpeedLimit) {
                    droneLinearVelocity.x += droneAcceleration * Math.sin(droneHeading - deg(90));
                }
            }
            if (droneControls.a == true) {
                droneHeading += 0.05;
            }
            if (droneControls.d == true) {
                droneHeading -= 0.05;
            }
        }


        drone.rotation.y = droneHeading;

        droneLinearVelocity.x *= droneDamping;
        droneLinearVelocity.z *= droneDamping;
        if (droneControls.cutEngine == false) {
            droneLinearVelocity.y *= droneDamping;
        }

        if (droneExploded == false) {
            drone.position.x += droneLinearVelocity.x;
            drone.position.z += droneLinearVelocity.z;
            drone.position.y += droneLinearVelocity.y;
        } else {
            droneLinearVelocity.set(0, 0, 0);
        }

        droneProp1.rotateY(dronePropSpeed);
        droneProp2.rotateY(-dronePropSpeed);
        droneProp3.rotateY(dronePropSpeed);
        droneProp4.rotateY(-dronePropSpeed);
        droneProp1.children[0].material.opacity = dronePropSpeed / 1.5;


        var airspeed = (Math.abs(droneLinearVelocity.x) + Math.abs(droneLinearVelocity.y) + Math.abs(droneLinearVelocity.z));


        for (var i = 0; i < collisionDirections.length; i++) {
            droneCollision.set(drone.position, collisionDirections[i]);
            var intersects = droneCollision.intersectObjects(physicalObjects.children, true);
            var intersect = intersects[0];
            try {
                switch (i) {
                    case 0:
                        if (intersect.distance <= droneDistances[i] - droneLinearVelocity.y) {
                            onground = true;
                        } else {
                            onground = false;
                        }
                        if (intersect.distance < droneDistances[i] - droneLinearVelocity.y && droneLinearVelocity.y < 0) {
                            drone.position.y += (droneDistances[i] - intersect.distance);
                            droneLinearVelocity.y = 0;
                            if (airspeed >= crashSpeed) {
                                explode();
                            }
                        }
                        break;
                    case 1:
                        if (intersect.distance < droneDistances[i] + droneLinearVelocity.y && droneLinearVelocity.y > 0) {
                            drone.position.y -= (droneDistances[i] - intersect.distance);
                            droneLinearVelocity.y = 0;
                            if (airspeed >= crashSpeed) {
                                explode();
                            }
                        }
                        break;
                    case 2:
                        if (intersect.distance < droneDistances[i] + droneLinearVelocity.x && droneLinearVelocity.x > 0) {
                            drone.position.x -= (droneDistances[i] - intersect.distance);
                            droneLinearVelocity.x = 0;
                            if (airspeed >= crashSpeed) {
                                explode();
                            }
                        }
                        break;
                    case 3:
                        if (intersect.distance < droneDistances[i] - droneLinearVelocity.x && droneLinearVelocity.x < 0) {
                            drone.position.x += (droneDistances[i] - intersect.distance);
                            droneLinearVelocity.x = 0;
                            if (airspeed >= crashSpeed) {
                                explode();
                            }
                        }
                        break;
                    case 4:
                        if (intersect.distance < droneDistances[i] + droneLinearVelocity.z && droneLinearVelocity.z > 0) {
                            drone.position.z -= (droneDistances[i] - intersect.distance);
                            droneLinearVelocity.z = 0;
                            if (airspeed >= crashSpeed) {
                                explode();
                            }
                        }
                        break;
                    case 5:
                        if (intersect.distance < droneDistances[i] - droneLinearVelocity.z && droneLinearVelocity.z < 0) {
                            drone.position.z += (droneDistances[i] - intersect.distance);
                            droneLinearVelocity.z = 0;
                            if (airspeed >= crashSpeed) {
                                explode();
                            }
                        }
                        break;
                }
            } catch (e) { }
        }







        var target = new THREE.Vector3(drone.position.x, drone.position.y + 20, drone.position.z);
        camera.lookAt(target);
        camera.translateZ(-(CustomMath.Distance(camera.position, target) - cameraControls.distance) / 5);
        camera.lookAt(drone.position);

        if (camera.position.y <= 1) {
            camera.position.y = 1;
        }
        if (drone.position.y <= 1) {
            drone.position.y = 1;
            droneLinearVelocity.y = 0;
            if (airspeed >= crashSpeed) {
                explode();
            }
        }
        document.getElementById("airspeed").innerHTML = "Engine: " + (droneControls.cutEngine ? "OFF" : "ON") + "<br/>Airspeed: " + Math.round(airspeed) + "m/s<br/>Altitude: " + Math.round(drone.position.y - 1) + "m";

        ground.position.set(drone.position.x, -0.09, drone.position.z);
        sun.position.set(drone.position.x, drone.position.y + 10, drone.position.z);
        droneFlyoverCam.position.set(drone.position.x, drone.position.y - 0, drone.position.z);
        droneFlyoverCam.rotation.z = (drone.rotation.y);


        propSmoke1.position.value = droneProp1.localToWorld(new THREE.Vector3());
        propSmoke2.position.value = droneProp2.localToWorld(new THREE.Vector3());
        propSmoke3.position.value = droneProp3.localToWorld(new THREE.Vector3());
        propSmoke4.position.value = droneProp4.localToWorld(new THREE.Vector3());
        group.tick();
        shockwaveGroup.tick();
        propSmoke.tick();


        renderer.render(scene, currentCamera);
        stats.update();
    };

    animate();
}
init();