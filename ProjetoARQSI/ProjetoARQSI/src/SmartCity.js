﻿var SENSOR_DESIGNATION = "sensor";
var FACET_DESIGNATION = "faceta";
var sensorsAPI = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/sensores.php";
var facets_ID_link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/facetas.php?" + SENSOR_DESIGNATION + "=";
var facets_name_link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/facetasByNomeSensor.php?" + SENSOR_DESIGNATION + "=";
var facets_values_link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/valoresFacetadoSensor.php?";
var RESPONSE_XML = 1;
var RESPONSE_TEXT = 2;


function listSensors() {
    requestAJAX(sensorsAPI, createTabs, RESPONSE_XML, null);
}

function requestAJAX(uri, handler, responseType, extraParam) {
    var xmlHttpObj = createXmlHttpRequestObject();

    if (xmlHttpObj) {
        xmlHttpObj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                if (responseType == RESPONSE_XML) {
                    if (extraParam == null) {
                        handler(xmlHttpObj.responseXML);
                    } else {
                        handler(xmlHttpObj.responseXML, extraParam);
                    }
                } else if (responseType == RESPONSE_TEXT) {
                    if (extraParam == null)
                        handler(xmlHttpObj.responseText);
                    else
                        handler(xmlHttpObj.responseText, extraParam);
                }
            }
        };
        xmlHttpObj.open("GET", uri, true);
        xmlHttpObj.send(null);
    }
}

function createXmlHttpRequestObject() {
    return new XMLHttpRequest();
}


function createTabs(xmlDoc) {
    var allSensors = xmlDoc.getElementsByTagName("nome");
    var div = document.getElementById("sidebarleftside"); //retrieve sidebars left side
    var ul = document.createElement("ul");
    ul.className = "sidebarmenu";
    var sensor;
    for (i = 0; i < allSensors.length; i++) {
        sensor = allSensors[i];
        var sensorName = sensor.childNodes[0].nodeValue;
        var sensorNameNode = document.createTextNode(sensorName.replace (/_/g," "));
        var a = document.createElement("a");
        a.appendChild(sensorNameNode);
        a.href = "#";
        a.className = "link";
        a.setAttribute("onclick", "showFacetsFromSensor(event, \"" + sensorName + "\")");
        var li = document.createElement("li");
        li.className = "sidebarmenulink";
        li.appendChild(a);
        ul.appendChild(li);
        div.appendChild(ul);
        // For each sensor we're adding as a tab, we need to
        // create a tabcontent DIV on the webpage which will be hidden by default
        requestFacets(sensorName);
    }
    return allSensors.length;
}

function showFacetsFromSensor(evt, sensorName) {
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="sidebarmenulink" and remove the class "active"
    tablinks = document.getElementsByClassName("sidebarmenulink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(sensorName+"_facets").style.display = "block";
    evt.currentTarget.className += " active";

    var facetsmenu = document.getElementById("facetsmenuid");
    if (facetsmenu.style.visibility == "hidden") {
        facetsmenu.style.transition = "opacity 0.7s ease-out";
        facetsmenu.style.height = "auto";
        facetsmenu.style.visibility = "visible";
        facetsmenu.style.opacity = "1";
    }
}

function setFacetsMenu() {
    var facetsmenu = document.getElementById("facetsmenuid");
    facetsmenu.style.visibility = "hidden";
    facetsmenu.style.height = "0";
    facetsmenu.style.opacity = "0";
}

function showFacets() {
    var facetsmenu = document.getElementById("facetsmenuid");
    if (facetsmenu.style.visibility == "visible") {
        facetsmenu.style.opacity = "0";
        facetsmenu.style.visibility = "hidden";
        facetsmenu.style.height = "0";
    } else {
        facetsmenu.style.transition = "opacity 0.7s ease-out";
        facetsmenu.style.height = "auto";
        facetsmenu.style.visibility = "visible";
        facetsmenu.style.opacity = "1";
    }
}


function requestFacets(sensorName) {
    var uri = facets_name_link;
    uri += sensorName;
    requestAJAX(uri, createFacets, RESPONSE_XML, sensorName);
}

function createFacets(facetsXML, sensorName) {
    var maindivison = document.getElementById("facetsmenuid");
    var facets = facetsXML.getElementsByTagName("Nome");
    var sensorFacetsDiv = document.createElement("div");
    sensorFacetsDiv.className = "tabcontent";
    sensorFacetsDiv.id = sensorName+"_facets";
    sensorFacetsDiv.style.display = "none";

    for (var i = 0; i < facets.length; i++) {
        var facetname = facets[i].childNodes[0].nodeValue;
        var div = document.createElement("div");
        div.className = "facetsdivision";
        div.id = facetname;
        var label = document.createElement("label");
        label.htmlFor = facetname + "_input_ID_"+sensorName;
        label.nodeValue = facetname;
        var input = document.createElement("input");
        input.id = facetname + "_input_ID_"+sensorName;
        //input.name = facetname;
        input.type = "checkbox";
        var text = document.createTextNode(facetname);
        label.appendChild(input);
        label.appendChild(text);
        div.appendChild(label);
        sensorFacetsDiv.appendChild(div);
    }
    maindivison.appendChild(sensorFacetsDiv);
}

function results() {
    var link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/valoresFacetadoSensor.php?sensor=Temperatura&faceta=Temp";
    //getResults(link);

}

function getResults(link) {
    var httpObj = createXmlHttpRequestObject();

    if (httpObj) {
        httpObj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                return showResults(httpObj.responseText);
            }
        };
        httpObj.open("GET", link, true);
        httpObj.send();
    }
}

function showResults(txtDocument) {
    
    var divLocation = document.getElementById("widget_horizontal");
    var resultObj = JSON.parse(txtDocument);
    var div = document.createElement("div");
    var table = document.createElement("table");
    table.style.border = "1px solid black";
    
    for (var j = 0; j < 4; j++) {
        var tr = document.createElement("tr");
        //tr.style.border = "1px solid black";
        for (var i = 0; i < resultObj.length; i++) {
            var td = document.createElement("td");
            td.style.border = "1px solid black";
            var text = document.createTextNode(resultObj[i]);
            td.appendChild(text);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
   
    div.appendChild(table);
    divLocation.appendChild(div);
    
}