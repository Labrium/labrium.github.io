/* https://github.com/sbliven/mekoqr/blob/master/mekoqr-core/src/main/java/us/bliven/mekoqr/BlockType.java
 * 
 * 0x00 AIR
 * 0x01 STONE
 * 0x02 BRICK
 * 0x03 STONE_03
 * 0x04 WIN
 * 0x05 STONE_STAIR
 *   0x00
 *   0x01
 *   0x02
 *   0x03
 *   0x04
 *   0x05
 *   0x06
 *   0x07
 *   0x10
 *   0x11
 *   0x12
 *   0x13
 * 0x06 TRASH
 * 0x07 STONE_WEDGE
 *   0x00
 *   0x01
 *   0x02
 *   0x03
 *   0x04
 *   0x05
 *   0x06
 *   0x07
 *   0x10
 *   0x11
 *   0x12
 *   0x13
 * 0x08 GRASS_WEDGE
 *   0x00
 *   0x01
 *   0x02
 *   0x03
 *   0x04
 *   0x05
 *   0x06
 *   0x07
 *   0x10
 *   0x11
 *   0x12
 *   0x13
 * 0x09 GOLDEN_BALL
 * 0x0a METAL_WIN
 *   0x00 S
 *   0x01 E
 *   0x02 N
 *   0x03 W
 *   0x04 D
 *   0x0c U
 * 0x0b WATER
 * 0x0c GRASS
 * 0x0d BLACK_CYLINDER
 * 0x0e STONE QUARTER
 *   0x00
 *   0x01
 *   0x02
 *   0x03
 *   0x04
 *   0x05
 *   0x06
 *   0x07
 *   0x10
 *   0x11
 *   0x12
 *   0x13
 * 0x0f B_BOT
 *   0x00 S
 *   0x01 E
 *   0x02 N
 *   0x03 W
 * 0x10 ZAPPER
 *   0x00 U
 * 0x11 DRAGGABLE
 * 0x12 DESERT
 * 0x13 WHEEL
 *   0x00 S
 *   0x01 E
 *   0x02 N
 *   0x03 W
 *   0x04 D
 *   0x0c U
 * 0x14 METAL_STAIR
 *   0x00
 *   0x01
 *   0x02
 *   0x03
 *   0x04
 *   0x05
 *   0x06
 *   0x07
 *   0x10
 *   0x11
 *   0x12
 *   0x13
 * 0x15 METAL_QUARTER_PILLAR
 *   0x00
 *   0x01
 *   0x02
 *   0x03
 *   0x04
 *   0x05
 *   0x06
 *   0x07
 *   0x10
 *   0x11
 *   0x12
 *   0x13
 * 0x16 MOTOR
 *   0x00 S
 *   0x01 E
 *   0x02 N
 *   0x03 W
 *   0x04 D
 *   0x0c U
 * 0x17 METAL_17
 * 0x18 STONE_18
 * 0x19 METAL
 * 0x1a R_BOT
 *   0x00 S
 *   0x01 E
 *   0x02 N
 *   0x03 W
 * 0x1b EYE
 * 0x1c BUG_1C
 * 0x1d STONE_1D
 *   0x00 ?
 * 0x1e CURVED_RAIL
 *   0x00
 *   0x01
 *   0x02
 *   0x03
 *   0x04
 *   0x05
 *   0x06
 *   0x07
 *   0x10
 *   0x11
 *   0x12
 *   0x13
 * 0x1f STONE_PILLAR_1F
 *   0x14 X
 *   0x00 Y
 *   0x0c Z
 * 0x20 METAL_HALF_PILLAR
 *   0x00
 *   0x01
 *   0x02
 *   0x03
 *   0x04
 *   0x14
 *   0x15
 *   0x16
 *   0x17
 *   0x0c
 *   0x05
 *   0x06
 *   0x0f
 * 0x21 RAIL
 *   0x00 X
 *   0x14 Y
 *   0x03 Z
 * 0x22 STONE_HALF_PILLAR
 *   0x00
 *   0x01
 *   0x02
 *   0x03
 *   0x04
 *   0x14
 *   0x15
 *   0x16
 *   0x17
 *   0x0c
 *   0x05
 *   0x06
 *   0x0f
 * 0x23 STONE_PILLAR
 *   0x14 X
 *   0x00 Y
 *   0x0c Z
 * 0x24 DRAGGABLE_PILLAR
 *   0x14 X
 *   0x00 Y
 *   0x0c Z
 * 0x25 BALL
 * 0x26 STONE_26
 * 0x27 METAL_PILLAR
 *   0x14 X
 *   0x00 Y
 *   0x0c Z
 * 0x28 UNKNOWN_28
 * 0x29 SLIDER
 *   0x00 X
 *   0x14 Y
 *   0x03 Z
 * 0x2a UNKNOWN_2A
 * 0x2b FENCE
 *   0x00
 *   0x03
 *   0x04
 *   0x07
 *   0x10
 *   0x13
 * 0x2c UNKNOWN_2C
 * 0x2d UNKNOWN_2D
 * 0x2e UNKNOWN_2E
 * 0x2f UNKNOWN_2F
 * 0x30 CRASH_30
 * 0x31 UNKNOWN_31
 * 0x32 L_BOT
 *   0x00 S
 *   0x01 E
 *   0x02 N
 *   0x03 W
 * 0x33 STAR
 * 0x34 UNKNOWN_34
 */


