var bootVolume = "Macintosh HD";
var kernel = {

    console: [],
    log: function (msg) {
        kernel.console.push(msg.toString());
        console.log(msg);
    },

    readFile: function (file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    },

    loadFramework: function (rpath) {
        var script = document.createElement("script");
        script.src = rpath;
        document.body.appendChild(script);
    },

    POSIXPath: function (vpath, callback) {
        this.readFile("filesystem.json", function (fileData) {
            var fs = JSON.parse(fileData);
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
            callback(cpath);
        });
    },

    boot: function () {
        document.body.innerHTML = '<div id="bootScreen"><img src="boot/bootLogo.svg" /><progress value="0"></progress></div>';
        kernel.readFile("filesystem.json", function (fileData) {
            var fs = JSON.parse(fileData);
            kernel.POSIXPath("bootrom/StartupChime", function (sc) {
                var startupChime = new Audio(sc.path);
                startupChime.play();
                setTimeout(function () {
                    document.getElementById("bootScreen").style.opacity = 1;
                    document.querySelector("#bootScreen progress").value = 1;
                    setTimeout(function () {
                        kernel.POSIXPath("bootrom/bootfiles", function (fw) {
                            kernel.readFile(fw.path, function (fwData) {
                                var fwList = JSON.parse(fwData);
                                var fwListLength = fwList.load.length;
                                for (var i = 0; i < fwListLength; i++) {
                                    kernel.POSIXPath(fwList.load[i], function (fwrPath) {
                                        if (fwrPath.type == 1) {
                                            kernel.loadFramework(fwrPath.path);
                                        } else {
                                            kernel.readFile(fwrPath.path + "/Info.json", function (infoDotJSON) {
                                                var appInfo = JSON.parse(infoDotJSON);
                                                kernel.loadFramework(fwrPath.path + "/MacOS/" + appInfo.CFBundleExecutable + ".js");
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }, 10000);
                }, 4000);
            });
        });
    }

}