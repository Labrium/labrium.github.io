var CustomMath = {
	Distance: function (point1, point2) {
	    var dx = point1.x - point2.x;
	    var dy = point1.y - point2.y;
	    var dz = point1.z - point2.z;
	    return Math.sqrt(dx * dx + dy * dy + dz * dz);
	},

	PointBetween: function (point1, point2, fraction) {
	    var dx = (point2.x - point1.x);
	    var dy = (point2.y - point1.y);
	    var dz = (point2.z - point1.z);
	    return new THREE.Vector3(point1.x + (dx * fraction), point1.y + (dy * fraction), point1.z + (dz * fraction));
	}
}