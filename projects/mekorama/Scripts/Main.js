var tau = Math.PI * 2;

function deg(number) {
    return (number * tau) / 360;
}


var watertop, waterfront, waterback, waterleft, waterright;
var water = new THREE.Group();
function flood(length, width, height) {
    /*var waterOptions = {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: artist.load("Images/water nrm.png", function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        alpha: 0.64,
        sunDirection: sun.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x66E1F4,
        distortionScale: 2,
        fog: scene.fog !== undefined,
        side: THREE.DoubleSide
    };*/
    var waterOptions = {
        color: 0x88e8f7, //original: 0x66E1F4
        normalMap0: artist.load("Images/water nrm.png", function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        normalMap1: artist.load("Images/water nrm.png", function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        scale: 0.05,
        flowDirection: new THREE.Vector2(0.1, 0.1),
        textureWidth: 1024,
        textureHeight: 1024,
        //clipBias: 1
    };
    var ws = 1;
    watertop = new THREE.Water(new THREE.PlaneGeometry((width - 0.25) / ws, (length - 0.25) / ws), waterOptions);
    waterfront = new THREE.Water(new THREE.PlaneGeometry((width - 0.25) / ws, (height - 0.25) / ws), waterOptions);
    waterback = new THREE.Water(new THREE.PlaneGeometry((length - 0.25) / ws, (height - 0.25) / ws), waterOptions);
    waterright = new THREE.Water(new THREE.PlaneGeometry((length - 0.25) / ws, (height - 0.25) / ws), waterOptions);
    waterleft = new THREE.Water(new THREE.PlaneGeometry((length - 0.25) / ws, (height - 0.25) / ws), waterOptions);

    watertop.rotation.set(deg(-90), 0, 0);
    waterfront.rotation.set(0, deg(180), 0);
    waterright.rotation.set(0, deg(90), 0);
    waterleft.rotation.set(0, deg(-90), 0);

    watertop.position.set(0, height - 0.75, 0);
    waterfront.position.set(0, (height / 2) - 0.625, -(length / 2) + 0.125);
    waterback.position.set(0, (height / 2) - 0.625, (length / 2) - 0.125);
    waterright.position.set((width / 2) - 0.125, (height / 2) - 0.625, 0);
    waterleft.position.set(-(width / 2) + 0.125, (height / 2) - 0.625, 0);

    watertop.scale.set(ws, ws, ws);
    waterfront.scale.set(ws, ws, ws);
    waterback.scale.set(ws, ws, ws);
    waterright.scale.set(ws, ws, ws);
    waterleft.scale.set(ws, ws, ws);

    water.add(watertop).add(waterfront).add(waterright).add(waterleft).add(waterback);
    scene.add(water);
}


/* 0: air
 * 1: dirt
 * 2: grass
 * 3: stone
 * 4: metal
 * 5: brick
 * 6: drag block
 * 7: Y rail
 * 8: Z rail
 * 9: X rail
 * 10: stone column
*/
var levelMap = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ], [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1],
        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 16, 0],
        [1, 1, 1, 1, 3, 1, 1, 16, 0, 0, 0]
    ], [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 16, 0],
        [1, 1, 3, 1, 1, 1, 1, 16, 0, 0, 0],
        [1, 1, 1, 1, 13, 7, 7, 7, 7, 0, 0],
        [1, 1, 1, 1, 0, 7, 7, 7, 7, 0, 0],
        [1, 1, 1, 16, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 11, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0],
        [13, 1, 1, 1, 1, 7, 7, 0, 8, 0, 0],
        [0, 0, 0, 0, 0, 7, 7, 0, 8, 0, 0],
        [0, 0, 0, 0, 0, 7, 7, 7, 10, 0, 0],
        [0, 0, 0, 19, 0, 7, 7, 7, 7, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [1, 1, 1, 1, 1, 20, 2, 2, 2, 2, 2],
        [1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2],
        [2, 2, 2, 2, 3, 3, 3, 3, 6, 0, 0],
        [2, 2, 2, 2, 3, 3, 3, 3, 6, 0, 0],
        [13, 2, 2, 2, 3, 4, 4, 3, 6, 0, 0],
        [0, 2, 2, 2, 2, 4, 4, 0, 6, 0, 0],
        [0, 0, 0, 0, 0, 4, 4, 0, 6, 0, 0],
        [0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0],
        [0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 3, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
        [0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
        [0, 17, 17, 0, 3, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
        [0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
        [0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 14, 3, 3, 15, 0, 0, 0],
        [0, 0, 0, 0, 14, 3, 3, 15, 0, 0, 0],
        [0, 0, 0, 0, 14, 3, 3, 15, 0, 0, 0],
        [0, 0, 0, 0, 14, 3, 3, 15, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 14, 15, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 12, 15, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 14, 15, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 14, 15, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
];



var scene = new THREE.Scene();


var clock = new THREE.Clock();

var camdistance = 20;
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(camdistance, camdistance, -camdistance);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);



var sun = new THREE.DirectionalLight(0xffffff, 1.55);
sun.position.set(0, 10, 0);
sun.castShadow = true;
sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;
var d = 250;
sun.shadow.camera.left = - d;
sun.shadow.camera.right = d;
sun.shadow.camera.top = d;
sun.shadow.camera.bottom = - d;
sun.shadow.camera.near = 0;
sun.shadow.camera.far = 105;
sun.shadow.radius = 1;

scene.add(sun);
var reverseSun = new THREE.DirectionalLight(0xffffff, -1);
reverseSun.position.set(0, -10, 0);
scene.add(reverseSun);
scene.add(new THREE.HemisphereLight(0x000000, 0xffffff, 1.25));



var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;
renderer.setClearColor(0xffffff);

var artist = new THREE.TextureLoader();


var modelScale = 1 / 3;
var sculptingSupervisor = new THREE.LoadingManager(init);
var sculptor = new THREE.ColladaLoader(sculptingSupervisor);
//sculptor.options.convertUpAxis = true;
sculptor.load('Models/bot.dae', function (collada) {
    bot = collada.scene;
});
sculptor.load('Models/zapper.dae', function (collada) {
    zapper = collada.scene;
});

function init() {
    scene.add(bot);
    bot.scale.set(modelScale, modelScale, modelScale);



    // Materials
    var dirt = new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/dirt.png") });
    var grassSide = new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/grass side.png") });
    var grass = [grassSide, grassSide, new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/grass top.png") }), dirt, grassSide, grassSide];

    var stone = new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/stone.png") });
    var metal = new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/metal.png") });
    var brick = new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/brick.png") });
    var drag = new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/drag.png"), emissiveMap: artist.load("Images/tileset/drag emm.png"), emissive: 0xffffff });

    var goalSide = new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/goal side.png"), emissiveMap: artist.load("Images/tileset/goal emm.png"), emissive: 0xffffff });
    var goal = [goalSide, goalSide, new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/goal top.png"), emissiveMap: artist.load("Images/tileset/goal top emm.png"), emissive: 0xff0000 }), metal, goalSide, goalSide];

    var column = [new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/stone side.png") }), new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/stone.png") }), new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/stone.png") })];
    var slider = [new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/slider side.png") }), new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/slider cap.png") }), new THREE.MeshLambertMaterial({ map: artist.load("Images/tileset/slider cap.png") })];



    //Geometries
    var extrude = {
        steps: 1,
        depth: 1,
        bevelEnabled: false,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0
    };

    var stairShape = new THREE.Shape();
    stairShape.moveTo(0, 0);
    stairShape.lineTo(0, 0.5);
    stairShape.lineTo(0.5, 0.5);
    stairShape.lineTo(0.5, -0.5);
    stairShape.lineTo(-0.5, -0.5);
    stairShape.lineTo(-0.5, 0);

    var slopeShape = new THREE.Shape();
    slopeShape.moveTo(-0.5, -0.5);
    slopeShape.lineTo(0.5, -0.5);
    slopeShape.lineTo(-0.5, 0.5);


    var block = new THREE.BoxGeometry(1, 1, 1);
    var can = new THREE.CylinderGeometry(0.5, 0.5, 1);
    var rod = new THREE.CylinderGeometry(0.15, 0.15, 1);
    var rodCorner = new THREE.TorusGeometry(0.5, 0.15, undefined, undefined, deg(90));
    var stairs = new THREE.ExtrudeGeometry(stairShape, extrude);
    var slope = new THREE.ExtrudeGeometry(slopeShape, extrude);


    var directions = [0, 90, 180, 270];
    var colors = [0xFFFFFF, 0xF8F8F8, 0xF5F5F5, 0xF0F0F0, 0xE8E8E8, 0xE0E0E0, 0xDCDCDC, 0xD8D8D8, 0xD3D3D3, 0xD0D0D0];
    var levelDimensions = new THREE.Vector3(0, 0, 0);
    var level = new THREE.Group();

    var zaps = [];
    var zapPositions = [new THREE.Vector3(0.75, 0, 0.75), new THREE.Vector3(-0.75, 0, 0.75), new THREE.Vector3(0.75, 0, -0.75), new THREE.Vector3(-0.75, 0, -0.75)];

    for (var y = 0; y < levelMap.length; y++) {
        if (y > levelDimensions.y) {
            levelDimensions.y = y;
        }
        for (var x = 0; x > 0 - levelMap[y].length; x--) {
            if (x < levelDimensions.x) {
                levelDimensions.x = Math.abs(x);
            }
            for (var z = 0; z < levelMap[y][-x].length; z++) {
                if (z > levelDimensions.z) {
                    levelDimensions.z = z;
                }
                switch (levelMap[y][-x][z]) {
                    case 1:
                        dirt.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(block, dirt.clone());
                        newCube.position.set(x, y, z);
                        level.add(newCube);
                        break;
                    case 2:
                        var newCube = new THREE.Mesh(block, grass);
                        newCube.position.set(x, y, z);
                        level.add(newCube);
                        break;
                    case 3:
                        stone.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(block, stone.clone());
                        newCube.position.set(x, y, z);
                        level.add(newCube);
                        break;
                    case 4:
                        metal.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(block, metal.clone());
                        newCube.position.set(x, y, z);
                        newCube.rotation.y = deg(directions[Math.floor((Math.random() * 4))]);
                        level.add(newCube);
                        break;
                    case 5:
                        var newCube = new THREE.Mesh(block, brick);
                        newCube.position.set(x, y, z);
                        level.add(newCube);
                        break;
                    case 6:
                        drag.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(block, drag.clone());
                        newCube.position.set(x, y, z);
                        level.add(newCube);
                        break;
                    case 7:
                        metal.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(rod, metal.clone());
                        newCube.position.set(x, y, z);
                        level.add(newCube);
                        break;
                    case 8:
                        metal.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(rod, metal.clone());
                        newCube.position.set(x, y, z);
                        newCube.rotation.set(0, 0, deg(90));
                        level.add(newCube);
                        break;
                    case 9:
                        metal.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(rod, metal.clone());
                        newCube.position.set(x, y, z);
                        newCube.rotation.set(deg(90), 0, 0);
                        level.add(newCube);
                        break;
                    case 10:
                        metal.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(rodCorner, metal.clone());
                        newCube.position.set(x + 0.5, y - 0.5, z);
                        newCube.rotation.set(0, 0, deg(90));
                        level.add(newCube);
                        break;
                    case 11:
                        var newCube = new THREE.Mesh(can, slider);
                        newCube.position.set(x, y, z);
                        newCube.rotation.set(0, 0, deg(90));
                        level.add(newCube);
                        break;
                    case 12:
                        var newCube = new THREE.Mesh(can, column);
                        newCube.position.set(x, y, z);
                        level.add(newCube);
                        break;
                    case 13:
                        stone.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        stone.map.wrapS = THREE.RepeatWrapping;
                        stone.map.wrapT = THREE.RepeatWrapping;
                        var newCube = new THREE.Mesh(stairs, stone.clone());
                        newCube.name = 'stairs';
                        newCube.position.set(x, y, z - 0.5);
                        level.add(newCube);
                        break;
                    case 14:
                        stone.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(slope, stone.clone());
                        newCube.position.set(x - 0.5, y, z);
                        newCube.rotation.set(0, deg(90), 0);
                        level.add(newCube);
                        break;
                    case 15:
                        stone.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(slope, stone.clone());
                        newCube.position.set(x + 0.5, y, z);
                        newCube.rotation.set(0, deg(-90), 0);
                        level.add(newCube);
                        break;
                    case 16:
                        stone.color = new THREE.Color(colors[Math.floor((Math.random() * 10))]);
                        var newCube = new THREE.Mesh(slope, stone.clone());
                        newCube.position.set(x, y - 0.5, z);
                        newCube.rotation.set(deg(90), deg(180), 0);
                        level.add(newCube);
                        break;
                    case 17:
                        var newCube = zapper.clone();
                        newCube.position.set(x, y, z);
                        var newZap = new THREE.SimpleElectricity({
                            color: 0x00ddff,
                            positions: zapPositions,
                            segments: 4,
                            roughness: 0.4,
                            delay: 20
                        });
                        newCube.add(newZap);
                        newCube.scale.set(modelScale, modelScale, modelScale);
                        zaps.push(newZap);
                        level.add(newCube);
                        break;

                    case 19:
                        bot.position.set(x, y, z);
                        break;
                    case 20:
                        var newCube = new THREE.Mesh(block, goal);
                        newCube.position.set(x, y, z);
                        newCube.add(new THREE.PointLight(goal[2].emissive, 2, 2));
                        level.add(newCube);
                        break;
                }
            }
        }
    }
    level.rotation.set(0, deg(-90), 0);
    water.position.set(-levelDimensions.x / 2, 0, -levelDimensions.z / 2);
    scene.add(level);
    bot.translateX(levelDimensions.x / 2);
    bot.translateZ(-levelDimensions.z);
    //bot.position.set(3, 2.5, -2);


    flood(levelDimensions.x + 1, levelDimensions.z + 1, 5);



    var ground = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.ShadowMaterial());
    ground.rotation.set(deg(-90), 0, 0);
    ground.position.set(0, -0.51, 0);
    level.add(ground);



    var orbitUp = false;
    var orbitDown = false;
    var orbitLeft = false;
    var orbitRight = false;


    var botLinearVelocity = new THREE.Vector3();
    var botAngularVelocity = new THREE.Vector3();
    var botSpeedLimit = 0.15;
    var botAcceleration = 0.03;
    var botDamping = 0.9;
    var botRestitution = 0.9;
    var botCollision = new THREE.Raycaster();
    var collisionDirections = [new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)];
    var botDistances = [1.25, 0.75, 0.5, 0.5, 0.5, 0.5];
    var botGravity = 0.03;
    var onground = true;



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
            case "+":
                camdistance -= 1;
                break;
            case "-":
                camdistance += 1;
                break;
            case "=":
                camdistance = 20;
                botLinearVelocity.x -= 0.25;
                break;
            case '*':
                botLinearVelocity.z -= 0.25;
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
    window.addEventListener('mousemove', onMouseMove, false);


    var selector = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: artist.load('Images/o.png') }));
    selector.rotation.x = deg(-90);
    selector.renderOrder = 0;
    //selector.material.alphaTest = 0.49;
    selector.material.transparent = true;
    scene.add(selector);

    var selected = false;
    var currentWaypoint = 0;

    console.log(scene);
    document.body.appendChild(renderer.domElement);
    var animate = function () {
        requestAnimationFrame(animate);

        var delta = clock.getDelta();

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(level.children, true);
        try {
            var intersect = intersects[0];
            if (selected == false) {
                selector.position.set(Math.floor(intersect.point.x + 0.5), Math.floor(intersect.point.y) + 0.51, Math.floor(intersect.point.z + 0.5));
                var selscale = Math.sin(Date.now() / 200) / 10 + 1;
                selector.scale.set(selscale, selscale, selscale);
                selector.material.opacity = 1;
            } else {
                if (selector.scale.x < 2) {
                    selector.scale.x += 0.15;
                    selector.scale.y += 0.15;
                    selector.scale.z += 0.15;
                    selector.material.opacity -= 0.15;
                }
            }
            window.addEventListener('mousedown', function () {
                selected = false;
                selector.position.set(Math.floor(intersect.point.x + 0.5), Math.floor(intersect.point.y) + 0.51, Math.floor(intersect.point.z + 0.5));
                selector.scale.set(1, 1, 1);
                selector.material.opacity = 1;
                selected = true;
            }, false);
        } catch (error) { }
        if (CustomMath.Distance(bot.position, selector.position) < 0.75) {
            selected = false;
        }




        for (var i = 0; i < collisionDirections.length; i++) {
            botCollision.set(bot.position, collisionDirections[i]);
            var botIntersects = botCollision.intersectObjects(level.children, true);
            var botIntersect = botIntersects[0];
            try {
                switch (i) {
                    case 0:
                        if (botDistances[i] > botIntersect.distance) {
                            onground = true;
                            bot.position.y += (botDistances[i] - botIntersect.distance) - 0.5;
                            botLinearVelocity.y = 0;
                        } else {
                            onground = false;
                            botLinearVelocity.y -= botGravity;
                        }
                        if (botDistances[i] >= botIntersect.distance && botLinearVelocity.y <= 0) {
                            //botLinearVelocity.y = 0;
                        } else if (botDistances[i] <= botIntersect.distance && botLinearVelocity.y === 0) {
                            botLinearVelocity.y += 2;
                        }




                        if (onground) {
                            if (selected) {
                                if (selector.position.x < bot.position.x - 0.1) {
                                    if (!(botLinearVelocity.x > botSpeedLimit)) {
                                        botLinearVelocity.x += botAcceleration;
                                    }
                                } else if (selector.position.x > bot.position.x + 0.1) {
                                    if (!(botLinearVelocity.x < -botSpeedLimit)) {
                                        botLinearVelocity.x -= botAcceleration;
                                    }
                                }


                                if (selector.position.z < bot.position.z - 0.1) {
                                    if (!(botLinearVelocity.z > botSpeedLimit)) {
                                        botLinearVelocity.z += botAcceleration;
                                    }
                                } else if (selector.position.z > bot.position.z + 0.1) {
                                    if (!(botLinearVelocity.z < -botSpeedLimit)) {
                                        botLinearVelocity.z -= botAcceleration;
                                    }
                                }

                                if (botLinearVelocity.x == 0 && botLinearVelocity.z == 0) {
                                    currentWaypoint++;
                                }

                                bot.lookAt(bot.position.x + botLinearVelocity.x, bot.position.y + 0.75, bot.position.z + botLinearVelocity.z);
                                bot.rotation.z = 0;
                                bot.rotateX(deg(90));
                                bot.rotateY(deg(180));
                            } else {
                                if (Math.round(botIntersect.point.x) < bot.position.x - 0.1) {
                                    if (!(botLinearVelocity.x > botSpeedLimit)) {
                                        botLinearVelocity.x += botAcceleration;
                                    }
                                } else if (Math.round(botIntersect.point.x) > bot.position.x + 0.1) {
                                    if (!(botLinearVelocity.x < -botSpeedLimit)) {
                                        botLinearVelocity.x -= botAcceleration;
                                    }
                                }


                                if (Math.round(botIntersect.point.z) < bot.position.z - 0.1) {
                                    if (!(botLinearVelocity.z > botSpeedLimit)) {
                                        botLinearVelocity.z += botAcceleration;
                                    }
                                } else if (Math.round(botIntersect.point.z) > bot.position.z + 0.1) {
                                    if (!(botLinearVelocity.z < -botSpeedLimit)) {
                                        botLinearVelocity.z -= botAcceleration;
                                    }
                                }

                                bot.lookAt(new THREE.Vector3(Math.round(botIntersect.point.x), botIntersect.point.y, Math.round(botIntersect.point.z)));
                                bot.rotation.z = 0;
                                bot.rotateX(deg(-90));
                                bot.rotateY(deg(180));

                            }

                            botLinearVelocity.x = botLinearVelocity.x * botDamping;
                            botLinearVelocity.z = botLinearVelocity.z * botDamping;
                            if (Math.abs(botLinearVelocity.x) < 0.02) {
                                botLinearVelocity.x = 0;
                            }
                            if (Math.abs(botLinearVelocity.z) < 0.02) {
                                botLinearVelocity.z = 0;
                            }
                        } else {
                            if (botIntersect.distance >= 1.5) {
                                selected = false;
                            }
                        }




                        break;
                    case 1:
                        if (botDistances[i] > botIntersect.distance) {
                            bot.position.y -= (botDistances[i] - botIntersect.distance);
                            botLinearVelocity.y = -botLinearVelocity.y * botRestitution;;
                        }
                        break;
                    case 2:
                        if (botDistances[i] > botIntersect.distance) {
                            bot.position.x -= (botDistances[i] - botIntersect.distance);
                            botLinearVelocity.x = -botLinearVelocity.x * botRestitution;;
                        }
                        break;
                    case 3:
                        if (botDistances[i] > botIntersect.distance) {
                            bot.position.x += (botDistances[i] - botIntersect.distance);
                            botLinearVelocity.x = -botLinearVelocity.x * botRestitution;;
                        }
                        break;
                    case 4:
                        if (botDistances[i] > botIntersect.distance) {
                            bot.position.z -= (botDistances[i] - botIntersect.distance);
                            botLinearVelocity.z = -botLinearVelocity.z * botRestitution;;
                        }
                        break;
                    case 5:
                        if (botDistances[i] > botIntersect.distance) {
                            bot.position.z += (botDistances[i] - botIntersect.distance);
                            botLinearVelocity.z = -botLinearVelocity.z * botRestitution;;
                        }
                        break;
                }

            } catch (error) { }
        }


        if (selector.position.y > bot.position.y + 1) {
            bot.getObjectByName('Eye').lookAt(new THREE.Vector3(selector.position.x, selector.position.y, selector.position.z));
            bot.getObjectByName('Eye').rotateX(deg(90));
        } else if (selector.position.x < bot.position.x + 0.5 && selector.position.x > bot.position.x - 0.5 && selector.position.z < bot.position.z + 0.5 && selector.position.z > bot.position.z - 0.5) {
            bot.getObjectByName('Eye').lookAt(camera.position);
            bot.getObjectByName('Eye').rotateX(deg(90));
        } else {
            bot.getObjectByName('Eye').lookAt(new THREE.Vector3(selector.position.x, selector.position.y + 1.25, selector.position.z));
            bot.getObjectByName('Eye').rotateX(deg(90));
        }


        bot.getObjectByName('ShoulderR').rotation.z = deg(-60);
        bot.getObjectByName('ShoulderL').rotation.z = deg(60);

        bot.position.x -= botLinearVelocity.x;
        bot.position.y += botLinearVelocity.y;
        bot.position.z -= botLinearVelocity.z;


        scene.traverse(function (child) {
            if (child instanceof THREE.SkinnedMesh || child instanceof THREE.Mesh) {
                if (!(child instanceof THREE.Water)) {
                    child.castShadow = true;
                } else {
                    //child.material.uniforms["time"].value += 0.5 * delta;
                    //child.renderOrder = 2;
                    //child.material.blending = THREE.MultiplyBlending;
                }
                child.receiveShadow = true;
            }
        });
        for (var i = 0; i < zaps.length; i++) {
            zaps[i].update();
        }



        if (orbitUp === true) {
            camera.translateY((camdistance * 2) * delta);
        }
        if (orbitDown === true) {
            camera.translateY((-camdistance * 2) * delta);
        }
        if (orbitRight === true) {
            camera.translateX((camdistance * 2) * delta);
        }
        if (orbitLeft === true) {
            camera.translateX((-camdistance * 2) * delta);
        }
        var target = new THREE.Vector3(-levelDimensions.x / 2, levelDimensions.y / 2, -levelDimensions.z / 2);
        //var target = bot.position;
        camera.lookAt(target);
        camera.translateZ(-(CustomMath.Distance(camera.position, target) - camdistance) / 5);



        renderer.render(scene, camera);
    };

    animate();
}