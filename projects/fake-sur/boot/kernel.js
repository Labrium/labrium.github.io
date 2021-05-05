window.onerror = function (e, u, l) {
	alert(e);
	if (BOOTING == true) {
		kernel.shutdown();
	}
}
var BOOTVOLUME = "Macintosh HD";
var ROOTFS = null;
var BOOTING = false;
var kernel = {
	console: [],
	log: function (msg) {
		kernel.console.push([0, String(msg)]);
		console.log(msg);
	},
	warn: function (msg) {
		kernel.console.push([1, String(msg)]);
		console.warn(msg);
	},
	error: function (msg) {
		kernel.console.push([2, String(msg)]);
		console.error("*** " + msg + " ***");
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
	exec: function (path) {
		kernel.readFile(path + "/Contents/Info.json", function (fd) {
			var info = JSON.parse(fd);
			kernel.readFile(path + "/Contents/MacOS/" + info.CFBundleExecutable + ".js", function (executeable) {
				eval(executeable);
			});
		});
	},

	loadFramework: function (rpath) {
		var script = document.createElement("script");
		script.innerHTML = rpath;
		document.body.appendChild(script);
	},

	mountFilesystem: function (callback) {
		var fsCheckDidFail = false;
		kernel.log("Mounting filesystem...");
		if (localStorage.getItem("administrator") != null) {
			kernel.log("Administrator account detected.");
			kernel.log("Checking file archive tree...");
			try {
				JSON.parse(localStorage.getItem("administrator"));
				kernel.log("Administrator account data is valid.");
			} catch (e) {
				kernel.log("Administrator account data is unrecognized or corrupted.");
				if (confirm("The Administrator account on this system is invalid. You will not be able log in until this problem is resolved. Should this account be erased?")) {
					kernel.log("Proceeding to erase administrator account...");
					localStorage.removeItem("administrator");
					kernel.log("Continuing with boot process...");
				}
			}
		}
		if (ROOTFS == null) {
			kernel.log("No external system image found. Assuming default OS...");
			fsCheckDidFail = true;
		} else {
			kernel.log("External system image found. Attempting to boot...");
			kernel.log("Checking file archive tree...");
			try {
				if (typeof ROOTFS == "string") {
					JSON.parse(ROOTFS);
				} else {
					kernel.POSIXPath("/System");
				}
				kernel.log("External system image is valid.");
			} catch (e) {
				kernel.log("External system image is not bootable.");
				fsCheckDidFail = true;
			}
		}
		if (fsCheckDidFail == true) {
			kernel.log("Initializing default OS...");
			kernel.readFile("OS.fsimage/Contents.json", function (fraglist, fraglistpath) {
				var i = 0;
				var frags = JSON.parse(fraglist)["Contents"];
				ROOTFS = "";
				function loadFSFrags(frag, fragpath) {
					ROOTFS += frag;
					i++;
					if (frags[i]) {
						kernel.readFile("OS.fsimage/" + frags[i], loadFSFrags);
					} else {
						kernel.log("Filesystem mounted successfully.");
						kernel.log("Checking file archive tree...");
						try {
							JSON.parse(ROOTFS);
							kernel.log("Filesystem is valid.");
							callback();
						} catch (e) {
							kernel.log("Filesystem is not bootable.");
							kernel.log("Filesystem mount failed.");
							kernel.log("Shutting Down...");
							kernel.shutdown();
						}
					}
				}
				kernel.readFile("OS.fsimage/" + frags[0], loadFSFrags);
			});
		} else {
			callback();
		}
	},

	POSIXPath: function (vpath) {
		try {
			var fs = JSON.parse(localStorage.getItem("administrator"));
			var vp = vpath.toString().split("/");
			var vpl = vp.length;
			var cpath = fs;
			for (var i = 0; i < vpl; i++) {
				if (vp[0] == "" && i == 0) {
					cpath = fs[BOOTVOLUME];
				} else {
					cpath = cpath[vp[i]];
				}
			}
			return cpath;
		} catch (e) {
			try {
				if (typeof ROOTFS == "string") {
					ROOTFS = JSON.parse(ROOTFS);
				}
				var vp = vpath.toString().split("/");
				var vpl = vp.length;
				var cpath = ROOTFS;
				for (var i = 0; i < vpl; i++) {
					if (vp[0] == "" && i == 0) {
						cpath = ROOTFS[BOOTVOLUME];
					} else {
						cpath = cpath[vp[i]];
					}
				}
				return cpath;
			} catch (e) {
				throw (vpath + ": No such file or directory.");
			}
		}
	},

	startupChime: undefined,

	boot: function () {
		BOOTING = true;
		var PTS = 0;
		var PCS = 0;
		function upb() {
			document.querySelector("#bootScreen progress").value = (PCS / PTS) * 0.5;
		}
		document.body.removeAttribute("onclick");
		kernel.log("Initiating boot sequence...");
		kernel.log("Checking firmware...");
		kernel.startupChime = new Audio("boot/startupChime.mp3");
		kernel.startupChime.play();
		kernel.log("Firmware check passed.");
		kernel.log("Detecting displays...");
		document.body.innerHTML = '<div id="bootScreen"><img src="boot/bootLogo.svg" /><progress value="0"></progress></div>';
		kernel.log("Detected internal display: " + window.innerWidth + " x " + window.innerHeight + "px.");
		setTimeout(function () {
			kernel.log("Checking GPU...");
			document.getElementById("bootScreen").style.opacity = 1;
			kernel.log("GPU check passed.");
			setTimeout(function () {
				kernel.log("Proceeding with boot process...");
				document.querySelector("#bootScreen progress").style.visibility = "visible";
				kernel.log("Boot volume is “" + BOOTVOLUME + "”.");
				kernel.mountFilesystem(function () {
					kernel.log("Loading system frameworks...");
					var fwData = kernel.POSIXPath("/var/db/bootfiles.json")["@CONTENTS"];
					var fwList = JSON.parse(fwData);
					var fwListLength = fwList.load.length;
					PTS = fwListLength + 1;
					PCS = 1;
					var i = 0;
					function lf() {
						try {
							if (kernel.POSIXPath(fwList.load[i])["@TYPE"] == 1) {
								var fwrPath = kernel.POSIXPath(fwList.load[i]);
								kernel.loadFramework(fwrPath["@CONTENTS"]);
								kernel.log("Successfully loaded framework “" + fwList.load[i].split("/")[fwList.load[i].split("/").length - 1].split(".")[0] + "”.");
							} else {
								var infoDotJSON = kernel.POSIXPath(fwList.load[i] + "/Contents/Info.json")["@CONTENTS"];
								var appInfo = JSON.parse(infoDotJSON);
								kernel.log("Launching “" + fwList.load[i].split("/")[fwList.load[i].split("/").length - 1] + "”...");
								kernel.loadFramework(kernel.POSIXPath(fwList.load[i] + "/Contents/MacOS/" + appInfo.CFBundleExecutable + ".js")["@CONTENTS"]);
							}
							document.querySelector("#bootScreen progress").value += 0.3;
							i++;
							PCS = i + 1;
							upb();
							if (i <= fwListLength) {
								setTimeout(lf, 0);
							}
						} catch (e) {
							BOOTING = false;
						}
					}
					lf();
				});
			}, 2000);
		}, 4000);
	},
	shutdown: function () {
		kernel.startupChime.pause();
		kernel.startupChime.currentTime = 0;
		document.body.innerHTML = "";
		document.body.setAttribute("onclick", "kernel.boot();");
	},
	reboot: function () {
		kernel.shutdown();
		kernel.boot();
	}

}