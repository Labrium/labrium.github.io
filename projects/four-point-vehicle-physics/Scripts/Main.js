var tau = 6.28318530717958637692528;

THREE.MathUtils.damp = function (x, y, lambda, dt) {
	return THREE.MathUtils.lerp(x, y, 1 - Math.exp(-lambda * dt));
};

var camdistance = 3;

var orbitUp, orbitDown, orbitLeft, orbitRight;
var moveUp, moveDown, moveleft, moveRight, jump;

var antigrav = false;
var carmode = false;

var onKeyDown = function (event) {
	switch (event.code) {
		case "ArrowUp":
			orbitUp = true;
			break;
		case "ArrowLeft":
			orbitLeft = true;
			break;
		case "ArrowDown":
			orbitDown = true;
			break;
		case "ArrowRight":
			orbitRight = true;
			break;
		case "Equal":
			camdistance /= 1.1;
			break;
		case "NumpadSubtract":
			camdistance *= 1.1;
			break;
		case "Numpad0":
			camdistance = 3;
			break;

		case "KeyW":
			moveUp = true;
			break;
		case "KeyS":
			moveDown = true;
			break;
		case "KeyA":
			moveleft = true;
			break;
		case "KeyD":
			moveRight = true;
			break;
		case "Space":
			jump = true;
			break;

		case "KeyF":
			antigrav = !antigrav;
			break;
		case "KeyC":
			carmode = !carmode;
			break;

	}
};
var onKeyUp = function (event) {
	switch (event.code) {
		case "ArrowUp":
			orbitUp = false;
			break;
		case "ArrowLeft":
			orbitLeft = false;
			break;
		case "ArrowDown":
			orbitDown = false;
			break;
		case "ArrowRight":
			orbitRight = false;
			break;

		case "KeyW":
			moveUp = false;
			break;
		case "KeyS":
			moveDown = false;
			break;
		case "KeyA":
			moveleft = false;
			break;
		case "KeyD":
			moveRight = false;
			break;
		case "Space":
			jump = false;
			break;
	}
};
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);





var stats = new Stats(0.1);
document.body.appendChild(stats.dom);

var DCPanel = new Stats.Panel("DC", "#f88", "#211");
stats.addPanel(DCPanel);



var windowResized = true;

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	shaderMaterial.uniforms.size.value.set(window.innerWidth, window.innerHeight);
	ssaoBuffer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", function () {
	windowResized = true;
}, false);



THREE.BufferGeometry.prototype.computeBoundsTree = MeshBVHLib.computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = MeshBVHLib.disposeBoundsTree;
THREE.Mesh.prototype.raycast = MeshBVHLib.acceleratedRaycast;



THREE.FXAAShader = {
	uniforms: {
		tDiffuse: {
			type: "t",
			value: null
		},
		resolution: {
			type: "v2",
			value: new THREE.Vector2(1 / 1024, 1 / 512)
		}
	},
	vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
	fragmentShader: "uniform sampler2D tDiffuse;\nuniform vec2 resolution;\nvarying vec2 vUv;\n#define FXAA_REDUCE_MIN   (1.0/128.0)\n#define FXAA_REDUCE_MUL   (1.0/8.0)\n#define FXAA_SPAN_MAX     8.0\nvoid main() {\nvec3 rgbNW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * resolution ).xyz;\nvec3 rgbNE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * resolution ).xyz;\nvec3 rgbSW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * resolution ).xyz;\nvec3 rgbSE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * resolution ).xyz;\nvec4 rgbaM  = texture2D( tDiffuse,  gl_FragCoord.xy  * resolution );\nvec3 rgbM  = rgbaM.xyz;\nfloat opacity  = rgbaM.w;\nvec3 luma = vec3( 0.299, 0.587, 0.114 );\nfloat lumaNW = dot( rgbNW, luma );\nfloat lumaNE = dot( rgbNE, luma );\nfloat lumaSW = dot( rgbSW, luma );\nfloat lumaSE = dot( rgbSE, luma );\nfloat lumaM  = dot( rgbM,  luma );\nfloat lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );\nfloat lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );\nvec2 dir;\ndir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\ndir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\nfloat dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );\nfloat rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );\ndir = min( vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),\nmax( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\ndir * rcpDirMin)) * resolution;\nvec3 rgbA = 0.5 * (\ntexture2D( tDiffuse, gl_FragCoord.xy  * resolution + dir * ( 1.0 / 3.0 - 0.5 ) ).xyz +\ntexture2D( tDiffuse, gl_FragCoord.xy  * resolution + dir * ( 2.0 / 3.0 - 0.5 ) ).xyz );\nvec3 rgbB = rgbA * 0.5 + 0.25 * (\ntexture2D( tDiffuse, gl_FragCoord.xy  * resolution + dir * -0.5 ).xyz +\ntexture2D( tDiffuse, gl_FragCoord.xy  * resolution + dir * 0.5 ).xyz );\nfloat lumaB = dot( rgbB, luma );\nif ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) ) {\ngl_FragColor = vec4( rgbA, opacity );\n} else {\ngl_FragColor = vec4( rgbB, opacity );\n}\n}"
};



