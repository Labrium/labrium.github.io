
var THREE = THREE || {};

THREE.ImportController = function () {

    var loadedLoaders = [];
    var reader = new FileReader();
    var self = this;

    function getFilesFromItemList(items, onDone) {
        var itemsCount = 0;
        var itemsTotal = 0;
        var files = [];
        var filesMap = {};
        function onEntryHandled() {
            itemsCount++;
            if (itemsCount === itemsTotal) {
                onDone(files, filesMap);
            }
        }
        function handleEntry(entry) {
            if (entry.isDirectory) {
                var reader = entry.createReader();
                reader.readEntries(function (entries) {
                    for (var i = 0; i < entries.length; i++) {
                        handleEntry(entries[i]);
                    }
                    onEntryHandled();
                });
            } else if (entry.isFile) {
                entry.file(function (file) {
                    files.push(file);
                    filesMap[entry.fullPath.substr(1)] = file;
                    onEntryHandled();
                });
            }
            itemsTotal++;
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.kind === 'file') {
                handleEntry(item.webkitGetAsEntry());
            }
        }
    }

    this.loadItemList = function (items) {
        getFilesFromItemList(items, function (files, filesMap) {
            self.loadFiles(files, filesMap);
        });
    };

    this.loadFiles = function (fileList) {
        console.log(fileList);
        for (var f = 0; f < fileList.length; f++) {
            var fname = fileList[f].name;
            while (fname.indexOf('.') == 0) {
                fname = fname.replace(/^./, '');
            }
            if (fname.indexOf('.') > -1) {
                var ext = fname.split(".");
                ext = ext[ext.length - 1];
                switch (ext.toUpperCase()) {
                    case "GLTF":
                    case "GLB":
                        reader.addEventListener('load', function (event) {
                            new THREE.GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parse(event.target.result, '', function (obj) {
                                //console.log(obj);
                                for (var c = 0; c < obj.scenes.length; c++) {
                                    model.add(obj.scenes[c]);
                                }
                                render();
                            });
                        });
                        reader.readAsArrayBuffer(fileList[f]);
                        break;
                    case "OBJ":
                        reader.addEventListener('load', function (event) {
                            model.add(new THREE.OBJLoader().parse(event.target.result));
                            render();
                        });
                        reader.readAsText(fileList[f]);
                        break;
                }
            }
        }
    };

};