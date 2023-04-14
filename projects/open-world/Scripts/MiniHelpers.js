function MHRenderer(parent, antialias) {
	var renderer = new THREE.WebGLRenderer({ antialias: antialias || false });
	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = THREE.sRGBEncoding;
	parent.appendChild(renderer.domElement);
	return renderer;
}

var MHResized = true;
var MHOnResize = function () {};
var [MHInitResize, MHUpdateResize] = (function () {
	return [function (renderer, camera, callback) {
		MHOnResize = function (element) {
			var w = window.innerWidth;
			var h = window.innerHeight;
			if (element) {
				w = element.offsetWidth;
				h = element.offsetHeight;
			}
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h, false);
			if (callback) {
				callback();
			}
		}
		window.addEventListener("resize", function () {MHResized = true;}, false);
	}, function (element) {
		if (MHResized) {
			MHOnResize(element);
			MHResized = false;
		}
	}];

})();

function MHSRGBMat(mat) {
	if (mat.map) {
		mat.map.encoding = THREE.sRGBEncoding;
	}
	if (mat.emissiveMap) {
		mat.emissiveMap.encoding = THREE.sRGBEncoding;
	}
}

function MHCamFollow(cam, target, distance) {
	cam.lookAt(target);
	cam.translateZ(-(cam.position.distanceTo(target) - distance) / 10);
}

function MHAllowShadows(renderer) {
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

function MHShadow(light, mapsize, range, far) {
	sun.castShadow = true;
	sun.shadow.mapSize.width = mapsize;
	sun.shadow.mapSize.height = mapsize;
	sun.shadow.camera.left = -range;
	sun.shadow.camera.right = range;
	sun.shadow.camera.top = range;
	sun.shadow.camera.bottom = -range;
	sun.shadow.camera.near = 0;
	sun.shadow.camera.far = far;
	//sun.shadow.radius = 2;
}

var MHHDRLoader;
var MHPMREMGenerator;
function MHInitHDREnv(renderer) {
	MHPMREMGenerator = new THREE.PMREMGenerator(renderer);
	MHHDRLoader = new THREE.RGBELoader();
}
function MHHDREnv(filename, scene) {
	MHHDRLoader.load(filename, function (hdr) {
		var rt = MHPMREMGenerator.fromEquirectangular(hdr);
		scene.background = rt.texture;
		scene.environment = rt.texture;
	});
}