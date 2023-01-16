var tau = 6.28318530717958637392528;

var flipSide = (function () {
	var temp;
	return function (geo) {
		for (var v = 0; v < geo.index.array.length; v += 3) {
			// swap the first and third values
			temp = geo.index.array[v];
			geo.index.array[v] = geo.index.array[v + 2];
			geo.index.array[v + 2] = temp;
		}
	};
})();

var tssize = 2048;
var detail = 8;

var box = new THREE.BoxBufferGeometry();
var ball = (function () {
	var geo = new THREE.BoxBufferGeometry(1, 1, 1, detail, detail, detail);
	var tmpv = new THREE.Vector3();
	for (var v = 0; v < geo.attributes.position.count; v++) {
		tmpv.set(geo.attributes.position.getX(v), geo.attributes.position.getY(v), geo.attributes.position.getZ(v));
		tmpv.setLength(0.5);
		geo.attributes.position.setXYZ(v, tmpv.x, tmpv.y, tmpv.z);
		tmpv.normalize();
		geo.attributes.normal.setXYZ(v, tmpv.x, tmpv.y, tmpv.z);
	}
	return geo;
})();
var trashCan = (function () {
	var outerRadiusTop = 0.6;
	var innerRadiusTop = 0.5;
	var outerRadiusBottom = 0.5;
	var innerRadiusBottom = 0.4;
	var outside = new THREE.CylinderBufferGeometry(outerRadiusTop, outerRadiusBottom, 1, 8, 1, true);

	var x = 388;
	var y = 1910;
	var w = 56;
	var h = 45;

	for (var l = outside.attributes.uv.count * (0 / 2); l < outside.attributes.uv.count * (1 / 2); l += 2) {
		var u = 0;
		var v = 1;
		outside.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));

		u = 1;
		v = 1;
		outside.attributes.uv.setXY(l + 1, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}

	for (var l = outside.attributes.uv.count * (1 / 2); l < outside.attributes.uv.count * (2 / 2); l += 2) {
		var u = 0;
		var v = 0;
		outside.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));

		u = 1;
		v = 0;
		outside.attributes.uv.setXY(l + 1, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}

	var inside = new THREE.CylinderBufferGeometry(innerRadiusTop, innerRadiusBottom, 0.9, 8, 1, true);
	inside.translate(0, 0.05, 0);
	for (var v = 0; v < inside.attributes.normal.count; v++) {
		inside.attributes.normal.setXYZ(v, -inside.attributes.position.getX(v), -inside.attributes.position.getY(v), -inside.attributes.position.getZ(v));
	}
	flipSide(inside);

	x = 388;
	y = 1916;
	w = 56;
	h = 6;

	for (var l = 0; l <= inside.attributes.uv.count; l++) {
		var u = inside.attributes.uv.getX(l);
		var v = 1 - inside.attributes.uv.getY(l);
		inside.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}

	var top = new THREE.RingBufferGeometry(innerRadiusTop, outerRadiusTop, 8);
	top.rotateX(-tau / 4);
	top.translate(0, 0.5, 0);

	x = 388;
	y = 1910;
	w = 56;
	h = 0;

	for (var l = 0; l <= top.attributes.uv.count; l++) {
		var u = top.attributes.uv.getX(l);
		var v = top.attributes.uv.getY(l);
		top.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}

	var outsideBottom = new THREE.CircleBufferGeometry(outerRadiusBottom, 8);
	outsideBottom.rotateX(tau / 4);
	outsideBottom.translate(0, -0.5, 0);

	x = 388;
	y = 1866;
	w = 56;
	h = 0;

	for (var l = 0; l < outsideBottom.attributes.uv.count; l++) {
		var u = outsideBottom.attributes.uv.getX(l);
		var v = outsideBottom.attributes.uv.getY(l);
		outsideBottom.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}

	var insideBottom = new THREE.CircleBufferGeometry(innerRadiusBottom, 8);
	insideBottom.rotateX(-tau / 4);
	insideBottom.translate(0, -0.4, 0);

	x = 388;
	y = 1916;
	w = 56;
	h = 0;

	for (var l = 0; l < insideBottom.attributes.uv.count; l++) {
		var u = insideBottom.attributes.uv.getX(l);
		var v = insideBottom.attributes.uv.getY(l);
		insideBottom.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}
	return THREE.BufferGeometryUtils.mergeBufferGeometries([outside, inside, top, outsideBottom, insideBottom], false);
})();
var pillar = (function () {
	var geo = new THREE.BoxBufferGeometry(1, 1, 1, detail, detail, detail);
	var tmpv = new THREE.Vector3();
	for (var v = 0; v < geo.attributes.position.count; v++) {
		tmpv.set(geo.attributes.position.getX(v), 0, geo.attributes.position.getZ(v));
		tmpv.clampLength(0, 0.5);
		geo.attributes.position.setXYZ(v, tmpv.x, geo.attributes.position.getY(v), tmpv.z);
		if (v < geo.attributes.position.count * (2 / 6) || v > geo.attributes.position.count * (4 / 6)) {
			tmpv.normalize();
			geo.attributes.normal.setXYZ(v, tmpv.x, tmpv.y, tmpv.z);
		}
	}
	return geo;
})();
var pillar = (function () {
	var geo = new THREE.BoxBufferGeometry(1, 1, 1, detail, detail, detail);
	var tmpv = new THREE.Vector3();
	for (var v = 0; v < geo.attributes.position.count; v++) {
		tmpv.set(geo.attributes.position.getX(v), 0, geo.attributes.position.getZ(v));
		tmpv.clampLength(0, 0.5);
		geo.attributes.position.setXYZ(v, tmpv.x, geo.attributes.position.getY(v), tmpv.z);
		if (v < geo.attributes.position.count * (2 / 6) || v > geo.attributes.position.count * (4 / 6)) {
			tmpv.normalize();
			geo.attributes.normal.setXYZ(v, tmpv.x, tmpv.y, tmpv.z);
		}
	}
	return geo;
})();
var halfPillar = (function () {
	var geo = new THREE.BoxBufferGeometry(1, 1, 1, detail, detail, detail);
	var tmpv = new THREE.Vector3();
	for (var v = 0; v < geo.attributes.position.count; v++) {
		tmpv.set(geo.attributes.position.getX(v), 0, geo.attributes.position.getZ(v));
		if (tmpv.z > 0) {
			tmpv.clampLength(0, 0.5);
			geo.attributes.position.setXYZ(v, tmpv.x, geo.attributes.position.getY(v), tmpv.z);
			if (v < geo.attributes.position.count * (2 / 6) || v > geo.attributes.position.count * (4 / 6)) {
				tmpv.normalize();
				geo.attributes.normal.setXYZ(v, tmpv.x, tmpv.y, tmpv.z);
			}
		}
	}
	return geo;
})();
var quarterPillar = (function () {
	var geo = new THREE.BoxBufferGeometry(1, 1, 1, detail, detail, detail);
	var tmpv = new THREE.Vector3();
	for (var v = 0; v < geo.attributes.position.count; v++) {
		tmpv.set(geo.attributes.position.getX(v), 0, geo.attributes.position.getZ(v));
		if (tmpv.z > 0 && tmpv.x > 0) {
			tmpv.clampLength(0, 0.5);
			geo.attributes.position.setXYZ(v, tmpv.x, geo.attributes.position.getY(v), tmpv.z);
			if (v < geo.attributes.position.count * (2 / 6) || v > geo.attributes.position.count * (4 / 6)) {
				tmpv.normalize();
				geo.attributes.normal.setXYZ(v, tmpv.x, tmpv.y, tmpv.z);
			}
		}
	}
	return geo;
})();
var rail = (function () {
	/*var geo = new THREE.BoxBufferGeometry(0.2, 1, 0.2, detail, detail, detail);
	var tmpv = new THREE.Vector3();
	for (var v = 0; v < geo.attributes.position.count; v++) {
		tmpv.set(geo.attributes.position.getX(v), 0, geo.attributes.position.getZ(v));
		tmpv.clampLength(0, 0.1);
		geo.attributes.position.setXYZ(v, tmpv.x, geo.attributes.position.getY(v), tmpv.z);
		if (v < geo.attributes.position.count * (2/6) || v > geo.attributes.position.count * (4/6)) {
			tmpv.normalize();
			geo.attributes.normal.setXYZ(v, tmpv.x, tmpv.y, tmpv.z);
		}
	}*/
	var geo = new THREE.CylinderBufferGeometry(0.1, 0.1, 1, detail);
	return geo;
})();
var curvedRail = (function () {
	var bend = new THREE.TorusBufferGeometry(0.5, 0.1, detail, detail, tau / 4);
	bend.rotateX(-tau / 4);
	bend.rotateY(tau / 4);
	bend.translate(0.5, 0, 0.5);

	var frontCap = new THREE.CircleBufferGeometry(0.1, detail);
	frontCap.translate(0, 0, 0.5);
	var sideCap = new THREE.CircleBufferGeometry(0.1, detail);
	sideCap.rotateY(tau / 4);
	sideCap.translate(0.5, 0, 0);

	return THREE.BufferGeometryUtils.mergeBufferGeometries([bend, frontCap, sideCap], false);
})();
var star = (function () {
	var front = new THREE.ConeBufferGeometry(0.5, 0.15, 10, 1, true);
	var tmpv = new THREE.Vector3();
	for (var v = 1; v < front.attributes.position.count; v++) {
		tmpv.set(front.attributes.position.getX(v), 0, front.attributes.position.getZ(v));
		if (v % 2 == 0) {
			tmpv.setLength(0.25);
		}
		front.attributes.position.setXYZ(v, tmpv.x, front.attributes.position.getY(v), tmpv.z);
	}
	front.rotateX(tau / 4);
	front.rotateZ(tau / 10);
	front.translate(0, 0, 0.075);
	front.computeVertexNormals();

	var back = new THREE.ConeBufferGeometry(0.5, 0.15, 10, 1, true);
	for (var v = 1; v < back.attributes.position.count; v++) {
		tmpv.set(back.attributes.position.getX(v), 0, back.attributes.position.getZ(v));
		if (v % 2 == 0) {
			tmpv.setLength(0.25);
		}
		back.attributes.position.setXYZ(v, tmpv.x, back.attributes.position.getY(v), tmpv.z);
	}
	back.rotateX(-tau / 4);
	back.translate(0, 0, -0.075);
	back.computeVertexNormals();

	return THREE.BufferGeometryUtils.mergeBufferGeometries([front, back], false);
})();
var stair = (function () {
	var bottom = new THREE.PlaneBufferGeometry(1, 1);
	bottom.rotateX(tau / 4);
	bottom.translate(0, -0.5, 0);

	var back = new THREE.PlaneBufferGeometry(1, 1);
	back.rotateX(tau / 2);
	back.translate(0, 0, -0.5);

	var baseRight = new THREE.PlaneBufferGeometry(1, 0.5);
	baseRight.rotateY(-tau / 4);
	baseRight.translate(-0.5, -0.25, 0);
	for (var l = 0; l < baseRight.attributes.uv.count; l++) {
		var u = baseRight.attributes.uv.getX(l);
		var v = baseRight.attributes.uv.getY(l);
		baseRight.attributes.uv.setXY(l, u, v * 0.5);
	}

	var baseLeft = new THREE.PlaneBufferGeometry(1, 0.5);
	baseLeft.rotateY(tau / 4);
	baseLeft.translate(0.5, -0.25, 0);
	for (var l = 0; l < baseLeft.attributes.uv.count; l++) {
		var u = baseLeft.attributes.uv.getX(l);
		var v = baseLeft.attributes.uv.getY(l);
		baseLeft.attributes.uv.setXY(l, u, v * 0.5);
	}

	var baseTop = new THREE.PlaneBufferGeometry(1, 0.5);
	baseTop.rotateX(-tau / 4);
	baseTop.translate(0, 0, 0.25);

	var baseFront = new THREE.PlaneBufferGeometry(1, 0.5);
	baseFront.translate(0, -0.25, 0.5);

	var stepRight = new THREE.PlaneBufferGeometry(0.5, 0.5);
	stepRight.rotateY(-tau / 4);
	stepRight.translate(-0.5, 0.25, -0.25);
	for (var l = 0; l < stepRight.attributes.uv.count; l++) {
		var u = stepRight.attributes.uv.getX(l);
		var v = stepRight.attributes.uv.getY(l);
		stepRight.attributes.uv.setXY(l, (u + 1) * 0.5, (v + 1) * 0.5);
	}

	var stepLeft = new THREE.PlaneBufferGeometry(0.5, 0.5);
	stepLeft.rotateY(tau / 4);
	stepLeft.translate(0.5, 0.25, -0.25);
	for (var l = 0; l < stepLeft.attributes.uv.count; l++) {
		var u = stepLeft.attributes.uv.getX(l);
		var v = stepLeft.attributes.uv.getY(l);
		stepLeft.attributes.uv.setXY(l, (u + 1) * 0.5, (v + 1) * 0.5);
	}

	var stepTop = new THREE.PlaneBufferGeometry(1, 0.5);
	stepTop.rotateX(-tau / 4);
	stepTop.translate(0, 0.5, -0.25);

	var stepFront = new THREE.PlaneBufferGeometry(1, 0.5);
	stepFront.translate(0, 0.25, 0);

	return THREE.BufferGeometryUtils.mergeBufferGeometries([bottom, back, baseRight, baseLeft, baseTop, baseFront, stepRight, stepLeft, stepTop, stepFront], false);
})();
var slope = (function () {
	var bottom = new THREE.PlaneBufferGeometry(1, 1);
	bottom.rotateX(tau / 4);
	bottom.translate(0, -0.5, 0);

	var back = new THREE.PlaneBufferGeometry(1, 1);
	back.rotateX(tau / 2);
	back.translate(0, 0, -0.5);

	var right = new THREE.PlaneBufferGeometry(1, 1);
	var ta = Array.from(right.index.array);
	ta.shift();
	ta.shift();
	ta.shift();
	right.setIndex(ta);
	right.rotateY(tau / 4);
	right.translate(-0.5, 0, 0);
	flipSide(right);
	for (var v = 0; v < right.attributes.normal.count; v++) {
		right.attributes.normal.setXYZ(v, -right.attributes.normal.getX(v), -right.attributes.normal.getY(v), -right.attributes.normal.getZ(v));
	}

	var left = new THREE.PlaneBufferGeometry(1, 1);
	var ta = Array.from(left.index.array);
	ta.shift();
	ta.shift();
	ta.shift();
	left.setIndex(ta);
	left.rotateY(tau / 4);
	left.translate(0.5, 0, 0);

	var slant = new THREE.PlaneBufferGeometry(1, Math.sqrt(2));
	slant.rotateX(-tau / 8);

	return THREE.BufferGeometryUtils.mergeBufferGeometries([bottom, back, right, left, slant], false);
})();
var fence = (function () {

	var x = 68;
	var y = 1788;
	var w = 56;
	var h = 56;

	var middle = new THREE.BoxBufferGeometry(0.8, 1, 0.1);
	middle.rotateZ(tau / 4);
	for (var l = 0; l < middle.attributes.uv.count; l++) {
		var u = middle.attributes.uv.getX(l);
		var v = middle.attributes.uv.getY(l);
		middle.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}


	x = 101;
	y = 1852;
	w = 22;


	var top = new THREE.BoxBufferGeometry(0.1, 1, 0.2);
	top.rotateZ(tau / 4);
	for (var l = 0; l < top.attributes.uv.count; l++) {
		var u = top.attributes.uv.getX(l);
		var v = top.attributes.uv.getY(l);
		top.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}
	top.translate(0, 0.45, 0);


	var bottom = new THREE.BoxBufferGeometry(0.1, 1, 0.2);
	bottom.rotateZ(tau / 4);
	for (var l = 0; l < bottom.attributes.uv.count; l++) {
		var u = bottom.attributes.uv.getX(l);
		var v = bottom.attributes.uv.getY(l);
		bottom.attributes.uv.setXY(l, (u / (tssize / w)) + (x / tssize), (v / (tssize / h)) + ((y - h) / tssize));
	}
	bottom.translate(0, -0.45, 0);

	return THREE.BufferGeometryUtils.mergeBufferGeometries([top, middle, bottom], false);
})();