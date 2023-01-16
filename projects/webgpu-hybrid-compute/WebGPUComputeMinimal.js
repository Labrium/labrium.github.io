(async () => {
	if (!("gpu" in navigator)) {
		console.log("WebGPU is not supported.");
	}
	const firstMatrix = new Float32Array([
		2 /* rows */ , 4 /* columns */ ,
		1, 2, 3, 4,
		5, 6, 7, 8
	]);
	const secondMatrix = new Float32Array([
		4 /* rows */ , 2 /* columns */ ,
		1, 2,
		3, 4,
		5, 6,
		7, 8
	]);
	const adapter = await navigator.gpu.requestAdapter();
	if (!adapter) {
		console.log("Failed to get GPU adapter.");
		return;
	}
	const device = await adapter.requestDevice();
	const gpuBufferFirstMatrix = device.createBuffer({
		mappedAtCreation: true,
		size: firstMatrix.byteLength,
		usage: GPUBufferUsage.STORAGE
	});
	const arrayBufferFirstMatrix = gpuBufferFirstMatrix.getMappedRange();

	new Float32Array(arrayBufferFirstMatrix).set(firstMatrix);
	gpuBufferFirstMatrix.unmap();
	const gpuBufferSecondMatrix = device.createBuffer({
		mappedAtCreation: true,
		size: secondMatrix.byteLength,
		usage: GPUBufferUsage.STORAGE
	});
	const arrayBufferSecondMatrix = gpuBufferSecondMatrix.getMappedRange();
	new Float32Array(arrayBufferSecondMatrix).set(secondMatrix);
	gpuBufferSecondMatrix.unmap();
	const resultMatrixBufferSize = Float32Array.BYTES_PER_ELEMENT * (2 + firstMatrix[0] * secondMatrix[1]);
	const resultMatrixBuffer = device.createBuffer({
		size: resultMatrixBufferSize,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
	});
	const shaderModule = device.createShaderModule({
		code: `
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
    `
	});
	const computePipeline = device.createComputePipeline({
		layout: "auto",
		compute: {
			module: shaderModule,
			entryPoint: "main"
		}
	});
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
	const commandEncoder = device.createCommandEncoder();
	const passEncoder = commandEncoder.beginComputePass();
	passEncoder.setPipeline(computePipeline);
	passEncoder.setBindGroup(0, bindGroup);
	passEncoder.dispatchWorkgroups(Math.ceil(firstMatrix[0] / 8), Math.ceil(secondMatrix[1] / 8));
	passEncoder.end();
	const gpuReadBuffer = device.createBuffer({
		size: resultMatrixBufferSize,
		usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
	});
	commandEncoder.copyBufferToBuffer(
		resultMatrixBuffer /* source buffer */ ,
		0 /* source offset */ ,
		gpuReadBuffer /* destination buffer */ ,
		0 /* destination offset */ ,
		resultMatrixBufferSize /* size */
	);
	const gpuCommands = commandEncoder.finish();
	device.queue.submit([gpuCommands]);
	await gpuReadBuffer.mapAsync(GPUMapMode.READ);
	const arrayBuffer = gpuReadBuffer.getMappedRange();
	console.log(new Float32Array(arrayBuffer));
})();