//var ob = [2, 19, 13, 252, 120, 218, 237, 208, 221, 9, 0, 16, 20, 128, 81, 175, 74, 102, 176, 138, 119, 121, 51, 194, 45, 69, 87, 201, 207, 250, 6, 241, 157, 17, 142, 205, 114, 67, 146, 35, 221, 23, 109, 58, 174, 134, 184, 87, 29, 211, 0, 0, 128, 111, 57, 199, 1, 0, 0, 191, 120, 2, 196, 8, 245];

var filein = document.getElementById("upload");
var c = document.getElementById("uqr").getContext("2d");
var he = document.getElementById("header");
var dataTable = document.getElementById("data");
var unicode = document.getElementById("unicode");
var i = document.getElementById("qr");
var cropBox = document.getElementById("crop");

var originalData = [];
var header = [0x00, 0x00, 0x00, 0x00];
var data = [];
var title = document.getElementById("title");
var author = document.getElementById("author");

filein.value = "";
he.innerHTML = "";
title.value = "";
author.value = "";
dataTable.innerHTML = "";
unicode.textContent = "";
i.src = "";

var td = new TextDecoder("utf-8");
var te = new TextEncoder("utf-8");


function getModuleSize(location, version) {
	var topLeft = location.topLeft;
	var topRight = location.topRight;
	var a = Math.abs(topRight.x - topLeft.x);
	var b = Math.abs(topRight.y - topLeft.y);
	var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

	return c / (version * 4 + 17);
}

function markFinderPattern(x, y, moduleSize) {
	c.fillStyle = '#00ff00';

	c.beginPath();
	c.arc(x, y, moduleSize * 1, 0, 2 * Math.PI);
	c.fill();
}

function markQRCodeArea(location, version) {
	c.lineWidth = 3;
	c.strokeStyle = '#00ff00';

	c.beginPath();
	c.moveTo(location.topLeft.x, location.topLeft.y);
	c.lineTo(location.topRight.x, location.topRight.y);
	c.lineTo(location.bottomRight.x, location.bottomRight.y);
	c.lineTo(location.bottomLeft.x, location.bottomLeft.y);
	c.lineTo(location.topLeft.x, location.topLeft.y);
	c.stroke();

	var moduleSize = getModuleSize(location, version);

	markFinderPattern(location.topLeftFinder.x, location.topLeftFinder.y, moduleSize);
	markFinderPattern(location.topRightFinder.x, location.topRightFinder.y, moduleSize);
	markFinderPattern(location.bottomLeftFinder.x, location.bottomLeftFinder.y, moduleSize);
	//markFinderPattern(location.bottomRightAlignment.x, location.bottomRightAlignment.y, moduleSize * 0.5);
}



