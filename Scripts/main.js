function finishLoad() {
    var loader = document.getElementById("loader");
    var page = document.getElementById("content");
    loader.style.display = "none";
    page.style.display = "block";
  }

function menuRespond() {
    var hamburger = document.getElementById("hamburger");
    var navbar = document.getElementById("myTopnav");
    if (navbar.className === "topnav") {
      navbar.className += " responsive";
      hamburger.className = "icon fa fa-close";
    } else {
      navbar.className = "topnav";
      hamburger.className = "icon fa fa-bars";
    }
  }

function searchShow() {
  var searchbar = document.getElementById("searchbar");
  if (searchbar.style.display === "none") {
    searchbar.style.display = "block";
  } else {
    searchbar.style.display = "none";
  }
}

function dropdownShow() {
  var dropdown = document.getElementById("dropcontent");
  var dropbutton = document.getElementById("dropbutton");
  if (dropdown.style.display === "none") {
    dropdown.style.display = "block";
    dropbutton.innerHTML = "Quick Links <span class='fa fa-caret-up'></span>"
  } else {
    dropdown.style.display = "none";
    dropbutton.innerHTML = "Quick Links <span class='fa fa-caret-down'></span>"
  }
}


//Dev-Tools
function edit() {
  var pageEditor = document.getElementById("pageEditor");
  pageEditor.contentWindow.document.designMode = "on";
}
function done() {
  var pageEditor = document.getElementById("pageEditor");
  var editCode = document.getElementById("editCode");
  pageEditor.contentWindow.document.designMode = "off";
  editCode.textContent = pageEditor.contentWindow.document.body.innerHTML;
}

function updateIframe() {
  var page2 = document.getElementById("pageEditor");
  var settings = document.forms["settings"];
  switch (settings["device"].Value) {
    case "desktop": page2.className = "desktop"; break;
    case "laptop": page2.className = "laptop"; break;
    case "tablet": page2.className = "tablet"; break;
    case "phone": page2.className = "phone"; break;
  }
}

//cookies
function bakeCookie(Name, Value, Expiration) {
  var ExpDate = new Date();
  if (Expiration != null) {
    ExpDate.getDate.setDate(ExpDate.getDate() + Expiration);
    var CookieValue = escape(Value) + "; expires=" + ExpDate.toUTCString();
    document.cookie = Name + "=" + CookieValue;
  }
}

function tasteCookie(Name) {
  var Cookies = document.cookie.split(";");
  for (var i = 0; i < Cookies.length; i++) {
    var CName = Cookies[i].substr(0, Cookies[i].indexOf("="));
    var CValue = Cookies[i].substr(Cookies[i].indexOf("=") + 1);
    CName = CName.replace(/^\s+|\s+$/g, "");
    if (Name == CName) {
      return unescape(CValue);
    }
  }
  return null;
}