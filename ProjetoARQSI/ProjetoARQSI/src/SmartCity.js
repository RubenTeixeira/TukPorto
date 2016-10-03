var sensors = "http://phpdev2.dei.isep.ipp.pt/~nsilva/smartcity/sensores.php";
var xmlHttpObj;

function listSensors() {
    xmlHttpObj = createXmlHttpRequestObject();

    if (xmlHttpObj) {
        xmlHttpObj.open("GET", sensors, true);
        xmlHttpObj.onreadystatechange = stateHandler;
        xmlHttpObj.send(null);
    }
}


function stateHandler() {
    if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200) {
        var xmlDoc = xmlHttpObj.responseXML;
        createTabs(xmlDoc);
    }
}

function createXmlHttpRequestObject() {
    return new XMLHttpRequest();
}

function createTabs(xmlDoc) {   
    var sensor = xmlDoc.getElementsByTagName("sensores")[0];
    var sensorsList = sensor.childNodes;
    var p = 0;
    //var sensorsList = xmlDoc.getElementsByTagName("nome");
    var div = document.getElementById("sidebarleftside"); //retrieve sidebars left side
    var description = [];
    var list = document.createElement('ul'); //list
    list.className = "sidebarmenu";
    for (i = 0; i < sensorsList.length; i++) {
        if (sensorsList[i].nodeType === 1) { //only Elements Nodes
            var li = document.createElement('li');
            li.className = "sidebarmenulink";
            var a = document.createElement('a');
            description[p] = sensorsList[i].childNodes[1].childNodes[0].nodeValue;
            var text = document.createTextNode(description[p]);
            var ref = (p + 1).toString();
            var textref = "#" + ref + "sensor";
            a.href = textref; //append id
            a.id = textref; //append reference
            a.appendChild(text);
            p++;
            li.appendChild(a);
            list.appendChild(li);
        } else {
            //do nothing.
        }
    }
    div.appendChild(list);
    createFirstSensorTab();
    createSecondSensorTab();
}

function createFirstSensorTab() {
    var widget = document.getElementById("widget_vertical");
    /*new division*/
    var div = document.createElement("div");
    div.className = "sidebarrightside";
    div.id = "1sensor";
    var p = document.createElement("p");
    var text = document.createTextNode("Preferências");
    p.appendChild(text);
    div.appendChild(p);
    widget.appendChild(div);
}