function regenerateQR() {
	try {
		var tid = Array.from(te.encode(title.value));
		tid.unshift(title.value.length);
		var aid = Array.from(te.encode(author.value));
		aid.unshift(author.value.length);
		var b = Array.from(pako.deflate(new Uint8Array(tid.concat(aid).concat(data)), {
			level: 9
		}));
		b = header.concat(b);
		console.log(b);

	} catch {
		var b = data;
	}





	var qrcode = new QRCode.Encoder();

	qrcode.setEncodingHint(true);
	qrcode.setErrorCorrectionLevel(QRCode.ErrorCorrectionLevel.L);

	qrcode.write(new QRCode.QRByte("", function (d) {
		return {
			encoding: 26,
			bytes: b
		}
	}));

	qrcode.make();

	i.src = qrcode.toDataURL(4, (4 * 7) / 2);

	update3DView();
}

var scanning = false;

var cam = document.getElementById("cam");

function startLiveScan(device) {
	scanning = true;
	if (device == "webcam") {
		document.getElementById("screenbutton").disabled = true;
		document.getElementById("cambutton").onclick = stopLiveScan;
		document.getElementById("cambutton").textContent = "Stop scanning";
		i.src = "";
		navigator.mediaDevices.getUserMedia({
			video: {
				width: {
					ideal: 4096
				},
				height: {
					ideal: 2160
				}
			},
			audio: false
		}).then(function (stream) {
			cam.srcObject = stream;
			cam.play();
			cam.onloadedmetadata = function () {
				c.canvas.style.transform = "scaleX(-1)";
				cam.width = cam.videoWidth;
				cam.height = cam.videoHeight;
				requestAnimationFrame(cameraLoop);
			};
		}).catch(function (e) {});
	} else if (device == "screen") {
		//c.canvas.style.display = "none";
		document.getElementById("cambutton").disabled = true;
		document.getElementById("screenbutton").onclick = stopLiveScan;
		document.getElementById("screenbutton").textContent = "Stop scanning";
		i.src = "";
		navigator.mediaDevices.getDisplayMedia({
			video: {
				width: {
					ideal: 4096
				},
				height: {
					ideal: 2160
				}
			},
			audio: false
		}).then(function (stream) {
			cam.srcObject = stream;
			cam.play();
			cam.onloadedmetadata = function () {
				cam.width = cam.videoWidth;
				cam.height = cam.videoHeight;
				requestAnimationFrame(cameraLoop);
			};
		}).catch(function (e) {});
	}
}

function cameraLoop() {
	try {
		scanQR(cam, cropBox.checked);
	} catch (e) {}

	if (scanning) {
		requestAnimationFrame(cameraLoop);
	}
}

function stopLiveScan() {
	try {
		cam.pause();
		scanning = false;
		document.getElementById("cambutton").disabled = false;
		document.getElementById("cambutton").onclick = function () {
			startLiveScan("webcam");
		};
		document.getElementById("screenbutton").disabled = false;
		document.getElementById("screenbutton").onclick = function () {
			startLiveScan("screen");
		};
		document.getElementById("cambutton").textContent = "Scan using webcam";
		document.getElementById("screenbutton").textContent = "Scan screen";
		c.canvas.style.transform = "";
		c.canvas.style.display = "block";
		cam.srcObject.getTracks().forEach(function (track) {
			track.stop();
		});
		cam.srcObject = null;
	} catch (e) {}
}

stopLiveScan();

var skipQR = false;