THREE.SSAOShader = {
	uniforms: {
		albedo: new THREE.Uniform(null),
		size: new THREE.Uniform(new THREE.Vector2())
	},
	vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",

	fragmentShader: `varying vec2 vUv;

uniform sampler2D albedo;
uniform vec2 size;

void main() {
	vec4 col = vec4(0);
	// Current texture coordinate
	vec2 texel = vUv;
	vec4 pixel = vec4(mapTexelToLinear(texture2D(albedo, texel)));

	// Dim factor
	float dim = 0.0;

	vec4 bloom = vec4(0);	// The vector to contain the new, "bloomed" colour values
	float glow = 5.0;

	// Apply a horrible version of "mean filter"
	// Horrible because GLSL needs constants for loop initializations
	bloom += mapTexelToLinear(texture2D(albedo, vec2(texel.x, texel.y))) - dim;
	bloom += mapTexelToLinear(texture2D(albedo, vec2(texel.x - (glow / size.x), texel.y - (glow / size.y)))) - dim;
	bloom += mapTexelToLinear(texture2D(albedo, vec2(texel.x + (glow / size.x), texel.y + (glow / size.y)))) - dim;
	bloom += mapTexelToLinear(texture2D(albedo, vec2(texel.x + (glow / size.x), texel.y - (glow / size.y)))) - dim;
	bloom += mapTexelToLinear(texture2D(albedo, vec2(texel.x - (glow / size.x), texel.y + (glow / size.y)))) - dim;
	bloom += mapTexelToLinear(texture2D(albedo, vec2(texel.x + (glow / size.x), texel.y))) - dim;
	bloom += mapTexelToLinear(texture2D(albedo, vec2(texel.x - (glow / size.x), texel.y))) - dim;
	bloom += mapTexelToLinear(texture2D(albedo, vec2(texel.x, texel.y + (glow / size.y)))) - dim;
	bloom += mapTexelToLinear(texture2D(albedo, vec2(texel.x, texel.y - (glow / size.y)))) - dim;

	// Clamp the value between a 0.0 to 1.0 range
	bloom = (bloom * bloom) * 0.005;

	col = clamp(pixel + bloom, 0.0, 1.0);

	gl_FragColor = LinearTosRGB(vec4(col.rgb, 1.0));
}`
};



var shaderMaterial = new THREE.ShaderMaterial({
	vertexShader: THREE.SSAOShader.vertexShader,
	fragmentShader: THREE.SSAOShader.fragmentShader,
	uniforms: THREE.UniformsUtils.clone(THREE.SSAOShader.uniforms),
	defines: {
		//"FLOAT_DEPTH": true
	}
});




var oc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

var screen = new THREE.Mesh(new THREE.BufferGeometry(), shaderMaterial);
screen.geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3));
screen.geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));


var ssaoBuffer = new THREE.WebGLRenderTarget(1, 1, {
	depthBuffer: true
});
ssaoBuffer.texture.type = THREE.FloatType;
/*ssaoBuffer.texture.generateMipmaps = true;
ssaoBuffer.texture.minFilter = THREE.LinearMipmapLinearFilter;
ssaoBuffer.texture.magFilter = THREE.LinearFilter;*/

