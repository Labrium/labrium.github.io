
var THREE = THREE || {};
THREE.AxisCubeHelper = function (canvas, size, segments, material) {

	var helperCubeScene = new THREE.Scene();
	var helperCubeCamera = new THREE.PerspectiveCamera(15, 1, 0.001, 10);
	var helperCubeRenderer = new THREE.WebGL1Renderer({ canvas: canvas, alpha: true, antialias: true });
	helperCubeRenderer.physicallyCorrectLights = true;
	helperCubeRenderer.setSize(128, 128);

	var cube = new THREE.Group();
	helperCubeScene.add(cube);

	// Dimensions
	var fsize = size * 0.75;
	var hsize = size * 0.5;
	var rsize = size * 0.125;
	var csize = size * 0.375;


	// Faces
	var fgeom = new THREE.PlaneBufferGeometry(fsize, fsize);

	var front = new THREE.Mesh(fgeom, material);
	front.position.z = hsize;
	cube.add(front);

	var back = new THREE.Mesh(fgeom, material);
	back.rotation.y = Math.PI;
	back.position.z = -hsize;
	cube.add(back);

	var left = new THREE.Mesh(fgeom, material);
	left.rotation.y = -Math.PI / 2;
	left.position.x = -hsize;
	cube.add(left);

	var right = new THREE.Mesh(fgeom, material);
	right.rotation.y = Math.PI / 2;
	right.position.x = hsize;
	cube.add(right);

	var top = new THREE.Mesh(fgeom, material);
	top.rotation.x = -Math.PI / 2;
	top.position.y = hsize;
	cube.add(top);

	var bottom = new THREE.Mesh(fgeom, material);
	bottom.rotation.x = Math.PI / 2;
	bottom.position.y = -hsize;
	cube.add(bottom);


	// Edges
	var frontRight = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, 0, Math.PI / 2), material);
	frontRight.position.z = csize;
	frontRight.position.x = csize;
	cube.add(frontRight);

	var frontLeft = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, -Math.PI / 2, Math.PI / 2), material);
	frontLeft.position.z = csize;
	frontLeft.position.x = -csize;
	cube.add(frontLeft);

	var backRight = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, Math.PI / 2, Math.PI / 2), material);
	backRight.position.z = -csize;
	backRight.position.x = csize;
	cube.add(backRight);

	var backLeft = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, Math.PI, Math.PI / 2), material);
	backLeft.position.z = -csize;
	backLeft.position.x = -csize;
	cube.add(backLeft);

	var topRight = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, Math.PI / 2, Math.PI / 2), material);
	topRight.rotation.x = Math.PI / 2;
	topRight.position.y = csize;
	topRight.position.x = csize;
	cube.add(topRight);

	var topLeft = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, Math.PI, Math.PI / 2), material);
	topLeft.rotation.x = Math.PI / 2;
	topLeft.position.y = csize;
	topLeft.position.x = -csize;
	cube.add(topLeft);

	var topFront = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, 0, Math.PI / 2), material);
	topFront.rotation.z = Math.PI / 2;
	topFront.position.y = csize;
	topFront.position.z = csize;
	cube.add(topFront);

	var topBack = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, Math.PI / 2, Math.PI / 2), material);
	topBack.rotation.z = Math.PI / 2;
	topBack.position.y = csize;
	topBack.position.z = -csize;
	cube.add(topBack);

	var bottomRight = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, 0, Math.PI / 2), material);
	bottomRight.rotation.x = Math.PI / 2;
	bottomRight.position.y = -csize;
	bottomRight.position.x = csize;
	cube.add(bottomRight);

	var bottomLeft = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, -Math.PI / 2, Math.PI / 2), material);
	bottomLeft.rotation.x = Math.PI / 2;
	bottomLeft.position.y = -csize;
	bottomLeft.position.x = -csize;
	cube.add(bottomLeft);

	var bottomFront = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, -Math.PI / 2, Math.PI / 2), material);
	bottomFront.rotation.z = Math.PI / 2;
	bottomFront.position.y = -csize;
	bottomFront.position.z = csize;
	cube.add(bottomFront);

	var bottomBack = new THREE.Mesh(new THREE.CylinderBufferGeometry(rsize, rsize, fsize, segments, 1, true, Math.PI, Math.PI / 2), material);
	bottomBack.rotation.z = Math.PI / 2;
	bottomBack.position.y = -csize;
	bottomBack.position.z = -csize;
	cube.add(bottomBack);

	// Corners
	var frontRightTop = new THREE.Mesh(new THREE.SphereBufferGeometry(rsize, segments, segments, Math.PI / 2, Math.PI / 2, 0, Math.PI / 2), material);
	frontRightTop.position.set(csize, csize, csize);
	cube.add(frontRightTop);

	var frontLeftTop = new THREE.Mesh(new THREE.SphereBufferGeometry(rsize, segments, segments, 0, Math.PI / 2, 0, Math.PI / 2), material);
	frontLeftTop.position.set(-csize, csize, csize);
	cube.add(frontLeftTop);

	var backRightTop = new THREE.Mesh(new THREE.SphereBufferGeometry(rsize, segments, segments, Math.PI, Math.PI / 2, 0, Math.PI / 2), material);
	backRightTop.position.set(csize, csize, -csize);
	cube.add(backRightTop);

	var backLeftTop = new THREE.Mesh(new THREE.SphereBufferGeometry(rsize, segments, segments, -Math.PI / 2, Math.PI / 2, 0, Math.PI / 2), material);
	backLeftTop.position.set(-csize, csize, -csize);
	cube.add(backLeftTop);

	var frontRightBottom = new THREE.Mesh(new THREE.SphereBufferGeometry(rsize, segments, segments, Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2), material);
	frontRightBottom.position.set(csize, -csize, csize);
	cube.add(frontRightBottom);

	var frontLeftBottom = new THREE.Mesh(new THREE.SphereBufferGeometry(rsize, segments, segments, 0, Math.PI / 2, Math.PI / 2, Math.PI / 2), material);
	frontLeftBottom.position.set(-csize, -csize, csize);
	cube.add(frontLeftBottom);

	var backRightBottom = new THREE.Mesh(new THREE.SphereBufferGeometry(rsize, segments, segments, Math.PI, Math.PI / 2, Math.PI / 2, Math.PI / 2), material);
	backRightBottom.position.set(csize, -csize, -csize);
	cube.add(backRightBottom);

	var backLeftBottom = new THREE.Mesh(new THREE.SphereBufferGeometry(rsize, segments, segments, -Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2), material);
	backLeftBottom.position.set(-csize, -csize, -csize);
	cube.add(backLeftBottom);



	// Axes
	var axes = new THREE.AxesHelper(size * 1.25);
	axes.material.linewidth = 3;
	axes.geometry.attributes.color.array = new Float32Array([1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1]);
	axes.position.setScalar(-hsize);
	cube.add(axes);

	// Light
	helperCubeScene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 3));


	this.update = function (camera, target) {
		helperCubeCamera.position.copy(camera.position.clone().sub(oc.target).setLength(8));
		helperCubeCamera.rotation.copy(camera.rotation);
		helperCubeRenderer.render(helperCubeScene, helperCubeCamera);
	};
};