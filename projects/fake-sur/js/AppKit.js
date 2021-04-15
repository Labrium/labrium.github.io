var NSSymbolButtonType = 0;
var NSImageButtonType = 1;

function NSWindow(options) {
	function dragElement(elmnt, titlebar) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		if (titlebar == true) {
			elmnt.querySelector('.titlebar').onmousedown = dragMouseDown;
		} else {
			elmnt.onmousedown = dragMouseDown;
		}

		function dragMouseDown(e) {
			e = e || window.event;
			//e.preventDefault();
			//e.stopPropagation();
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
			elmnt.querySelector('.contentView').style.pointerEvents = "none";
		}

		function elementDrag(e) {
			e = e || window.event;
			//e.preventDefault();
			//e.stopPropagation();
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			// set the element's new position:
			if ((elmnt.offsetTop - pos2) < 25 || (elmnt.offsetTop - pos2) > (window.innerHeight - e.offsetHeight)) {
				pos2 = 0;
			}
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
			/* stop moving when mouse button is released:*/
			document.onmouseup = null;
			document.onmousemove = null;
			elmnt.querySelector('.contentView').style.pointerEvents = "initial";
		}
	}

	this.HTMLElement = document.createElement("div");
	if (options.position == "center") {
		this.HTMLElement.style.left = ((window.innerWidth / 2) - (options.size[0] / 2)) + "px";
		this.HTMLElement.style.top = ((window.innerHeight / 2) - (options.size[1] / 2)) + "px";
		this.HTMLElement.style.width = options.size[0] + "px";
		this.HTMLElement.style.height = options.size[1] + "px";
	} else if (options.size == "maximize") {
		this.HTMLElement.style.width = window.innerWidth + "px";
		this.HTMLElement.style.height = ((window.innerHeight - 31) - document.getElementById('dock').offsetHeight) + "px";
		this.HTMLElement.style.top = "25px";
		this.HTMLElement.style.left = "0px";
	} else {
		this.HTMLElement.style.left = options.position[0] + "px";
		this.HTMLElement.style.top = options.position[1] + "px";
		this.HTMLElement.style.width = options.size[0] + "px";
		this.HTMLElement.style.height = options.size[1] + "px";
	}
	this.HTMLElement.setAttribute("class", "window");

	try {
		this.HTMLElement.innerHTML += options.view;
	} catch (e) { }

	if (options.titlebar) {
		this.titlebar = document.createElement("div");
		this.titlebar.setAttribute("class", "this.titlebar");
		this.HTMLElement.insertBefore(this.titlebar, this.HTMLElement.firstChild);
		dragElement(this.HTMLElement, true);
		this.titlebar.innerHTML = '<div class="windowControls"><div class="closeButton" onclick="dockApps[' + options.app + '].close(this);"></div><div class="minimizeButton"><img src="images/minimize.svg"/></div><div class="fullscreenButton"><img src="images/fullscreen.svg"/></div></div><span class="windowTitle">' + options.title + '</span>';
	} else {
		dragElement(this.HTMLElement, false);
	}

	document.body.appendChild(this.HTMLElement);
	return this;
}

function NSToolbar(options) {
	this.HTMLElement = document.createElement("div");
	this.HTMLElement.setAttribute("class", "toolbar");
	for (var i = 0; i < options.items.length; i++) {
		this.HTMLElement.innerHTML += options.items[i];
	}
	this.HTMLElement.appendChild(toolbar);
	if (options.title) {
		this.HTMLElement.setAttribute("class", "titlebarThick titled");
	} else {
		this.HTMLElement.setAttribute("class", "titlebarThick");
	}
	if (options.tabs) {
		this.HTMLElement.classList.add("tabbed");
	}
	return this;
}

function NSButton(options) {
	if (options.type == NSToolbarSpace) {
		this.HTMLElement = document.createElement("div");
		this.HTMLElement.classList.add("toolbarspace");
	} else {
		this.HTMLElement = document.createElement("a");
		this.HTMLElement.href = "javascript:void(0);";
		switch (options.type) {
			case NSSymbolButtonType:
				this.HTMLElement.classList.add("toolbarbutton");
				this.HTMLElement.classList.add("f7-icons");
				this.HTMLElement.setAttribute("onclick", options.action);
				break;
			case NSImageType:
				this.HTMLElement.innerHTML = options.image;
				break;
		}
		try {
			this.HTMLElement.classList.add(options.externalClasses);
		} catch (e) { }
		this.HTMLElement.innerHTML = options.title;
	}
	return this;
}

function NSSpacerElement(options) {
	this.HTMLElement = document.createElement("div");
	this.HTMLElement.classList.add("toolbarspace");
	return this;
}

function NSImage(options) {
	this.HTMLElement = document.createElement("img");
	this.HTMLElement.src = options.src;
}

function NSDockTile(options) {
	this.path = options.path;
	this.name = options.name;
	this.icon = options.icon;
	this.HTMLElement = document.createElement("div");
	this.HTMLElement.classList = "docktile tooltip";
	if (options.type == "app") {
		this.HTMLElement.onclick = function () {
			this.classList.add("launching");
			kernel.exec(options.path);
		}
		this.HTMLElement.innerHTML = '<span class="tooltiptext">' + options.name + '</span><img src="' + options.path + "/Contents/Resources/" + options.icon + '/icon_128x128.png" \/>';
	} else {
		this.HTMLElement.onclick = function () {
			kernel.exec(options.path);
		}
		this.HTMLElement.innerHTML = '<span class="tooltiptext">' + options.name + '</span><img src="' + options.icon + '/icon_128x128.png" \/>';
	}

	return this;
}