/*ssaoBuffer.depthTexture = new THREE.DepthTexture();
ssaoBuffer.depthTexture.format = THREE.DepthStencilFormat; //THREE.DepthFormat;
ssaoBuffer.depthTexture.type = THREE.UnsignedInt248Type; //THREE.UnsignedLongType;*/



//console.log(screen);


var scene = new THREE.Scene();






var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);

shaderMaterial.uniforms.albedo.value = ssaoBuffer.texture;

var renderer = new THREE.WebGLRenderer({
	antialias: false
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.info.autoReset = false;
document.body.appendChild(renderer.domElement);







// Sky
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
var my_gradient = ctx.createLinearGradient(0, 512, 0, 0);
c.width = 1024;
c.height = 512;
my_gradient.addColorStop(0.95, "#4c77a2");
my_gradient.addColorStop(0.54, "#add8ff");
my_gradient.addColorStop(0.5, "#ffffff");
my_gradient.addColorStop(0.48, "#bcc6cc");
ctx.fillStyle = my_gradient;
ctx.fillRect(0, 0, 1024, 512);

var cskytex = new THREE.CanvasTexture(c);
var skytex = new THREE.WebGLCubeRenderTarget(cskytex.image.height);
skytex.fromEquirectangularTexture(renderer, cskytex);

scene.background = skytex;
scene.environment = skytex.texture;








function ditherShaderPatch(shader) {
	/*shader.fragmentShader = shader.fragmentShader.replace("#include <fog_pars_fragment>", "varying float fogDepth;").replace("}", `
		if ((fogDepth - 0.5) + (sqrt(rand(gl_FragCoord.xy / 1920.0) * 0.5)) < 1.0) {
			discard;
		}
	}`);
	//console.log(shader.vertexShader);
	shader.vertexShader = shader.vertexShader.replace("#include <fog_vertex>", "fogDepth = -mvPosition.z;").replace("#include <fog_pars_vertex>", "varying float fogDepth;");*/
}








var cw = 1.5;
var ch = 2;

var fwr = 0.5;
var bwr = 0.5;


var Earth = new THREE.Mesh(new THREE.SphereGeometry(fwr, 64, 64), new THREE.MeshStandardMaterial({
	map: new THREE.TextureLoader().load("Images/Earth.png"),
	emissive: 0x00ffff,
	emissiveMap: new THREE.TextureLoader().load("Images/grid.png"),
	emissiveIntensity: 0,
	roughness: 0.5
}));
//Earth.material.map.encoding = THREE.sRGBEncoding;
Earth.material.onBeforeCompile = ditherShaderPatch;

Earth.castShadow = true;
Earth.receiveShadow = true;

Earth.position.y = 15.5;

Earth.userData.onground = false;
Earth.userData.vel = new THREE.Vector3();
Earth.userData.rotAxis = new THREE.Vector3(0, 1, 0);
Earth.userData.rotVel = 1;

Earth.userData.shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), new THREE.MeshBasicMaterial({
	color: 0x808080,
	map: new THREE.TextureLoader().load("Images/roundshadow.png"),
	transparent: true,
	side: THREE.DoubleSide,
	depthWrite: false,
	blending: THREE.SubtractiveBlending
}));
Earth.userData.shadow.material.map.encoding = THREE.sRGBEncoding;
Earth.userData.shadow.material.onBeforeCompile = function (shader) {
	console.log(shader.fragmentShader);
	shader.vertexShader = shader.vertexShader.replace("}", `
		gl_Position.z -= 0.01;
	}`);
	shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `
	#ifdef USE_MAP
		vec4 texelColor = texture2D( map, vUv );
		texelColor = vec4(1.0 - texelColor.rgb, texelColor.a);
		texelColor = mapTexelToLinear( texelColor );
		diffuseColor *= texelColor;
	#endif`);
}
scene.add(Earth.userData.shadow);
scene.add(Earth);


var geo = [];
var tmpobj = new THREE.Object3D();

var g;

