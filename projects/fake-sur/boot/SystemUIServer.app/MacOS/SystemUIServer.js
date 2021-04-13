function padDigits(number, digits) {
	return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}






var dockApps = [
	{
		name: "Finder",
		menus: ["File", "Edit", "View", "Go", "Window", "Help"],
		run: function () {
			activeApp = 0;
			loadMenubar();
		},
		open: function (path) {
			dockApps[0].run();
			alert(path);
		}
	},
	{
		name: "Calendar",
		menus: ["File", "Edit", "View", "Window", "Help"],
		run: function () {
			activeApp = 1;
			loadMenubar();
		}
	},
	{
		name: "System Preferences",
		menus: ["File", "Edit", "View", "Window", "Help"],
		run: function () {
			activeApp = 2;
			if (document.body.classList.contains('dark')) {
				document.body.classList.remove('dark');
			} else {
				document.body.classList.add('dark');
			}
			loadMenubar();
			document.querySelector('[src="images/apps/SystemPreferences.png"]').parentElement.classList.remove("launching");
		}
	},
	{
		name: "Safari",
		menus: ["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"],
		run: function () {
			activeApp = 3;
			NSWindow({
				size: "maximize",
				titlebar: true,
				title: "",
				app: 3,
				toolbar: ['<a href="javascript:void(0);" class="toolbarbutton f7-icons">sidebar_left</a>', '<a href="javascript:void(0);" class="toolbarbutton adjl f7-icons" onclick="document.getElementById(\'safariwebview\').contentWindow.history.go(-1);">chevron_left</a>', '<a href="javascript:void(0);" class="toolbarbutton adjr f7-icons" onclick="document.getElementById(\'safariwebview\').contentWindow.history.go(1);">chevron_right</a>', '<div class="toolbarspace"></div>', '<a href="javascript:void(0);" class="toolbarbutton f7-icons">shield_lefthalf_fill</a>', '<form id="smartsearchform" style="max-width: 800px; width: 100%;"><input style="width: 100%; height: 100%;" type="text" name="smartsearch" id="smartsearch" onclick="this.select();" onblur="document.getSelection().removeAllRanges();" placeholder="Search or enter website name"/></form>', '<div class="toolbarspace"></div>', '<a href="javascript:void(0);" class="toolbarbutton f7-icons">square_arrow_up</a>', '<a href="javascript:void(0);" class="toolbarbutton f7-icons">plus</a>', '<a href="javascript:void(0);" class="toolbarbutton f7-icons">square_on_square</a>'],
				tabs: true,
				view: '<iframe id="safariwebview" name="viewer" class="contentView" src="https://techlabsinc.github.io/" style="width: 100%; height: calc(100% - 55px); border: none;"></iframe>'
			});
			document.getElementById("smartsearchform").onsubmit = function (e) {
				e.preventDefault();
				document.getElementById("smartsearch").blur();
				var webView = document.getElementById("safariwebview");
				var searchQuery = document.getElementById("smartsearch").value;
				if (!searchQuery.startsWith("http") && !searchQuery.startsWith("file://")) {
					searchQuery = "https://" + searchQuery;
				}
				webView.setAttribute("src", searchQuery);
			}
			loadMenubar();
			document.querySelector('[src="images/apps/Safari.png"]').parentElement.classList.remove("launching");
		},
		close: function (t) {
			t.parentElement.parentElement.parentElement.remove();
		}
	},
	{
		name: "Preview",
		menus: ["File", "Edit", "View", "Window", "Help"],
		run: function () {
			activeApp = 4;
			loadMenubar();
		}
	},
	{
		name: "TextEdit",
		menus: ["File", "Edit", "Format", "View", "Window", "Help"],
		run: function () {
			activeApp = 5;
			NSWindow({ size: [550, 468], position: "center", titlebar: true, title: "Untitled", app: 5, view: '<textarea class="contentView" style="width:100% !important;height: calc(100% - 31px) !important; border: none; font-size: 12px; resize: none; overflow-y: scroll;"></textarea>' });
			loadMenubar();
			document.querySelector('[src="images/apps/TextEdit.png"]').parentElement.classList.remove("launching");
		},
		close: function (t) {
			t.parentElement.parentElement.parentElement.remove();
		}
	},
	{
		name: "Contacts",
		menus: ["File", "Edit", "View", "Window", "Help"],
		run: function () {
			activeApp = 6;
			loadMenubar();
		}
	},
	{
		name: "Launchpad",
		menus: ["File", "Edit", "View", "Window", "Help"],
		run: function () {
			activeApp = 7;
			loadMenubar();
		}
	},
	{
		name: "Messages",
		menus: ["File", "Edit", "View", "Window", "Help"],
		run: function () {
			activeApp = 8;
			loadMenubar();
		}
	},
	{
		name: "Maps",
		menus: ["File", "Edit", "View", "Window", "Help"],
		run: function () {
			activeApp = 9;
			loadMenubar();
		}
	}
];
var dockFiles = [
	{
		name: "Trash",
		state: "Full",
		path: "/.Trash"
	}
];
var statusbarItems = [[1, "speaker_3_fill"], [1, "battery_100"], [1, "wifi"], [1, "search"]];

