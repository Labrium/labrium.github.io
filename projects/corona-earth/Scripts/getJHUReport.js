function csvJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return JSON.stringify(result);
}

function checkUrl(url) {
    var request = false;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest;
    } else if (window.ActiveXObject) {
        request = new ActiveXObject("Microsoft.XMLHttp");
    }

    if (request) {
        request.open("GET", url);
        if (request.status == 200) { return true; }
    }

    return false;
}

function readJSONFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    //rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function strDate(d) {
    var date = "";
    if (d.getMonth() > 8) {
        date += d.getMonth() + 1;
    } else {
        date += '0' + (d.getMonth() + 1);
    }
    date += '-';
    if (d.getDate() > 9) {
        date += d.getDate();
    } else {
        date += '0' + d.getDate();
    }
    date += '-' + d.getFullYear();
    return date;
};

function getJHUReport(callback) {
    var dataURL;
    var d1 = new Date();
    var d2 = new Date();
    d2.setDate(d2.getDate() - 1);
    dataURL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" + strDate(d1) + ".csv";
    if (checkUrl(dataURL)) {
        return;
    } else {
        dataURL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" + strDate(d2) + ".csv";
    }
    readJSONFile(dataURL, callback);
}