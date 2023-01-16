var sv = 512;
var ns = sv + "x" + sv + " (" + (sv * sv) + " items) matrix multiplication<br/><br/>Computing...";
document.getElementById("output").innerHTML = ns;

requestAnimationFrame(async () => {

	ns = sv + "x" + sv + " (" + (sv * sv) + " items) matrix multiplication<br/><br/>"

	var sv1 = [sv, sv];
	for (var x = 0; x < sv * sv; x++) {
		sv1.push(Math.random() * 100);
	}

	const firstMatrix = new Float32Array(sv1);

	var sv2 = [sv, sv];
	for (var x = 0; x < sv * sv; x++) {
		sv2.push(Math.random() * 100);
	}

	const secondMatrix = new Float32Array(sv2);

	try {

		if (!("gpu" in navigator)) {
			if ("gpu" in window) {
				navigator.gpu = window.gpu;
			} else {
				console.log("WebGPU is not supported.");
			}
		}

		const adapter = await navigator.gpu.requestAdapter({
			powerPreference: "high-performance"
		});
		if (!adapter) {
			console.log("Failed to get GPU adapter.");
			return;
		}
		var amdi = "GPU discrete: ";
		try {
			adapter.requestAdapterInfo().then(function (info) {
				console.log(info);
				amdi = "GPU " + info.vendor + " " + info.architecture + ": ";
			});
		} catch (e) {}
		const device = await adapter.requestDevice();

		const adapter2 = await navigator.gpu.requestAdapter({
			powerPreference: "low-power"
		});
		if (!adapter2) {
			console.log("Failed to get GPU adapter2.");
			return;
		}
		var inteli = "GPU integrated: ";
		try {
			adapter2.requestAdapterInfo().then(function (info) {
				console.log(info);
				inteli = "GPU " + info.vendor + " " + info.architecture + ": ";
			});
		} catch (e) {}
		const device2 = await adapter2.requestDevice();

		// First Matrix

		const gpuBufferFirstMatrix = device.createBuffer({
			mappedAtCreation: true,
			size: firstMatrix.byteLength,
			usage: GPUBufferUsage.STORAGE
		});
		const arrayBufferFirstMatrix = gpuBufferFirstMatrix.getMappedRange();

		new Float32Array(arrayBufferFirstMatrix).set(firstMatrix);
		gpuBufferFirstMatrix.unmap();



		const gpuBufferFirstMatrix2 = device2.createBuffer({
			mappedAtCreation: true,
			size: firstMatrix.byteLength,
			usage: GPUBufferUsage.STORAGE
		});
		const arrayBufferFirstMatrix2 = gpuBufferFirstMatrix2.getMappedRange();

		new Float32Array(arrayBufferFirstMatrix2).set(firstMatrix);
		gpuBufferFirstMatrix2.unmap();


		// Second Matrix

		const gpuBufferSecondMatrix = device.createBuffer({
			mappedAtCreation: true,
			size: secondMatrix.byteLength,
			usage: GPUBufferUsage.STORAGE
		});
		const arrayBufferSecondMatrix = gpuBufferSecondMatrix.getMappedRange();
		new Float32Array(arrayBufferSecondMatrix).set(secondMatrix);
		gpuBufferSecondMatrix.unmap();


		const gpuBufferSecondMatrix2 = device2.createBuffer({
			mappedAtCreation: true,
			size: secondMatrix.byteLength,
			usage: GPUBufferUsage.STORAGE
		});
		const arrayBufferSecondMatrix2 = gpuBufferSecondMatrix2.getMappedRange();
		new Float32Array(arrayBufferSecondMatrix2).set(secondMatrix);
		gpuBufferSecondMatrix2.unmap();


		// Result Matrix

		const resultMatrixBufferSize = Float32Array.BYTES_PER_ELEMENT * (2 + firstMatrix[0] * secondMatrix[1]);
		const resultMatrixBuffer = device.createBuffer({
			size: resultMatrixBufferSize,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
		});

		const resultMatrixBuffer2 = device2.createBuffer({
			size: resultMatrixBufferSize,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
		});


		// Compute shader code

		var sc = `
      struct Matrix {
        size : vec2<f32>,
        numbers: array<f32>,
      }

      @group(0) @binding(0) var<storage, read> firstMatrix : Matrix;
      @group(0) @binding(1) var<storage, read> secondMatrix : Matrix;
      @group(0) @binding(2) var<storage, read_write> resultMatrix : Matrix;

      @compute @workgroup_size(8, 8)
      fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        // Guard against out-of-bounds work group sizes
        if (global_id.x >= u32(firstMatrix.size.x) || global_id.y >= u32(secondMatrix.size.y)) {
          return;
        }

        resultMatrix.size = vec2(firstMatrix.size.x, secondMatrix.size.y);

        let resultCell = vec2(global_id.x, global_id.y);
        var result = 0.0;
        for (var i = 0u; i < u32(firstMatrix.size.y); i = i + 1u) {
          let a = i + resultCell.x * u32(firstMatrix.size.y);
          let b = resultCell.y + i * u32(secondMatrix.size.y);
          result = result + firstMatrix.numbers[a] * secondMatrix.numbers[b];
        }

        let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
        resultMatrix.numbers[index] = result;
      }
    `;

		try {
		var shaderModule = device.createShaderModule({
			code: sc
		});
		var error = await shaderModule.compilationInfo();
		if (error.messages.length > 0) {
			throw "Compilation error.";
		}



		var shaderModule2 = device2.createShaderModule({
			code: sc
		});
		var error2 = await shaderModule2.compilationInfo();
		if (error2.messages.length > 0) {
			throw "Compilation error.";
		}
		} catch (e) {
		console.log("Compilation error detected! Attempting @compute to @stage(compute) legacy patch.");
		sc = sc.replace("@compute", "@stage(compute)");

		var shaderModule = device.createShaderModule({
			code: sc
		});




		var shaderModule2 = device2.createShaderModule({
			code: sc
		});
		}

		// Pipeline setup

		try {
		var computePipeline = device.createComputePipeline({
			layout: "auto",
			compute: {
				module: shaderModule,
				entryPoint: "main"
			}
		});


		var computePipeline2 = device2.createComputePipeline({
			layout: "auto",
			compute: {
				module: shaderModule2,
				entryPoint: "main"
			}
		});

		} catch (e) {

		const bindGroupLayout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {
						type: "read-only-storage"
					}
				},
				{
					binding: 1,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {
						type: "read-only-storage"
					}
				},
				{
					binding: 2,
					visibility: GPUShaderStage.COMPUTE,
						buffer: {
						type: "storage"
					}
				}
			]
		});

		const bindGroupLayout2 = device2.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {
						type: "read-only-storage"
					}
				},
				{
					binding: 1,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {
						type: "read-only-storage"
					}
				},
				{
					binding: 2,
					visibility: GPUShaderStage.COMPUTE,
						buffer: {
						type: "storage"
					}
				}
			]
		});

		var computePipeline = device.createComputePipeline({
			layout: device.createPipelineLayout({
				bindGroupLayouts: [bindGroupLayout]
			}),
			compute: {
				module: shaderModule,
				entryPoint: "main"
			}
		});


		var computePipeline2 = device2.createComputePipeline({
			layout: device2.createPipelineLayout({
				bindGroupLayouts: [bindGroupLayout2]
			}),
			compute: {
				module: shaderModule2,
				entryPoint: "main"
			}
		});

		}

		


		// Bind group

		const bindGroup = device.createBindGroup({
			layout: computePipeline.getBindGroupLayout(0 /* index */ ),
			entries: [{
					binding: 0,
					resource: {
						buffer: gpuBufferFirstMatrix
					}
				},
				{
					binding: 1,
					resource: {
						buffer: gpuBufferSecondMatrix
					}
				},
				{
					binding: 2,
					resource: {
						buffer: resultMatrixBuffer
					}
				}
			]
		});



		const bindGroup2 = device2.createBindGroup({
			layout: computePipeline2.getBindGroupLayout(0 /* index */ ),
			entries: [{
					binding: 0,
					resource: {
						buffer: gpuBufferFirstMatrix2
					}
				},
				{
					binding: 1,
					resource: {
						buffer: gpuBufferSecondMatrix2
					}
				},
				{
					binding: 2,
					resource: {
						buffer: resultMatrixBuffer2
					}
				}
			]
		});


		// Commands submission

		const commandEncoder = device.createCommandEncoder();

		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(computePipeline);
		passEncoder.setBindGroup(0, bindGroup);
		const workgroupCountX = Math.ceil(firstMatrix[0] / 8);
		const workgroupCountY = Math.ceil(secondMatrix[1] / 8);
		try {
			passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
		} catch (e) {
			passEncoder.dispatch(workgroupCountX, workgroupCountY);
		}
		passEncoder.end();


		const commandEncoder2 = device2.createCommandEncoder();

		const passEncoder2 = commandEncoder2.beginComputePass();
		passEncoder2.setPipeline(computePipeline2);
		passEncoder2.setBindGroup(0, bindGroup2);
		try {
			passEncoder2.dispatchWorkgroups(workgroupCountX, workgroupCountY);
		} catch (e) {
			passEncoder2.dispatch(workgroupCountX, workgroupCountY);
		}
		passEncoder2.end();

		// Get a GPU buffer for reading in an unmapped state.
		const gpuReadBuffer = device.createBuffer({
			size: resultMatrixBufferSize,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
		});


		const gpuReadBuffer2 = device2.createBuffer({
			size: resultMatrixBufferSize,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
		});

		// Encode commands for copying buffer to buffer.
		commandEncoder.copyBufferToBuffer(
			resultMatrixBuffer /* source buffer */ ,
			0 /* source offset */ ,
			gpuReadBuffer /* destination buffer */ ,
			0 /* destination offset */ ,
			resultMatrixBufferSize /* size */
		);


		commandEncoder2.copyBufferToBuffer(
			resultMatrixBuffer2 /* source buffer */ ,
			0 /* source offset */ ,
			gpuReadBuffer2 /* destination buffer */ ,
			0 /* destination offset */ ,
			resultMatrixBufferSize /* size */
		);


		// Submit GPU commands.
		var amdp = performance.now();
		console.profile("AMD");
		const gpuCommands = commandEncoder.finish();
		device.queue.submit([gpuCommands]);

		// Read buffer.
		await gpuReadBuffer.mapAsync(GPUMapMode.READ);
		const arrayBuffer = gpuReadBuffer.getMappedRange();
		ns += amdi + (performance.now() - amdp) + "ms<br/>";
		var amdr = new Float32Array(arrayBuffer);
		ns += "[" + amdr.join(", ") + "]" + "<br/>";
		console.profileEnd("AMD");


		var intelp = performance.now();
		console.profile("INTEL");
		const gpuCommands2 = commandEncoder2.finish();
		device2.queue.submit([gpuCommands2]);

		await gpuReadBuffer2.mapAsync(GPUMapMode.READ);
		const arrayBuffer2 = gpuReadBuffer2.getMappedRange();
		ns += inteli + (performance.now() - intelp) + "ms<br/>";
		var intelr = new Float32Array(arrayBuffer2);
		ns += "[" + intelr.join(", ") + "]" + "<br/>";
		console.profileEnd("INTEL");

	} catch (e) {
		console.warn(e);
	}

	ns += "CPU (1 core): "

	var res = new Array(firstMatrix.length);
	res[0] = firstMatrix[0];
	res[1] = firstMatrix[1];
	var cpup = performance.now();
	console.profile("CPU");
	for (var x = 0; x < firstMatrix[0]; x++) {
		for (var y = 0; y < secondMatrix[1]; y++) {
			var resultMatrixSize = [firstMatrix[0], secondMatrix[1]];

			var resultCell = [x, y];
			var result = 0;
			for (var i = 0; i < firstMatrix[1]; i++) {
				var a = i + resultCell[0] * firstMatrix[1];
				var b = resultCell[1] + i * secondMatrix[1];
				result = result + firstMatrix[a + 2] * secondMatrix[b + 2];
			}

			var index = resultCell[1] + resultCell[0] * secondMatrix[1];
			res[index + 2] = result;
		}
	}
	res = new Float32Array(res);
	ns += (performance.now() - cpup) + "ms<br/>";
	ns += "[" + res.join(", ") + "]";
	console.profileEnd("CPU");

	ns += "<br/><br/><br/>Accuracy:<br/><br/>";
	var amdep = 0;
	var intelep = 0;
	for (var i = 0; i < res.length; i++) {
		var oa = amdr[i];
		amdr[i] = Math.abs(res[i] - amdr[i]);
		amdep += amdr[i] / (res[i] + oa);
		var oi = intelr[i];
		intelr[i] = Math.abs(res[i] - intelr[i]);
		intelep += intelr[i] / (res[i] + oi);
	}
	ns += amdi + ((1 - (amdep / res.length)) * 100) + "%<br/>";
	ns += "Error per element: [" + amdr.join(", ") + "]<br/>";
	ns += inteli + ((1 - (intelep / res.length)) * 100) + "%<br/>";
	ns += "Error per element: [" + intelr.join(", ") + "]<br/>";


	document.getElementById("output").innerHTML = ns;
});