function dockHover(e) {
	if (document.onmousemove == null) {
		document.onmousemove = dockmove;
	}
	function dockmove(e) {
		e = e || window.event;
		for (var i = 0; i < dock.children.length; i++) {
			if (dock.children[i] != document.getElementById('dockseparator')) {
				TweenLite.to(dock.children[i], 0.2, { width: Math.max(((128 - 83) * Math.cos(0.005 * ((dock.children[i].getBoundingClientRect().left + (dock.children[i].clientWidth / 2)) - e.clientX))) + 83, 83) });
			}
		}
	}
}

function unDockHover() {
	for (var i = 0; i < dock.children.length; i++) {
		if (dock.children[i] != document.getElementById('dockseparator')) {
			TweenLite.to(dock.children[i], 0.2, { width: 83 });
		}
	}
	document.onmousemove = null;
}

function loadDock() {
	for (var i = 0; i < dockApps.length; i++) {
		dock.innerHTML += '<div class="docktile tooltip" onclick="this.classList.add(\'launching\'); dockApps[' + i + '].run();"><span class="tooltiptext">' + dockApps[i].name + '</span><img src="images/apps/' + dockApps[i].name.replace(/\s/g, "") + '.png"/></div>';
	}
	dock.innerHTML += '<div id="dockseparator"></div>'
	for (var i = 0; i < dockFiles.length; i++) {
		dock.innerHTML += '<div class="docktile tooltip" onclick="dockApps[0].open(\'' + dockFiles[i].path + '\');"><span class="tooltiptext">' + dockFiles[i].name + '</span><img src="images/apps/' + dockFiles[i].name.replace(/\s/g, "") + dockFiles[i].state + '.png"/></div>';
	}
	setTimeout(function () { dock.style.bottom = "5px"; }, 250);
}


function loadMenubar() {
	var mainMenuLength = dockApps[activeApp].menus.length;
	menubar.innerHTML = '<a class="menu f7-icons" href="javascript:void(0);">logo_apple</a>';
	menubar.innerHTML += '<a class="menu" href="javascript:void(0);">' + dockApps[activeApp].name + '</a>';
	for (var i = 0; i < mainMenuLength; i++) {
		menubar.innerHTML += '<a class="menu" href="javascript:void(0);">' + dockApps[activeApp].menus[i] + '</a>';
	}
	menubar.innerHTML += '<div id="statusbar"></div>';
	var statusbar = document.getElementById("statusbar");

	var statusbarLength = statusbarItems.length;
	for (var i = 0; i < statusbarLength; i++) {
		if (statusbarItems[i][0] == 1) {
			statusbar.innerHTML += '<a class="menu f7-icons"  href="javascript:void(0);">' + statusbarItems[i][1] + '</div>';
		} else {
			statusbar.innerHTML += '<a class="menu"  href="javascript:void(0);">' + statusbarItems[i][1] + '</div>';
		}
	}
	statusbar.innerHTML += '<a class="menu" id="datetime"  href="javascript:void(0);"></div>';
	refreshDate();
}

var timeSep = ":";
var timerefresh;
function refreshDate() {
	var menuitem = document.getElementById("datetime");
	var tm = new Date();
	menuitem.innerHTML = (tm.toDateString().split(tm.getFullYear(), 1)[0].slice(0, 7)) + " " + tm.getDate() + "&nbsp;&nbsp;" + (tm.getHours() % 12 || 12) + timeSep + padDigits(tm.getMinutes(), 2) + " " + tm.toLocaleString().slice(-2);
	if (timeSep == ":") {
		timeSep = " ";
	} else {
		timeSep = ":";
	}
	try {
		clearTimeout(timerefresh);
	} catch (e) { }
	timerefresh = setTimeout(refreshDate, 1000);
}


document.body.innerHTML += '<div class="desktop"><div id="menubar"></div><div id="dock"></div></div>';
var activeApp = 0;
var menubar = document.getElementById("menubar");
var dock = document.getElementById("dock");
var appLength = dockApps.length;
TweenLite.to(document.getElementById("bootScreen"), 0.1, { opacity: 0 });
setTimeout(function () {
	document.getElementById("bootScreen").parentElement.removeChild(document.getElementById("bootScreen"));
	TweenLite.set(dock.children, { width: 83 });
	dock.onmouseenter = dockHover;
	dock.onmouseleave = unDockHover;
	loadMenubar();
	loadDock();
}, 500);