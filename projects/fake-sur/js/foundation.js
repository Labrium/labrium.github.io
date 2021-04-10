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

function NSWindow(options) {
    var windowBase = document.createElement("div");
    if (options.position == "center") {
        windowBase.style.left = ((window.innerWidth / 2) - (options.size[0] / 2)) + "px";
        windowBase.style.top = ((window.innerHeight / 2) - (options.size[1] / 2)) + "px";
        windowBase.style.width = options.size[0] + "px";
        windowBase.style.height = options.size[1] + "px";
    } else if (options.size == "maximize") {
        windowBase.style.width = window.innerWidth + "px";
        windowBase.style.height = ((window.innerHeight - 31) - document.getElementById('dock').offsetHeight) + "px";
        windowBase.style.top = "25px";
        windowBase.style.left = "0px";
    } else {
        windowBase.style.left = options.position[0] + "px";
        windowBase.style.top = options.position[1] + "px";
        windowBase.style.width = options.size[0] + "px";
        windowBase.style.height = options.size[1] + "px";
    }
    windowBase.setAttribute("class", "window");

    try {
        windowBase.innerHTML += options.view;
    } catch (e) { }

    if (options.titlebar) {
        var titlebar = document.createElement("div");
        titlebar.setAttribute("class", "titlebar");
        windowBase.insertBefore(titlebar, windowBase.firstChild);
        dragElement(windowBase, true);
        titlebar.innerHTML = '<div class="windowControls"><div class="closeButton" onclick="dockApps[' + options.app + '].close(this);"></div><div class="minimizeButton"><img src="images/minimize.svg"/></div><div class="fullscreenButton"><img src="images/fullscreen.svg"/></div></div><span class="windowTitle">' + options.title + '</span>';
        if (options.toolbar) {
            var toolbar = document.createElement("div");
            toolbar.setAttribute("class", "toolbar");
            for (var i = 0; i < options.toolbar.length; i++) {
                toolbar.innerHTML += options.toolbar[i];
            }
            titlebar.appendChild(toolbar);
            if (options.title) {
                titlebar.setAttribute("class", "titlebarThick titled");
            } else {
                titlebar.setAttribute("class", "titlebarThick");
            }
            if (options.tabs) {
                titlebar.classList.add("tabbed");
            }
        }
    } else {
        dragElement(windowBase, false);
    }

    document.body.appendChild(windowBase);
    return windowBase;
}