function scanQR(img, crop, e) {
	if (!skipQR) {

		if (crop) {
			c.canvas.width = Math.min(960, img.width);
			c.canvas.height = img.height * (c.canvas.width / img.width);
			c.drawImage(img, (c.canvas.width / 2) - (img.width / 2), (c.canvas.height / 2) - (img.height / 2), img.width, img.height);
			var imageData = c.getImageData(0, 0, c.canvas.width, c.canvas.height);
		} else {
			c.canvas.width = Math.min(960, img.width);
			c.canvas.height = img.height * (c.canvas.width / img.width);
			c.drawImage(img, 0, 0, img.width, img.height, 0, 0, c.canvas.width, c.canvas.height);
			var imageData = c.getImageData(0, 0, c.canvas.width, c.canvas.height);
		}

		var result = new QRCode.Decoder({
			canOverwriteImage: true
		}).decode(imageData.data, imageData.width, imageData.height);

	} else {
		c.canvas.width = 300;
		c.canvas.height = 150;
		var dec = [];
		for (ch in e.target.result) {
			dec.push(e.target.result.charCodeAt(ch));
		}
		var result = {
			data: e.target.result,
			bytes: dec
		};
	}

	he.innerHTML = "";
	title.value = "";
	author.value = "";
	dataTable.innerHTML = "";
	unicode.textContent = "";
	i.src = "";

	if (result && result.bytes.length > 0) {

		stopLiveScan();

		console.log(result);

		try {
			markQRCodeArea(result.location, result.version);
		} catch (e) {}

		requestAnimationFrame(function () {

			originalData = result.bytes;

			header = originalData.slice(0, 4);

			var ht = "Header:\n";

			for (h in header) {
				ht += '<input type="text" size="2" maxlength="2" style="display: inline; width: 24px;" onchange="header[' + h + '] = Number(\'0x\' + this.value); regenerateQR();" value="' + header[h].toString(16).padStart(2, "0") + '" />'
			}

			if (header[1] == 0x13 && header[2] == 0x0d && header[3] == 0xfc) {
				if (header[0] == 0x01) {
					ht += "\nOlder than Mekorama v1.4 (Mekorama Level QR Spec v1)."
				} else if (header[0] == 0x02) {
					ht += "\nMekorama v1.4 or later. (Mekorama Level QR Spec v2)."
				} else {
					ht += "\nUnrecognized Mekorama version. (Mekorama Level QR Spec v" + header[0].toString(16) + ")."
				}
			} else {
				ht += "\nUnrecognized header. This QR code is not a Mekorama level."
			}
			he.innerHTML = ht;

			data = originalData.slice(4);

			try {
				data = Array.from(pako.inflate(new Uint8Array(data)));
			} catch (e) {
				data = result.bytes;
			}

			var tl = data[0];
			title.value = td.decode(new Uint8Array(data.slice(1, tl + 1)));
			var al = data[tl + 1];
			author.value = td.decode(new Uint8Array(data.slice(tl + 2, tl + al + 2)));
			data = data.slice(tl + al + 2);



			var tmpstr = `<th></th>
			<th>0</th>
			<th>1</th>
			<th>2</th>
			<th>3</th>
			<th>4</th>
			<th>5</th>
			<th>6</th>
			<th>7</th>
			<th>8</th>
			<th>9</th>
			<th>a</th>
			<th>b</th>
			<th>c</th>
			<th>d</th>
			<th>e</th>
			<th>f</th>`;
			var idx = 0;
			for (var s = 0; s < Math.ceil(data.length / 16); s++) {
				if (s % 16 == 15) {
					tmpstr += '<tr class="separator"><td>' + (s * 16).toString(16).padStart(8, "0") + "</td>";
				} else {
					tmpstr += "<tr><td>" + (s * 16).toString(16).padStart(8, "0") + "</td>";
				}
				for (var t = 0; t < 16; t++) {
					var nd = data[idx];
					if (nd != undefined) {
						tmpstr += '<td><input type="text" size="2" maxlength="2" onchange="this.setAttribute(\'value\', this.value); data[' + idx + '] = Number(\'0x\' + this.value); regenerateQR();" value="' + nd.toString(16).padStart(2, "0") + '" /></td>';
					} else {
						//tmpstr += '<td><input type="text" size="2" maxlength="2" value="" /></td>';
					}
					idx++;
				}
				tmpstr += "</tr>";
			}
			dataTable.innerHTML = tmpstr;




			unicode.textContent = result.data;

			requestAnimationFrame(regenerateQR);

		});

	} else {
		he.textContent = "No QR code found.";
	}
}


filein.addEventListener("change", function (f) {
	var file = f.target.files[0];

	if (file) {
		var reader = new FileReader();

		skipQR = false;

		if (file.name.split('.').pop().toLowerCase() == "bin") {
			skipQR = true;
		}

		reader.onload = function (e) {
			if (!skipQR) {
				var img = new Image();

				img.crossOrigin = 'anonymous';

			} else {
				var img = {};
			}

			img.onload = function () {
				scanQR(img, false, e);
			};

			if (!skipQR) {
				img.src = e.target.result;
			} else {
				img.onload();
			}
		};

		if (!skipQR) {
			reader.readAsDataURL(file);
		} else {
			reader.readAsBinaryString(file);
		}
	}
});