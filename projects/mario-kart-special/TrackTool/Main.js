var cache = [];

var matches = [];

var colors = [
	"#0000FF", // 0 = walls
	"#000000", // 1 = road
	"#FF0000", // 2 = holes
	"#00FF00", // 3 = offroad
];

var customMap = {
	0: 0,
	1: 0,
	2: 0,
	3: 0,
	4: 3,
	5: 3,
	6: 3,
	7: 3,
	8: 3,
	9: 3,
	68: 3,
	69: 3,
	98: 3,
	102: 3
};

var markers = document.getElementById("markerView").getContext("2d");
var ctx = document.getElementById("trackView").getContext("2d");
var tileset = document.createElement("canvas").getContext("2d");
var tilesetView = document.getElementById("tilesetView");
function loadTrack(track) {
	ctx.canvas.width = track.image.width;
	ctx.canvas.height = track.image.height;

	ctx.drawImage(track.image, 0, 0);



	// Detect background color

	markers.canvas.width = ctx.canvas.width / 8;
	markers.canvas.height = ctx.canvas.height / 8;


	var groundimage = ctx.getImageData(ctx.canvas.width - 24, 8, 8, 8);

	var length = groundimage.data.length;
	var count = 0;
	var rgb = {
		r: 0,
		g: 0,
		b: 0
	};
	var i = 0;
	while ((i += 4) < length) {
		++count;
		rgb.r += groundimage.data[i];
		rgb.g += groundimage.data[i + 1];
		rgb.b += groundimage.data[i + 2];
	}
	rgb.r = ~~(rgb.r / count);
	rgb.g = ~~(rgb.g / count);
	rgb.b = ~~(rgb.b / count);

	document.body.style.backgroundColor = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";

	tileset.canvas.width = 8;
	tileset.canvas.height = 8;

	var tileMapData = ctx.getImageData(ctx.canvas.width - 16, 8, 8, 8);
	ctx.putImageData(groundimage, ctx.canvas.width - 16, 8);

	var found = false;
	for (c in cache) {
		if (cache[c] == String(tileMapData.data)) {
			found = true;
		}
	}

	if (found == false) {
		decodeTilesetData(tileMapData);
		redraw(ctx, markers, tileset);
	}

	udbtn.onclick = function () {
		redraw(ctx, markers, tileset);
	};
	document.getElementById("container").appendChild(udbtn);

	delete cache;

}

var udbtn = document.createElement("button");
udbtn.innerHTML = "Update";

new THREE.TextureLoader().load("../Images/Tracks/MarioCircuit.png", loadTrack);


var filed = document.getElementById("file");
filed.addEventListener("change", function (f) {
	var file = f.target.files[0];
	if (file) {
		var reader = new FileReader();
		reader.onload = function (e) {
			new THREE.TextureLoader().load(e.target.result, loadTrack);
		};
		reader.readAsDataURL(file);
	}
});




var dataTile;
var btn;

function redraw(ctx, markers, tileset) {
	cache = [];

	var index = 0;

	index = 0;
	var ts = tilesetView.querySelectorAll("img");
	for (var tsi = 0; tsi < ts.length; tsi++) {
		ts[tsi].remove();
	}

	for (var y = 0; y < ctx.canvas.height; y += 8) {
		for (var x = 0; x < ctx.canvas.width; x += 8) {
			var tile = ctx.getImageData(x, y, 8, 8);
			var tiledata = String(tile.data);
			var uniquet = true;

			for (var t = 0; t < cache.length; t++) {
				if (cache[t] == tiledata) {
					uniquet = false;
					var match = t;
				}
			}

			if (uniquet == true) {
				var str = colors[customMap[index]];
				if (str == undefined) {
					str = colors[1];
				}

				matches.push([
					[x / 8, y / 8, tile]
				]);
				markers.fillStyle = str;
				markers.fillRect(x / 8, y / 8, 1, 1);
				cache.push(tiledata);
				tileset.putImageData(tile, 0, 0);
				var img = document.createElement("img");
				img.src = tileset.canvas.toDataURL();
				img.style.borderColor = str;
				img.onclick = function () {
					var n = Number(this.getAttribute("num"));
					if (!customMap[n]) {
						customMap[n] = 0;
					}
					customMap[n] += 1;
					if (!colors[customMap[n]]) {
						customMap[n] = 0;
					}
					this.style.borderColor = colors[customMap[n]];
				};
				img.setAttribute("num", index);
				index++;
				tilesetView.appendChild(img);
			} else {
				var str = colors[customMap[match]];
				if (str == undefined) {
					str = colors[1];
				}
				matches[match].push([x / 8, y / 8, tile]);
				markers.fillStyle = str;
				markers.fillRect(x / 8, y / 8, 1, 1);
			}
		}
	}

	if (!dataTile) {
		dataTile = document.createElement("canvas").getContext("2d");
		dataTile.canvas.width = 8;
		dataTile.canvas.height = 8;
		dataTile.canvas.style.width = "128px";
		dataTile.canvas.style.height = "128px";
		dataTile.canvas.style.imageRendering = "pixelated";
		document.getElementById("container").appendChild(dataTile.canvas);
	}

	encodeTilesetData(dataTile);

	if (!btn) {
		btn = document.createElement("button");
		btn.onclick = function () {
			var tmp = document.createElement("canvas").getContext("2d");
			tmp.canvas.width = ctx.canvas.width;
			tmp.canvas.height = ctx.canvas.height;
			tmp.drawImage(ctx.canvas, 0, 0);
			tmp.drawImage(dataTile.canvas, ctx.canvas.width - 16, 8);
			var download = document.createElement("a");
			download.href = tmp.canvas.toDataURL();
			download.download = "track.png";
			download.click();
			delete tmp;
			delete download;
		};
		btn.innerHTML = "Download";
		document.getElementById("container").appendChild(btn);
	}

}

var tilesetMapData;
function encodeTilesetData(dataTile) {
	if (!tilesetMapData) {
		tilesetMapData = dataTile.createImageData(8, 8);
	}
	// IMPORTANT! Track tileset must have less than 768 (64 pixels * 3 channels * 4 values per channel = 768) unique tiles.
	var d = 0;
	for (var c = 0; c < tilesetMapData.data.length; c += 4) { // 64 pixels in the data tile
		for (var a = 0; a < 3; a++) { // 3 channels (R, G, and B)
			var num = [];
			for (var b = 0; b < 4; b++) { // 4 tiles' data can be stored in one channel
				if (customMap[d]) {
					num.push(customMap[d]);
				} else {
					num.push(0);
				}
				d++;
			}
			tilesetMapData.data[c + a] = (num[0] << 6) | (num[1] << 4) | (num[2] << 2) | num[3];
		}
		tilesetMapData.data[c + 3] = 255;
	}
	console.log(tilesetMapData);
	dataTile.putImageData(tilesetMapData, 0, 0);
}



function decodeTilesetData(data) {
	// IMPORTANT! Track tileset must have less than 768 unique tiles.
	var d = 0;
	customMap = {};
	for (var c = 0; c < data.data.length; c += 4) { // 64 pixels in the data tile
		for (var a = 0; a < 3; a++) { // 3 channels (R, G, and B)
			var num = data.data[c + a];
			customMap[d + 0] = (num & 0b11000000) >> 6;
			customMap[d + 1] = (num & 0b00110000) >> 4;
			customMap[d + 2] = (num & 0b00001100) >> 2;
			customMap[d + 3] = (num & 0b00000011);
			d += 4;
		}
	}
}