var bootVolume = "Macintosh HD";
var kernel = {

	console: [],
	log: function (msg) {
		kernel.console.push(String(msg));
		console.log(msg);
	},

	readFile: function (file, callback) {
		var rawFile = new XMLHttpRequest();
		rawFile.overrideMimeType("application/json");
		rawFile.open("GET", file, true);
		rawFile.onreadystatechange = function () {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
				callback(rawFile.responseText, file);
			}
		}
		rawFile.send(null);
	},

	loadFramework: function (rpath) {
		var script = document.createElement("script");
		script.src = rpath;
		document.body.appendChild(script);
	},

	mountFilesystem: function (callback) {
		var fsCheckDidFail = false;
		kernel.log("Mounting filesystem...");
		if (localStorage.getItem("filesystem") == null) {
			kernel.log("No filesystem cache found.");
			fsCheckDidFail = true;
		} else {
			kernel.log("Filesystem already cached.");
			kernel.log("Checking file archive tree...");
			try {
				JSON.parse(localStorage.getItem("filesystem"));
				kernel.log("Filesystem valid.");
			} catch (e) {
				kernel.log("Filesystem cache is not bootable.");
				fsCheckDidFail = true;
			}
			
		}
		if (fsCheckDidFail == true) {
			kernel.log("Initializing new filesystem...");
			this.readFile("filesystem.json", function (fileData, fpath) {
				localStorage.setItem("filesystem", fileData);
				if (fileData == localStorage.getItem("filesystem")) {
					kernel.log("Filesystem created successfully.");
					callback();
				} else {
					kernel.log("Filesystem creation failed.");
				}
			});
		} else {
			callback();
		}
	},

	POSIXPath: function (vpath) {
		try {
			var fs = JSON.parse(localStorage.getItem("filesystem"));
			var vp = vpath.toString().split("/");
			var vpl = vp.length;
			var cpath = fs;
			for (var i = 0; i < vpl; i++) {
				if (vp[0] == "" && i == 0) {
					cpath = fs[bootVolume];
				} else {
					cpath = cpath[vp[i]];
				}
			}
			return cpath;
		} catch (e) {
			kernel.log(vpath + ": No such file or directory.");
			return false;
		}
	},

	boot: function () {
		document.body.removeAttribute("onclick");
		kernel.log("Initiating boot sequence...");
		kernel.log("Checking Firmware...");
		var startupChime = new Audio("boot/startupChime.mp3");
		startupChime.play();
		kernel.log("Firmware check passed.");
		kernel.log("Detecting displays...");
		document.body.innerHTML = '<div id="bootScreen"><img src="boot/bootLogo.svg" /><progress value="0"></progress></div>';
		kernel.log("Detected internal display: " + window.innerWidth + " x " + window.innerHeight + "px.");
		kernel.mountFilesystem(function () {
			kernel.log("Proceeding with boot process...");
			kernel.log("Boot volume is “" + bootVolume + "”.");
			setTimeout(function () {
				kernel.log("Checking GPU...");
				document.getElementById("bootScreen").style.opacity = 1;
				kernel.log("GPU check passed.");
				setTimeout(function () {
					kernel.log("Proceeding to load system frameworks...");
					document.querySelector("#bootScreen progress").style.visibility = "visible";
					document.querySelector("#bootScreen progress").value = 0.2;
					kernel.readFile("boot/bootfiles.json", function (fwData, fwpath) {
						document.querySelector("#bootScreen progress").value = 0.4;
						var fwList = JSON.parse(fwData);
						document.querySelector("#bootScreen progress").value = 0.6;
						var fwListLength = fwList.load.length;
						document.querySelector("#bootScreen progress").value = 0.8;
						for (var i = 0; i < fwListLength; i++) {
							var fwrPath = kernel.POSIXPath(fwList.load[i]);
							if (fwrPath.type == 1) {
								kernel.loadFramework(fwrPath.path);
								kernel.log("Successfully loaded framework “" + fwrPath.path.split("/")[1].split(".")[0] + "”.");
							} else {
								kernel.readFile(fwrPath.path + "/Contents/Info.json", function (infoDotJSON, pth) {
									var appInfo = JSON.parse(infoDotJSON);
									kernel.loadFramework(pth.split("/Info.json")[0] + "/MacOS/" + appInfo.CFBundleExecutable + ".js");
									kernel.log("Launching “" + pth.split("/Contents/Info.json")[0].split("/")[1] + "”...");
								});
							}
						}
					});
				}, 2000);
			}, 4000);
		});
	}

}