var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local');
document.body.appendChild(renderer.domElement);
try {
document.body.appendChild(VRButton.createButton(renderer)); //
} catch (e) {}

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xcce0ff);
var light = new THREE.HemisphereLight(0xfff0f0, 0x606066);
light.position.set(1, 1, 1);
scene.add(light);
var train = new THREE.Object3D();
scene.add(train);
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100000000000);
train.add(camera); // environment

var geometry = new THREE.PlaneBufferGeometry(1000, 1000, 50, 50);
geometry.rotateX(-Math.PI / 2);
var positions = geometry.attributes.position.array;
var vertex = new THREE.Vector3();

for (var i = 0; i < positions.length; i += 3) {
  vertex.fromArray(positions, i);
  vertex.x += Math.random() * 10 - 5;
  vertex.z += Math.random() * 10 - 5;
  var distance = vertex.distanceTo(scene.position) / 5 - 25;
  vertex.y = Math.random() * Math.max(0, distance);
  vertex.toArray(positions, i);
}

geometry.computeVertexNormals();
var material = new THREE.MeshLambertMaterial({
  color: 0x407000
});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
var geometry = new THREE.TreesGeometry(mesh);
var material = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  vertexColors: true
});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
var geometry = new THREE.SkyGeometry();
var material = new THREE.MeshBasicMaterial({
  color: 0xffffff
});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh); //

var PI2 = Math.PI * 2;

var curve = function () {
  var vector = new THREE.Vector3();
  var vector2 = new THREE.Vector3();
  return {
    getPointAt: function getPointAt(t) {
      t = t * PI2;
      var x = Math.sin(t * 3) * Math.cos(t * 4) * 50;
      var y = Math.sin(t * 10) * 2 + Math.cos(t * 17) * 2 + 5;
      var z = Math.sin(t) * Math.sin(t * 4) * 50;
      return vector.set(x, y, z).multiplyScalar(2);
    },
    getTangentAt: function getTangentAt(t) {
      var delta = 0.0001;
      var t1 = Math.max(0, t - delta);
      var t2 = Math.min(1, t + delta);
      return vector2.copy(this.getPointAt(t2)).sub(this.getPointAt(t1)).normalize();
    }
  };
}();

var geometry = new THREE.RollerCoasterGeometry(curve, 2000);
var material = new THREE.MeshPhongMaterial({
  vertexColors: true
});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
var geometry = new THREE.RollerCoasterLiftersGeometry(curve, 100);
var material = new THREE.MeshPhongMaterial();
var mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 0.1;
scene.add(mesh);
var geometry = new THREE.RollerCoasterShadowGeometry(curve, 500);
var material = new THREE.MeshBasicMaterial({
  color: 0x305000,
  depthWrite: false,
  transparent: false
});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 0.1;
scene.add(mesh);
var funfairs = []; //

var geometry = new THREE.CylinderBufferGeometry(10, 10, 5, 15);
var material = new THREE.MeshLambertMaterial({
  color: 0xff8080 //flatShading: true // Lambert does not support flat shading

});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(-80, 10, -70);
mesh.rotation.x = Math.PI / 2;
scene.add(mesh);
funfairs.push(mesh);
var geometry = new THREE.CylinderBufferGeometry(5, 6, 4, 10);
var material = new THREE.MeshLambertMaterial({
  color: 0x8080ff //flatShading: true // Lambert does not support flat shading

});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(50, 2, 30);
scene.add(mesh);
funfairs.push(mesh); //

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
} //


var position = new THREE.Vector3();
var tangent = new THREE.Vector3();
var lookAt = new THREE.Vector3();
var velocity = 0;
var progress = 0;
var prevTime = performance.now();

function render() {
  var time = performance.now();
  var delta = time - prevTime;

  for (var i = 0; i < funfairs.length; i++) {
    funfairs[i].rotation.y = time * 0.0004;
  } //


  progress += velocity;
  progress = progress % 1;
  position.copy(curve.getPointAt(progress));
  position.y += 0.3;
  train.position.copy(position);
  tangent.copy(curve.getTangentAt(progress));
  velocity -= tangent.y * 0.0000001 * delta;
  velocity = Math.max(0.00004, Math.min(0.0002, velocity));
  train.lookAt(lookAt.copy(position).sub(tangent)); //

  try {
// Update VR headset position and apply to camera.
    controls.update();
  } catch (e) {}

try {
  effect.render(scene, camera);
} catch (e) {
  renderer.render(scene, camera);
}
  prevTime = time;
}

renderer.setAnimationLoop(render);