new THREE.GLTFLoader().load("./Models/world.glb", function (obj) {
	//console.log(obj);
	var tmp = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(20, 5, 256, 32), new THREE.MeshBasicMaterial());
	tmp.geometry.translate(0, 60, 0);
	tmp.userData.data = "physics";
	obj.scene.add(tmp);
	var tmp = new THREE.Mesh(tmp.geometry, new THREE.MeshStandardMaterial({
		map: new THREE.TextureLoader().load("Images/uv_grid_opengl.jpg"),
		roughness: 0.5
	}));
	obj.scene.add(tmp);
	obj.scene.traverse(function (obj) {
		if (obj.material) {
			if (obj.material.name == "ocean") {
				obj.material.color = new THREE.Color("skyblue");
			}
			if (obj.userData.data === "physics") {
				obj.visible = false;
				var tmpg = obj.geometry.clone();
				obj.geometry.dispose();
				try {
				delete tmpg.attributes.uv;
				} catch (e) { }
				try {
				delete tmpg.attributes.uv2;
				} catch (e) { }
				try {
				delete tmpg.attributes.normal;
				} catch (e) { }
				obj.updateMatrixWorld();
				tmpg.applyMatrix4(obj.matrixWorld);
				geo.push(tmpg);
			} else {
				obj.material.side = THREE.FrontSide;
				//obj.material.wireframe = true;
				obj.material.roughness = 0.5;
				obj.material.onBeforeCompile = ditherShaderPatch;
			}
			if (obj.isSkinnedMesh || obj.isMesh) {
				obj.receiveShadow = true;
				obj.castShadow = true;
			}
		}
	});
	g = new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(geo), new THREE.MeshStandardMaterial({color: 0x808080}));
	g.geometry.computeBoundsTree();
	g.geometry.computeVertexNormals();
	var h = new MeshBVHLib.MeshBVHVisualizer(g, 1000000);
	h.displayParents = true;
	h.opacity = 1;
	h.edgeMaterial.linewidth = 1;
	h.update();
	//scene.add(h);
	//g.receiveShadow = true;
	//g.castShadow = true;
	//scene.add(g);
	scene.add(obj.scene);
	console.log(g);
});




var Earth2 = Earth.clone();
Earth2.position.set(1, 20, 0);
Earth2.userData.onground = false;
Earth2.userData.vel = new THREE.Vector3();
Earth2.userData.rotAxis = new THREE.Vector3(0, 1, 0);
Earth2.userData.rotVel = 1;
Earth2.userData.shadow = Earth.userData.shadow.clone();
scene.add(Earth2.userData.shadow);
scene.add(Earth2);

var Earth3 = Earth.clone();
Earth3.geometry = new THREE.SphereGeometry(bwr, 64, 64);
Earth3.position.set(2, 20, 1);
Earth3.userData.onground = false;
Earth3.userData.vel = new THREE.Vector3();
Earth3.userData.rotAxis = new THREE.Vector3(0, 1, 0);
Earth3.userData.rotVel = 1;
Earth3.userData.shadow = Earth.userData.shadow.clone();
scene.add(Earth3.userData.shadow);
scene.add(Earth3);


var Earth4 = Earth.clone();
Earth4.geometry = Earth3.geometry;
Earth4.position.set(2, 20, 1);
Earth4.userData.onground = false;
Earth4.userData.vel = new THREE.Vector3();
Earth4.userData.rotAxis = new THREE.Vector3(0, 1, 0);
Earth4.userData.rotVel = 1;
Earth4.userData.shadow = Earth.userData.shadow.clone();
scene.add(Earth4.userData.shadow);
scene.add(Earth4);



var body = new THREE.Mesh(new THREE.BoxBufferGeometry(cw, 0.5, ch), Earth.material);
body.castShadow = true;
body.receiveShadow = true;
scene.add(body);




scene.add(new THREE.HemisphereLight(0x333344, 0x444455, 1.25));

var s = new THREE.DirectionalLight(0xffffdd, 1.5);
s.castShadow = true;
s.shadow.mapSize.width = 2048;
s.shadow.mapSize.height = 2048;
var d = 50;
s.shadow.camera.left = -d;
s.shadow.camera.right = d;
s.shadow.camera.top = d;
s.shadow.camera.bottom = -d;
s.shadow.camera.near = 0;
s.shadow.camera.far = 100;
s.shadow.radius = 1;
s.target = body;
scene.add(s);

