
			var container;
			var camera, scene, controls, renderer, printHead, model, printedModel, printer, MAXPOINTS;

			var mask = new THREE.TextureLoader().load("Images/mask.png");
			var texture = new THREE.TextureLoader().load("Images/abs.png");
			var printermat = new THREE.MeshMatcapMaterial({
				matcap: new THREE.TextureLoader().load("Images/printer.png")
			});
			var platemat = new THREE.MeshMatcapMaterial({
				matcap: new THREE.TextureLoader().load("Images/abs.png"),
				map: new THREE.TextureLoader().load("Images/ender-3.jpg")
			});
			/*platemat.onBeforeCompile = function (shader) {
				shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `
					#ifdef USE_MAP
						vec4 texelColor = texture2D( map, vUv );
						texelColor = mapTexelToLinear( texelColor );
						if (texelColor.r > 0.5) {
							diffuseColor *= vec4(1.0);
						} else {
							diffuseColor *= vec4(0.0, 0.0, 0.0, 1.0);
						}
					#endif
				`);
				console.log(shader.fragmentShader);
			};*/
			var nozzlemat = new THREE.MeshMatcapMaterial({
				matcap: new THREE.TextureLoader().load("Images/metal.png")
			});

			var filename = "benchy.gcode";

			var index = 3;

			var printing = false;

			var headDown = false;

			var precision = 0.75;
			var speed = 0.2;

			var timescale = Math.pow(1, 2) / speed;

			var dist = 0;

			var particlesPlaced = 1;

			var particleIndex = 0;

			var dimensions = new THREE.Vector3(220, 250, 220);

			printHead = new THREE.Group();
			printHead.position.set(0, dimensions.y / 2, 0);

			var phHeight = 8;

			printHead.add(new THREE.Mesh(new THREE.CylinderBufferGeometry(5, precision / 4,  phHeight / 2, 6), nozzlemat));
			printHead.children[0].position.y = (phHeight / 4) + (precision / 8);

			printHead.add(new THREE.Mesh(new THREE.CylinderBufferGeometry(5, 5,  phHeight / 2, 6), nozzlemat));
			printHead.children[1].position.y = (phHeight * 6/8) + (precision / 8);

			printHead.add(new THREE.Mesh(new THREE.BoxBufferGeometry(42, 42, 42), printermat));
			printHead.children[2].position.y = (42 / 2) + phHeight;
			printHead.children[2].position.z = (42 / 2) - 10;


			printer = new THREE.Group();
			//printer.position.y = -20;

			// plate
			printer.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(dimensions.x, dimensions.z), platemat));
			printer.children[0].rotation.x = -Math.PI/2;

			// left support
			printer.add(new THREE.Mesh(new THREE.BoxBufferGeometry(40, dimensions.y + 20,  20), printermat));
			printer.children[1].position.set(-(dimensions.x + 40) / 2, (dimensions.y / 2) - 10, -40);

			printer.children[1].add(new THREE.Mesh(new THREE.BoxBufferGeometry(40, 40,  dimensions.z), printermat));
			printer.children[1].children[0].position.y = (-dimensions.y / 2) - 30;

			// right support
			printer.add(new THREE.Mesh(new THREE.BoxBufferGeometry(40, dimensions.y + 20,  20), printermat));
			printer.children[2].position.set((dimensions.x + 40) / 2, (dimensions.y / 2) - 10, -40);

			printer.children[2].add(new THREE.Mesh(new THREE.BoxBufferGeometry(40, 40,  dimensions.z), printermat));
			printer.children[2].children[0].position.y = (-dimensions.y / 2) - 30;

			// arch
			printer.add(new THREE.Mesh(new THREE.BoxBufferGeometry(dimensions.x + 80, 20,  20), printermat));
			printer.children[3].position.set(0, dimensions.y + 10, -40);

			// bridge
			printer.add(new THREE.Mesh(new THREE.BoxBufferGeometry(dimensions.x + 100, 20,  20), printermat));
			printer.children[4].position.set(0, dimensions.y / 2 + phHeight + 40 - (20 / 2), -20);

			// bounds
			printer.add(new THREE.Box3Helper( new THREE.Box3().setFromCenterAndSize( new THREE.Vector3( 0, dimensions.y/2, 0 ), dimensions ), 0x0000ff ));

			// grid
			printer.add(new THREE.GridHelper(dimensions.x, dimensions.x / 10, 0x0000ff));
			printer.children[6].position.y = 0.01;

			init();

			scene.add(printer);
			scene.add(printHead);

			var ppos = printHead.position.clone();

			render();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.set( 50, 50, 200 );

				scene = new THREE.Scene();

				scene.background = new THREE.Color(0xe5e5ef);

				
				MAXPOINTS = 1000000;
				printedModel = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({map: texture, size: precision, alphaMap: mask, transparent: true, alphaTest: 1}));
				printedModel.material.alphaMap.minFilter = THREE.NearestFilter;
				printedModel.material.map.minFilter = THREE.NearestFilter;

				printedModel.geometry.setAttribute('position', new THREE.BufferAttribute( new Float32Array(MAXPOINTS * 3), 3));
				printedModel.frustumCulled = false;
				scene.add(printedModel);
				printedModel.geometry.setDrawRange(0, 0);

				var loader = new THREE.GCodeLoader();
				loader.load( 'Models/' + filename, function ( object ) {
					document.getElementById("filament").innerHTML = "Filament:" + Math.round(Math.max((MAXPOINTS * speed) / 10, 0)) + " cm";

					object.position.set(-dimensions.x / 2, 0, dimensions.x / 2);
					scene.add( object );
					object.updateMatrixWorld();
					object.visible = false;
					console.log(object);

					model = object;


					/*printHead.position.set(model.children[0].geometry.attributes.position.array[0], model.children[0].geometry.attributes.position.array[1], model.children[0].geometry.attributes.position.array[2]);
					printHead.position.applyMatrix4(model.children[0].matrixWorld);

					printer.children[1].position.z = printHead.position.z;
					printer.children[2].position.z = printHead.position.z;
					printer.children[3].position.z = printHead.position.z;

					printer.children[4].position.z = printHead.position.z;
					printer.children[4].position.y = printHead.position.y + 33.25;*/
					//render();
					//printing = true;
					document.getElementById("filename").innerHTML = filename;

				} );

				renderer = new THREE.WebGLRenderer({antialias: false});
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				controls = new THREE.OrbitControls( camera, renderer.domElement );
				//controls.addEventListener( 'change', render ); // use if there is no animation loop
				controls.minDistance = 10;
				controls.maxDistance = 500;
				controls.screenSpacePanning = false;

				window.addEventListener( 'resize', resize, false );

			}

			function resize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				//render();

			}


			function render() {

				for (var i = 0; i < timescale; i++) {
				if (printing == true) {
					var targetpos = new THREE.Vector3(model.children[0].geometry.attributes.position.array[index + 0], model.children[0].geometry.attributes.position.array[index + 1], model.children[0].geometry.attributes.position.array[index + 2]);
					targetpos.applyMatrix4( model.children[0].matrixWorld );



					printHead.position.lerpVectors(ppos, targetpos, dist);

					printer.children[1].position.z = printHead.position.z - 40;
					printer.children[2].position.z = printHead.position.z - 40;
					printer.children[3].position.z = printHead.position.z - 40;

					printer.children[4].position.z = printHead.position.z - 20;
					printer.children[4].position.y = printHead.position.y + phHeight + 40 - (20 / 2);

					dist += speed / ppos.distanceTo(targetpos);
					
					if (dist > 1) {
						index += 3;
						if (index != 6) {
							headDown = !headDown;
						}
						document.getElementById("instruction").innerHTML = "CMD:" + ((index / 3) - 1) + " / " + (model.children[0].geometry.attributes.position.array.length / 3);
						document.getElementById("instructionT").innerHTML = "X:" + Math.round(targetpos.x + (dimensions.x / 2)) + " Y:" + Math.round(targetpos.y) + " Z:" + Math.round((dimensions.z / 2) - targetpos.z) + " E:" + String(headDown).replace("true", "1").replace("false", "0");
						document.getElementById("prgrsT").innerHTML = Math.round((index / model.children[0].geometry.attributes.position.array.length) * 100) + "%";
						document.getElementById("prgrsfill").style.width = ((index / model.children[0].geometry.attributes.position.array.length) * 100) + "%";
						document.getElementById("status").innerHTML = "Printing...";
						dist = 0;
						if (index > model.children[0].geometry.attributes.position.array.length) {
							printing = false;
							document.getElementById("prnt").click();
							document.getElementById("status").innerHTML = "Done";
						}
						ppos = new THREE.Vector3(model.children[0].geometry.attributes.position.array[index - 3], model.children[0].geometry.attributes.position.array[index - 2], model.children[0].geometry.attributes.position.array[index - 1]);
					ppos.applyMatrix4( model.children[0].matrixWorld );
					}

					if (headDown == true) {
						printedModel.geometry.attributes.position.array[particleIndex++] = printHead.position.x;
						printedModel.geometry.attributes.position.array[particleIndex++] = printHead.position.y;
						printedModel.geometry.attributes.position.array[particleIndex++] = printHead.position.z;
						printedModel.geometry.attributes.position.needsUpdate = true;
						printedModel.geometry.setDrawRange(0, particlesPlaced++);
						document.getElementById("filament").innerHTML = "Filament:" + Math.round(Math.max(((MAXPOINTS - particlesPlaced) * speed) / 10, 0)) + " cm";
						if (particlesPlaced > MAXPOINTS) {
							printing = false;
							document.getElementById("prnt").click();
							document.getElementById("status").innerHTML = "ERROR: No Filament!";
						}
					}
					
					//camera.lookAt(printHead.position);
				} else {
					if (dist < 1) {
					var targetpos = new THREE.Vector3(0, dimensions.y * 3 / 4, -dimensions.z/2);

					printHead.position.lerpVectors(ppos, targetpos, dist);

					printer.children[1].position.z = printHead.position.z - 40;
					printer.children[2].position.z = printHead.position.z - 40;
					printer.children[3].position.z = printHead.position.z - 40;

					printer.children[4].position.z = printHead.position.z - 20;
					printer.children[4].position.y = printHead.position.y + phHeight + 40 - (20 / 2);

					dist += speed / ppos.distanceTo(targetpos);
					}
				}
				}
				requestAnimationFrame(render);
				renderer.render( scene, camera );

			}

