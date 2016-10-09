var SENSOR_DESIGNATION = "sensor";
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

function requestFacets(sensorName) {
    var uri = facets_name_link;
    uri += sensorName;
    requestAJAX(uri, createFacets, RESPONSE_XML, sensorName);
}

function createTabs(xmlDoc) {
    var allSensors = xmlDoc.getElementsByTagName("nome");
    var div = document.getElementById("sidebarleftside");
    var ul = document.createElement("ul");
    ul.className = "sidebarmenu";
    var sensor;
    for (i = 0; i < allSensors.length; i++) {
        sensor = allSensors[i];
        var sensorName = sensor.childNodes[0].nodeValue;
        var sensorNameNode = document.createTextNode(sensorName.replace(/_/g, " "));
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

    // Get all elements with class="link" and remove the class "active"
    tablinks = document.getElementsByClassName("link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(sensorName + "_facets").style.display = "block";
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
    startDisplaySetting(facetsmenu, true);

}

function showFacetsMenu() {
    var facetsmenu = document.getElementById("facetsmenuid");
    changeDisplaySetting(facetsmenu);
}

function createFacets(facetsXML, sensorName) {
    var maindivison = document.getElementById("facetsmenuid");
    var facets = facetsXML.getElementsByTagName("Nome");
    var sensorFacetsDiv = document.createElement("div");
    sensorFacetsDiv.className = "tabcontent";
    sensorFacetsDiv.id = sensorName + "_facets";
    sensorFacetsDiv.style.display = "none";

    for (var i = 0; i < facets.length; i++) {
        var facetname = facets[i].childNodes[0].nodeValue;
        var div = document.createElement("div");
        div.className = "facetsdivision";
        div.id = facetname;
        var label = document.createElement("label");
        label.htmlFor = facetname + "_input_ID_" + sensorName;
        label.nodeValue = facetname;
        //disables text selection on double click.
        label.addEventListener('mousedown', function (e) { e.preventDefault(); }, false);
        var input = document.createElement("input");
        input.id = facetname + "_input_ID_" + sensorName;
        //input.name = facetname;
        input.type = "checkbox";
        input.onchange = function () {
            showComponent(this);
        }
        var text = document.createTextNode(facetname);
        label.appendChild(input);
        label.appendChild(text);
        div.appendChild(label);
        div.appendChild(checkFacetName(facetname)); //APPENDS DIV WITH CONTENT
        sensorFacetsDiv.appendChild(div);
    }
    maindivison.appendChild(sensorFacetsDiv);
}

function checkFacetName(facetname) {
    var emptydiv = document.createElement("div");
    var string = facetname;
    if (string.includes("Data")) {
        return createReadDate();
    } else if (string.includes("Hora")) {
        return createReadHour();
    } else if (string.includes("Temp")) {
        return createTemp();
    } else if (string.includes("Local")) {
        return createLocal();
    } else if (string.includes("GPS")) {
        return emptydiv; //TODO - method signature created below.
    } else if (string.includes("Preço")) {
        return emptydiv; //TODO - method signature created below.
    } else if (string.includes("Fonte")) {
        return emptydiv; //TODO - method signature created below.
    } else if (string.includes("Indicador")) {
        return emptydiv; //TODO - method signature created below.
    } else if (string.includes("Foto")) {
        return emptydiv; //TODO - method signature created below.
    } else if (string.includes("Valor")) {
        return emptydiv; //TODO - method signature created below.
    } else {
        return emptydiv;
    }
}

// DATA facet
function createReadDate() {
    var current = new Date();
    var d = current.getDate();
    var m = current.getMonth() + 1;
    var y = current.getFullYear();
    if (d < 10) {
        d = '0' + d
    }
    if (m < 10) {
        m = '0' + m
    }
    current = y + '-' + m + '-' + d;
    var div = document.createElement("div");
    div.className = "facetscontent";
    div.id = "datedivid";//DIV ID
    var form = document.createElement("form");
    var input = document.createElement("input");
    input.type = "date";
    input.name = "readDate";
    input.value = current;
    form.appendChild(input);
    div.appendChild(form);
    startDisplaySetting(div, false);
    return div;
}

// HORA facet
function createReadHour() {
    var current = new Date();
    var h = current.getHours();
    var m = current.getMinutes();
    if (h < 10) {
        h = '0' + h;
    }
    if (m < 10) {
        m = '0' + m;
    }
    current = h + ':' + m;
    var div = document.createElement("div");
    div.className = "facetscontent";
    div.id = "timedivid"; //DIV ID
    var form = document.createElement("form");
    var input = document.createElement("input");
    input.type = "time";
    input.name = "readTime";
    input.value = current;
    form.appendChild(input);
    div.appendChild(form);
    startDisplaySetting(div, false);
    return div;
}

// TEMPERATURA facet
function createTemp() {
    var div = document.createElement("div");
    div.className = "facetscontent";
    div.id = "tempdivid"; //DIV ID
    var div_ = document.createElement("div");
    div_.className = "facetscontent";
    var input = document.createElement("input");
    input.type = "range";
    input.style.width = "59%";
    input.name = "readTemp";
    input.id = "tempid";
    input.max = "100";
    input.min = "-100";
    input.value = "0";
    var text = document.createTextNode("-100ºC");
    var text_ = document.createTextNode("100ºC");
    var output = document.createElement("output");
    output.name = "out";
    output.htmlFor = "tempid";
    output.value = "0";
    output.style.position = "relative";
    output.style.left = "41.5%";
    var form = document.createElement("form");
    form.oninput = function () {
        output.value = parseInt(input.value);
    };
    form.appendChild(text);
    form.appendChild(input);
    form.appendChild(text_);
    div_.appendChild(output);
    div.appendChild(form);
    div.appendChild(div_);
    startDisplaySetting(div, false);;
    return div;
}

// LOCAL facet
function createLocal() {
    var distritos = ["Porto", "Braga"];
    //TODO - improper use of the object Array?
    //var distrito["Porto"] = "Amarante,Baião,Felgueiras";
    //var distrito["Braga"] = "Amares,Barcelos,Braga,Cabeceiras de Basto,Celorico de Basto,Esposende,Fafe,Guimarães,Póvoa de Lanhoso,Terras de Bouro,Vieira do Minho,Vila Nova de Famalicão,Vila Verde,Vizela";
    var div = document.createElement("div");
    div.className = "facetscontent";
    div.id = "localdivid"; //DIV ID
    var select1 = document.createElement("select");
    for (var i = 0; i < distritos.length; i++) {
        var string = distritos[i];
        var option = document.createElement("option");
        option.text = string;
        select1.add(option);
    }
    select1.name = "readLocal";
    div.appendChild(select1);
    startDisplaySetting(div, false);
    return div;
}

//GPS facet
function createGPS() {
    //TODO

}

//FONTE facet
function createFonte() {
    //TODO
}

//VALOR facet
function createValor() {
    //TODO
}

//FOTO facet
function createFoto() {
    //TODO
}

//INDICATOR facet
function createIndicator() {
    //TODO
}

//PRICE facet
function createPrice() {

}


function results() {
    var link = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/valoresFacetadoSensor.php?sensor=Temperatura&faceta=Temp";
    var link2 = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/valoresDeSensor.php?sensor=Temperatura&Data_de_leitura=[2016-09-03,2016-09-05]";
    var link3 = "http://phpdev2.dei.isep.ipp.pt/~arqsi/smartcity/valoresDeSensor.php?sensor=Temperatura&Data_de_leitura=2016-09-03&Local=Porto-Campanhã";
   // getResults(link2);

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
    divLocation.style.overflow = 'auto';
    var resultObj = JSON.parse(txtDocument);


    var div = document.createElement("div");
    var table = document.createElement("table");
    var tableHeaderRow = document.createElement("tr");

    var names = Object.getOwnPropertyNames(resultObj[0]);
    for (var i = 0; i < names.length; i++) {
        var th = document.createElement("th");
        var text = document.createTextNode(names[i]);
        th.appendChild(text);
        tableHeaderRow.appendChild(th);
    }

    table.appendChild(tableHeaderRow);
    for (var i = 0; i < resultObj.length; i++) {
        var singleObj = resultObj[i];
        var tr = document.createElement("tr");
        for (var j in singleObj) {
            var td = document.createElement("td");
            var text = document.createTextNode(singleObj[j]);
            td.appendChild(text);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    div.appendChild(table);
    styleTable(div);
    divLocation.appendChild(div);


}

function styleTable(div) {
    var table = div.getElementsByTagName('table');
    table[0].style.borderCollapse = 'collapse';
    table[0].style.border = '1px solid #ddd';

    var tds = div.getElementsByTagName('td');
    for (var i = 0; i < tds.length; i++) {
        var td = tds[i];
        td.style.padding = '15px';
        td.style.border = '1px solid #ddd';

    }

    var trs = div.getElementsByTagName('tr');
    for (var i = 0; i < trs.length; i++) {
        var tr = trs[i];

        tr.style.border = '1px solid #ddd';
    }

    var ths = div.getElementsByTagName('th');
    for (var i = 0; i < ths.length; i++) {
        var th = ths[i];
        th.style.padding = '15px';
        th.style.background = '#1F75ff';
        th.style.color = 'white';
        th.style.border = '1px solid #ddd';
    }

}

//AUX
//Auxiliary Function
function startDisplaySetting(div, flag) {
    if (flag == true) {
        div.style.transition = "opacity 0.7s ease-out";
        div.style.visibility = "visible";
        div.style.height = "auto";
        div.style.opacity = "1";
    } else {
        div.style.visibility = "hidden";
        div.style.height = "0";
        div.style.opacity = "0";
    }
}

//Auxiliary Function
function changeDisplaySetting(div) {
    if (div.style.visibility == "visible") {
        div.style.opacity = "0";
        div.style.visibility = "hidden";
        div.style.height = "0";
    } else {
        div.style.transition = "opacity 0.7s ease-out";
        div.style.height = "auto";
        div.style.visibility = "visible";
        div.style.opacity = "1";
    }
}

//Auxiliary Function
function showComponent(input) {
    var label = input.parentElement;
    var div = label.parentElement;
    var insidediv = div.childNodes[1];
    changeDisplaySetting(insidediv);
}