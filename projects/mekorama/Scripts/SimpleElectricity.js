/**
 * @author kiosk / file:///Volumes/BYUSD/code/HTML/Tech%20Labs/Home.html | https://www.techlabs.github.io/
 */

THREE.SimpleElectricity = function (options) {
    THREE.Group.call(this);
    var settings = { color: options.color, startPoint: options.startPoint, endPoint: options.endPoint, positions: options.positions, segments: options.segments, roughness: options.roughness, delay: options.delay };

    function reRandomize() {
        settings.startPoint = settings.positions[Math.floor(Math.random() * settings.positions.length)];
        settings.endPoint = settings.positions[Math.floor(Math.random() * settings.positions.length)];
        while (settings.startPoint == settings.endPoint) {
            settings.endPoint = settings.positions[Math.floor(Math.random() * settings.positions.length)];
        }
    }
    var delay = 0;
    var streams = [];
    var colors = [settings.color, 0xffffff];
    var sizes = [7, 3];

    for (var i = 0; i < colors.length; i++) {
        streams.push(new THREE.Line());
    }

    var glow = [];
    for (var i = 1; i < settings.segments; i++) {
        glow.push(new THREE.PointLight(colors[0], 2, 0.5, 1));
        this.add(glow[i - 1]);
    }

    if (settings.startPoint == undefined || settings.endPoint == undefined) {
        reRandomize();
    }

    this.update = function () {
        var nodes = [];
        nodes.push(settings.startPoint);
        for (var i = 1; i < settings.segments; i++) {
            var normalPoint = CustomMath.PointBetween(settings.startPoint, settings.endPoint, i / settings.segments);
            nodes.push(new THREE.Vector3(normalPoint.x + (Math.random() * (settings.roughness * 2) - settings.roughness), normalPoint.y + (Math.random() * settings.roughness), normalPoint.z + (Math.random() * (settings.roughness * 2) - settings.roughness)));
            glow[i - 1].position.copy(nodes[i]);
        }
        nodes.push(settings.endPoint);
        for (var i = 0; i < streams.length; i++) {
            this.remove(streams[i]);
            var lineGeo = new THREE.BufferGeometry().setFromPoints(nodes);
            streams[i] = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: colors[i], linewidth: sizes[i], blending: THREE.NormalBlending }));
            this.add(streams[i]);
        }
        delay--;
        if (delay <= 0) {
            reRandomize();
            delay = Math.round(Math.random() * settings.delay);
        }
    }
}
THREE.SimpleElectricity.prototype = Object.create(THREE.Group.prototype);
THREE.SimpleElectricity.prototype.constructor = THREE.SimpleElectricity;