//scene.add(new THREE.CameraHelper(s.shadow.camera));

camera.position.z = -20;
camera.position.y = 10;

var vv = new THREE.Vector3();
var acv = vv.clone();

var cl = new THREE.Clock();

var speed = 0.025;

/*var pr = 1;

var lt = 0;*/

/*(function () {
	var t = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 2048, 2048), new THREE.MeshNormalMaterial());
	t.position.y = 15;
	scene.add(t);
})();*/

var tcp = new THREE.Vector3();

//Earth.matrixAutoUpdate = false;

var tt = {
	value: 0
};

var dir = new THREE.Vector2();

var anim = false;

var rfa;
var lfa;


function collideSphere(sphere, radius) {
	if (!g) {
		return;
	}
	var isa = g.geometry.boundsTree.closestPointToPoint(sphere.position);
	if (sphere.userData.shadow) {
		sphere.userData.shadow.position.copy(isa.point);
	}
	var is = MeshBVHLib.getTriangleHitPointInfo(isa.point, g.geometry, isa.faceIndex);

	isa.face = {normal: sphere.position.clone().sub(isa.point).normalize()};
	if (isa.face.normal.dot(is.face.normal) < 0) {
		isa.face.normal.negate();
	}

	if (sphere.userData.shadow) {
		sphere.userData.shadow.lookAt(sphere.userData.shadow.position.x + isa.face.normal.x, sphere.userData.shadow.position.y + isa.face.normal.y, sphere.userData.shadow.position.z + isa.face.normal.z);
		//sphere.userData.shadow.position.addScaledVector(isa.face.normal, 0.01);
	}

	sphere.userData.onground = false;
	if (isa.distance < radius) {
		sphere.position.addScaledVector(isa.face.normal, Math.max(radius - isa.distance, 0));
		if (sphere.userData.vel) {
			sphere.userData.vel.addScaledVector(isa.face.normal, -isa.face.normal.dot(sphere.userData.vel));
		}
		if (sphere.userData.rotAxis) {
			sphere.userData.rotAxis.copy(isa.face.normal).cross(sphere.userData.vel).normalize();
		}
		if (sphere.userData.rotVel) {
			sphere.userData.rotVel = sphere.userData.vel.length() / (radius * tau) * tau;
		}
		/*if (sphere.userData.vel) {
			sphere.userData.vel.multiplyScalar(0.9);
		}*/
		sphere.userData.onground = true;
	}
	return isa;
}

function constrainSpheres(sphere1, sphere2, currentDistance, targetDistance, direction) {
	sphere1.position.addScaledVector(direction, (currentDistance - targetDistance) * 0.5);
	sphere1.userData.vel.addScaledVector(direction, -direction.dot(sphere1.userData.vel.clone().sub(sphere2.userData.vel)) * 0.5);

	sphere2.position.addScaledVector(direction, (currentDistance - targetDistance) * -0.5);
	sphere2.userData.vel.addScaledVector(direction, -direction.dot(sphere2.userData.vel.clone().sub(sphere1.userData.vel)) * 0.5);
}



var cpos = new THREE.Vector3();
var cnorm = new THREE.Vector3();

