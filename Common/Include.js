function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("html-include");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            var template = document.createElement('div');
            template.innerHTML = this.responseText.trim();
            if (file == "/Common/Header.html") {
              try {
                var loc = window.location.pathname.replace(/[\\\/][^\\\/]*$/, '');
                if (loc == "") {
                  loc = "/";
                }
                var links = template.querySelectorAll('[href="' + loc + '"]');
                for (var i = 0; i < links.length; i++) {
                  links[i].classList += " active";
                  links[i].href = "#";
                  console.log(links[i].href);
                }
              } catch (e) { }
            }
            elmnt.parentNode.replaceChild(template.firstChild, elmnt);
          }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("html-include");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}
includeHTML();