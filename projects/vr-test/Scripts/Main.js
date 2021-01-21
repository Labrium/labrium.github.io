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

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType("local");
try {
    document.body.appendChild(VRButton.createButton(renderer)); //
} catch (e) { }



var mode;

var actionsLib = [{
    name: "look",
    onSelect: function () {
        mode = actionsLib[1];
        refreshSelector();
    },
    selector: function () {
        var selector = new THREE.Mesh(new THREE.SphereGeometry(0.000000000000000000000000000001, 0, 0), new THREE.MeshBasicMaterial({
            color: 0xdddddd,
        }));
        selector.renderOrder = 1;
        return selector;
    },
    selectable: new THREE.Group()
}, {
    name: "teleport",
    onSelect: function () {
        cameraholder.position.set(telepoint.x, 5, telepoint.z);
        mode = actionsLib[0];
        refreshSelector();
    },
    selector: function () {
        var selector = new THREE.Mesh(new THREE.CylinderGeometry(500, 1, 10000, 16, 1, false), new THREE.MeshBasicMaterial({
            color: 0x004040,
            //map: new THREE.TextureLoader().load("Images/selector.png"),
            blending: THREE.AdditiveBlending,
            //transparent: true,
            side: THREE.BackSide,
        }));
        selector.renderOrder = 1;
        return selector;
    },
    selectable: new THREE.Group()
}];

mode = actionsLib[0];



// Create a three.js scene.
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xdffdff, 10, 500);
scene.background = new THREE.CubeTextureLoader().load(["Images/skybox/Right.png", "Images/skybox/Left.png", "Images/skybox/Top.png", "Images/skybox/Bottom.png", "Images/skybox/Front.png", "Images/skybox/Back.png"]);
scene.add(actionsLib[1].selectable);


// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000000000);


// Create a reticle
var reticle = new THREE.Mesh(
    new THREE.RingBufferGeometry(0.005, 0.01, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
);
reticle.position.z = -0.5;
camera.add(reticle);

var reticleLoader = new THREE.Mesh(
    new THREE.RingBufferGeometry(),
    new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.BackSide })
);
reticleLoader.position.z = -0.5;
reticleLoader.rotation.y = tau / 2;
camera.add(reticleLoader);
var cameraholder = new THREE.Object3D();
cameraholder.position.y = 5;
cameraholder.add(camera);
scene.add(cameraholder);


// Add a repeating grid box.
var boxWidth = 7.5;
var texture = new THREE.TextureLoader().load("Images/hardwood.png");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(boxWidth, boxWidth);

var box = new THREE.Mesh(
    new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth),
    new THREE.MeshBasicMaterial({
        alphaMap: texture,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0
    })
);
scene.add(box);

var room = new THREE.Mesh(
    new THREE.IcosahedronGeometry(40, 2),
    new THREE.MeshPhongMaterial({
        color: 0xbbbbbb,
        side: THREE.DoubleSide,
        wireframe: true,
        wireframeLinewidth: 10
    })
);
var roomshadow = new THREE.ShadowMesh(room);
//scene.add(roomshadow);
roomshadow.material.wireframe = true;
roomshadow.material.wireframeLinewidth = 12;
roomshadow.material.opacity = 0.2;
scene.add(room);

var roomfloor = new THREE.Mesh(
    new THREE.CircleGeometry(40, 16),
    new THREE.MeshPhongMaterial({
        map: texture,
    })
);
roomfloor.rotation.x = -tau / 4;
roomfloor.position.y = 0.05;
scene.add(roomfloor);
actionsLib[1].selectable.add(roomfloor);

// Create 3D objects.
var cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("Images/WebVR.png"),
        emissiveMap: new THREE.TextureLoader().load("Images/WebVR_emm.png"),
        emissive: 0x00ffff
    })
);

// Position cube mesh
cube.position.z = -5;
cube.position.y = 5.5;
var cubeshadow = new THREE.ShadowMesh(cube);
cubeshadow.renderOrder = 2;
scene.add(cubeshadow);

// Add cube mesh to your three.js scene
scene.add(cube);
actionsLib[1].selectable.add(cube);

var grass = new THREE.TextureLoader().load("Images/grass.jpg");
grass.wrapS = THREE.RepeatWrapping;
grass.wrapT = THREE.RepeatWrapping;
grass.repeat.set(100, 100);

var grassnrm = new THREE.TextureLoader().load("Images/grass_nrm.jpg");
grassnrm.wrapS = THREE.RepeatWrapping;
grassnrm.wrapT = THREE.RepeatWrapping;
grassnrm.repeat.set(100, 100);

var ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10000, 10000),
    new THREE.MeshPhongMaterial({
        map: grass,
        normalMap: grassnrm
    })
);
ground.rotation.x = -tau / 4;
scene.add(ground);
actionsLib[1].selectable.add(ground);

scene.add(new THREE.HemisphereLight(0xffffff, 0x666666, 1.1));

var selecaster = new THREE.Raycaster();
selecaster.setFromCamera(new THREE.Vector2(0, 0), camera);

var selector = mode.selector();
scene.add(selector);

// Request animation frame loop function
var telepoint = new THREE.Vector3(0, 0, 0);
var timeUntilSelect = -25;



var VRUIRadius = 2;
var VRUIHeight = -2;
var VRUIActions = ["menu", "teleport", "dummy", "dummy", "dummy", "dummy", "dummy", "dummy", "dummy", "dummy", "dummy", "dummy"];
var VRUITile = new THREE.Mesh(new THREE.CircleGeometry(0.5, 6, 1), new THREE.MeshBasicMaterial({
    color: 0x00aaaa
}));
//actionsLib[0].selectable.add(VRUITile);
for (var i = 0; i < VRUIActions.length; i++) {
    var tile = VRUITile.clone();
    tile.position.set(Math.sin((i / VRUIActions.length) * tau) * VRUIRadius, VRUIHeight, Math.cos((i / VRUIActions.length) * tau) * VRUIRadius);
    actionsLib[0].selectable.add(tile);
}

scene.add(actionsLib[0].selectable);




window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
} //

function refreshSelector() {
    selector.geometry = mode.selector().geometry;
    selector.material = mode.selector().material;
}

document.body.appendChild(renderer.domElement);

function render() {

    // Apply rotation to cube mesh
    cube.rotation.x += 0.015;
    cube.rotation.y += 0.015;
    cube.rotation.y += 0.015;
    cube.position.y = Math.sin(Date.now() * 0.0025) * 0.15 + 5;
    cube.material.emissiveIntensity = (-(Math.sin(Date.now() * 0.0025) * 0.15) + 0.15) * tau / 2;

    reticleLoader.geometry = new THREE.RingBufferGeometry(0.0125, 0.02, 16, 1, tau / 4, (timeUntilSelect / 70) * tau);

    try {
        // Update VR headset position and apply to camera.
        controls.update();
    } catch (e) { }

    selecaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    if (mode.name == "teleport") {
        try {
            var intersects = selecaster.intersectObjects(mode.selectable.children, true);
            selector.position.set(0, 0, 0);
            selector.position.copy(intersects[0].point);
        } catch (e) {
            selector.visible = false;
            reticle.visible = false;
        }

        selector.visible = true;
        reticle.visible = true;
        if (distance(selector.position, telepoint) <= distance(cameraholder.position, telepoint) / 5) {
            timeUntilSelect += 1;
        } else {
            telepoint.copy(selector.position);
            timeUntilSelect = -25;
        }
        if (timeUntilSelect >= 75) {
            mode.onSelect();
            timeUntilSelect = -25;
        }
        selector.position.y = selector.geometry.parameters.height / 2 + 0.15;
    } else {
        try {
            var intersects = selecaster.intersectObjects(mode.selectable.children, true);
            selector.position.set(0, 0, 0);
            selector.position.copy(intersects[0].point);

            selector.visible = true;
            reticle.visible = true;
            if (distance(selector.position, telepoint) <= distance(cameraholder.position, telepoint) / 5) {
                timeUntilSelect += 1;
            } else {
                telepoint.copy(intersects[0].point);
                timeUntilSelect = -25;
            }
            if (timeUntilSelect >= 75) {
                mode.onSelect();
                timeUntilSelect = -25;
            }
        } catch (e) {
            timeUntilSelect = -25;
            selector.visible = false;
            reticle.visible = false;
        }

    }

    for (var i = 0; i < actionsLib[0].selectable.children.length; i++) {
        var tile = actionsLib[0].selectable.children[i];
        tile.position.set(cameraholder.position.x + (Math.sin((i / VRUIActions.length) * tau) * VRUIRadius), cameraholder.position.y + VRUIHeight, cameraholder.position.z + (Math.cos((i / VRUIActions.length) * tau) * VRUIRadius));
        tile.lookAt(cameraholder.position);
    }




    cubeshadow.update(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.1), new THREE.Vector4(0, 1, 0, 0));
    roomshadow.update(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.1), new THREE.Vector4(0, 1, 0, 0));


    try {
        effect.render(scene, camera);
    } catch (e) {
        renderer.render(scene, camera);
    }
}

renderer.setAnimationLoop(render);