var animate = function () {
	requestAnimationFrame(animate);

	if (windowResized == true) {
		onWindowResize();
		windowResized = false;
	}

	/*var pn = performance.now();
	if (pn - lt > (1000/57)) {
		pr /= 1.1;
	} else if (pn - lt < (1000/57)) {
		pr *= 1.1;
	}
	lt = pn;
	pr = THREE.MathUtils.clamp(pr, 0.01, 1);

	ssaoBuffer.setSize(window.innerWidth * pr, window.innerHeight * pr);
	shaderMaterial.uniforms.size.value.set(window.innerWidth * pr, window.innerHeight * pr);
	renderer.setPixelRatio(pr);*/

	var delta = 1 / 60; //cl.getDelta();

	if (orbitUp === true) {
		camera.translateY(camdistance / 50);
	}
	if (orbitDown === true) {
		camera.translateY(-camdistance / 50);
	}
	if (orbitRight === true) {
		camera.translateX(camdistance / 50);
	}
	if (orbitLeft === true) {
		camera.translateX(-camdistance / 50);
	}


	acv.setScalar(0);
	if (moveUp === true) {
		camera.getWorldDirection(vv);
		vv.y = 0;
		acv.add(vv);
	}
	if (moveDown === true) {
		camera.getWorldDirection(vv);
		vv.set(-vv.x, 0, -vv.z);
		acv.add(vv);
	}
	if (moveRight === true) {
		camera.getWorldDirection(vv);
		vv.set(-vv.z, 0, vv.x);
		acv.add(vv);
	}
	if (moveleft === true) {
		camera.getWorldDirection(vv);
		vv.set(vv.z, 0, -vv.x);
		acv.add(vv);
	}
	if (moveUp === true || moveDown === true || moveleft === true || moveRight === true) {
		acv.setLength(speed);
		if (carmode) {
			Earth.userData.vel.addScaledVector(acv, 2/4);
			Earth2.userData.vel.addScaledVector(acv, 2/4);
		} else {
			Earth.userData.vel.addScaledVector(acv, 1/4);
			Earth2.userData.vel.addScaledVector(acv, 1/4);
			Earth3.userData.vel.addScaledVector(acv, 1/4);
			Earth4.userData.vel.addScaledVector(acv, 1/4);
		}
		/*if (anim == false) {
			rfa = new TWEEN.Tween(Earth.getObjectByName("L_FootJ").position).to({
				z: 0,
				y: [-0.2, -0.4]
			}, 100).easing(TWEEN.Easing.Cubic.Out).chain(new TWEEN.Tween(Earth.getObjectByName("L_FootJ").position).to({
				z: -0.3,
				y: [-0.4, -0.2]
			}, 100).easing(TWEEN.Easing.Cubic.Out).onComplete(function () {
				rfa.start();
			})).start();

			lfa = new TWEEN.Tween(Earth.getObjectByName("R_FootJ").position).to({
				z: -0.3,
				y: [-0.4, -0.2]
			}, 100).easing(TWEEN.Easing.Cubic.Out).chain(new TWEEN.Tween(Earth.getObjectByName("R_FootJ").position).to({
				z: 0,
				y: [-0.2, -0.4]
			}, 100).easing(TWEEN.Easing.Cubic.Out).onComplete(function () {
				lfa.start();
			})).start();

			anim = true;
		}*/
	}/* else {
		if (rfa) {
			rfa.stop();
			rfa.to({
				z: -0.1,
				y: -0.4
			}, 100).start();
		}
		if (lfa) {
			lfa.stop();
			lfa.to({
				z: -0.1,
				y: -0.4
			}, 100).start();
		}
		anim = false;
	}*/




	Earth.position.add(Earth.userData.vel);
	Earth2.position.add(Earth2.userData.vel);
	Earth3.position.add(Earth3.userData.vel);
	Earth4.position.add(Earth4.userData.vel);


	var friction = 0.5;

	var uorder = [0, 1, 2, 3, 4, 5];
	var order = uorder
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
	for (var i = 0; i < 6; i++) {
	if (order[i] == 0) {
	var d1t = Earth2.position.clone().sub(Earth.position).normalize();
	var d1 = Earth.position.distanceTo(Earth2.position);

	if (carmode) {
	Earth.position.addScaledVector(d1t, (d1 - cw) * 0.5);
	if (Earth.userData.onground == true) {
		Earth.userData.vel.addScaledVector(d1t, -d1t.dot(Earth.userData.vel) * friction);
	} else {
		Earth.userData.vel.addScaledVector(d1t, -d1t.dot(Earth.userData.vel.clone().sub(Earth2.userData.vel)) * 0.5);
	}

	Earth2.position.addScaledVector(d1t, (d1 - cw) * -0.5);
	if (Earth2.userData.onground == true) {
		Earth2.userData.vel.addScaledVector(d1t, -d1t.dot(Earth2.userData.vel) * friction);
	} else {
		Earth2.userData.vel.addScaledVector(d1t, -d1t.dot(Earth2.userData.vel.clone().sub(Earth.userData.vel)) * 0.5);
	}
	} else {
		constrainSpheres(Earth, Earth2, d1, cw, d1t);
	}
	}


	if (order[i] == 1) {
	var d1t = Earth3.position.clone().sub(Earth2.position).normalize();
	var d1 = Earth2.position.distanceTo(Earth3.position);

	constrainSpheres(Earth2, Earth3, d1, ch, d1t);
	}


	if (order[i] == 2) {
	var d1t = Earth4.position.clone().sub(Earth3.position).normalize();
	var d1 = Earth3.position.distanceTo(Earth4.position);

	if (carmode) {
	Earth3.position.addScaledVector(d1t, (d1 - cw) * 0.5);
	if (Earth3.userData.onground == true) {
		Earth3.userData.vel.addScaledVector(d1t, -d1t.dot(Earth3.userData.vel) * friction);
	} else {
		Earth3.userData.vel.addScaledVector(d1t, -d1t.dot(Earth3.userData.vel.clone().sub(Earth4.userData.vel)) * 0.5);
	}

	Earth4.position.addScaledVector(d1t, (d1 - cw) * -0.5);
	if (Earth4.userData.onground == true) {
		Earth4.userData.vel.addScaledVector(d1t, -d1t.dot(Earth4.userData.vel) * friction);
	} else {
		Earth4.userData.vel.addScaledVector(d1t, -d1t.dot(Earth4.userData.vel.clone().sub(Earth3.userData.vel)) * 0.5);
	}
	} else {
		constrainSpheres(Earth3, Earth4, d1, cw, d1t);
	}
	}



	if (order[i] == 3) {
	var d1t = Earth4.position.clone().sub(Earth.position).normalize();
	var d1 = Earth.position.distanceTo(Earth4.position);

	constrainSpheres(Earth, Earth4, d1, ch, d1t);
	}

	var diag = Math.sqrt(Math.pow(cw, 2) + Math.pow(ch, 2));

	if (order[i] == 4) {
	var d1t = Earth4.position.clone().sub(Earth2.position).normalize();
	var d1 = Earth2.position.distanceTo(Earth4.position);

	constrainSpheres(Earth2, Earth4, d1, diag, d1t);
	}

	if (order[i] == 5) {
	var d1t = Earth3.position.clone().sub(Earth.position).normalize();
	var d1 = Earth.position.distanceTo(Earth3.position);

	constrainSpheres(Earth, Earth3, d1, diag, d1t);
	}
	}



	var is = collideSphere(Earth, fwr);
	var is2 = collideSphere(Earth2, fwr);
	var is3 = collideSphere(Earth3, bwr);
	var is4 = collideSphere(Earth4, bwr);



	

	if (antigrav) {
		Earth.userData.vel.addScaledVector(is.face.normal, -delta / 4);
		Earth2.userData.vel.addScaledVector(is2.face.normal, -delta / 4);
		Earth3.userData.vel.addScaledVector(is3.face.normal, -delta / 4);
		Earth4.userData.vel.addScaledVector(is4.face.normal, -delta / 4);
	} else {
		Earth.userData.vel.y -= delta / 4;
		Earth2.userData.vel.y -= delta / 4;
		Earth3.userData.vel.y -= delta / 4;
		Earth4.userData.vel.y -= delta / 4;
	}

	/*Earth.userData.vel.x = THREE.MathUtils.damp(Earth.userData.vel.x, 0, 10, delta);
	Earth.userData.vel.z = THREE.MathUtils.damp(Earth.userData.vel.z, 0, 10, delta);*/



	/*cpos.copy(Earth.position).add(Earth2.position).add(Earth3.position).multiplyScalar(1/3);
	cnorm.copy(is.face.normal).add(is2.face.normal).add(is3.face.normal).multiplyScalar(1/3).normalize();*/


	cpos.copy(Earth.position).add(Earth2.position).add(Earth3.position).add(Earth4.position).multiplyScalar(1/4);

	if (antigrav) {
		cnorm.copy(is.face.normal).add(is2.face.normal).add(is3.face.normal).add(is4.face.normal).multiplyScalar(1/4).normalize();
		camera.up.lerp(cnorm, 1/10);
		Earth.material.emissiveIntensity = THREE.MathUtils.lerp(Earth.material.emissiveIntensity, 2, 1/5);
	} else {
		camera.up.lerp(Earth.up, 1/10);
		Earth.material.emissiveIntensity = THREE.MathUtils.lerp(Earth.material.emissiveIntensity, 0, 1/5);
	}


	Earth.rotateOnWorldAxis(Earth.userData.rotAxis, Earth.userData.rotVel);
	Earth2.rotateOnWorldAxis(Earth2.userData.rotAxis, Earth2.userData.rotVel);
	Earth3.rotateOnWorldAxis(Earth3.userData.rotAxis, Earth3.userData.rotVel);
	Earth4.rotateOnWorldAxis(Earth4.userData.rotAxis, Earth4.userData.rotVel);


	if (jump == true) {
		//if (Earth.userData.onground == true) {
			Earth.userData.vel.y += 0.2 / 4;
			Earth2.userData.vel.y += 0.2 / 4;
			Earth3.userData.vel.y += 0.2 / 4;
			Earth4.userData.vel.y += 0.2 / 4;
			//Earth.userData.vel.addScaledVector(is.face.normal, 0.4);
		//}
	}

	if (Earth.position.y < 0) {
		tcp.copy(camera.position);
		Earth.worldToLocal(tcp);
		Earth.position.set(Math.random() - 0.5, 15.5 + Math.random(), Math.random() - 0.5);
		Earth2.position.set(Math.random() - 0.5, 15.5 + Math.random(), Math.random() - 0.5);
		Earth3.position.set(Math.random() - 0.5, 15.5 + Math.random(), Math.random() - 0.5);
		Earth4.position.set(Math.random() - 0.5, 15.5 + Math.random(), Math.random() - 0.5);
		Earth.updateMatrixWorld();
		Earth.localToWorld(tcp);
		camera.position.copy(tcp);
		Earth.userData.vel.y = 0;
		Earth2.userData.vel.y = 0;
		Earth3.userData.vel.y = 0;
		Earth4.userData.vel.y = 0;
	}



	var anorm = Earth3.position.clone().sub(Earth2.position).normalize();
	var anorm2 = Earth4.position.clone().sub(Earth.position).normalize();

	anorm.add(anorm2).multiplyScalar(1/2);
	body.lookAt(body.position.x + anorm.x, body.position.y + anorm.y, body.position.z + anorm.z);

	var anorm3 = Earth2.position.clone().sub(Earth.position).cross(Earth3.position.clone().sub(Earth.position)).normalize();
	var anorm4 = Earth3.position.clone().sub(Earth2.position).cross(Earth4.position.clone().sub(Earth2.position)).normalize();

	anorm3.add(anorm4).multiplyScalar(1/2);
	body.up.copy(anorm3);




	
	if (antigrav) {
		Earth.userData.shadow.material.blending = THREE.AdditiveBlending;
		Earth.userData.shadow.material.color.set(0x008080);
		camera.lookAt(cpos);
		//camera.lookAt(cpos.clone().addScaledVector(is.face.normal, 1));
	} else {
		Earth.userData.shadow.material.blending = THREE.SubtractiveBlending;
		Earth.userData.shadow.material.color.set(0x808080);
		camera.lookAt(cpos.x, cpos.y + 1, cpos.z);
	}
	camera.translateZ(-(camera.position.distanceTo(cpos) - camdistance) / 5);
	if (antigrav) {
		//camera.lookAt(cpos.clone().addScaledVector(is.face.normal, 0.5));
	} else {
		camera.lookAt(cpos.x, cpos.y + 0.5, cpos.z);
	}


	if (antigrav) {
		collideSphere(camera, 1);
	}

	body.position.copy(cpos);
	s.position.copy(cpos);
	s.position.addScalar(20);
	s.position.y += 40;

	//renderer.setRenderTarget(ssaoBuffer);
	renderer.render(scene, camera);
	//renderer.setRenderTarget(null);
	//renderer.render(screen, oc);
	stats.update();
	DCPanel.update(renderer.info.render.calls, 1000);
	renderer.info.reset();
	//TWEEN.update();
};

animate();
