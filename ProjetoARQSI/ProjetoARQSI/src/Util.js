/*******************
 DIV VISIBILTY
 ********************/

		function showComponent(input) {
			var label = input.parentElement;
			var div = label.parentElement;
			var insidediv = div.childNodes[1];
			changeDisplaySetting(insidediv);
		}

function startDisplaySetting(div, flag) {
    if (flag == true) {
        div.style.overflow = "hidden";
		div.style.transition = "opacity 0.7s ease-out";
		div.style.visibility = "visible";
		div.style.height = "auto";
		div.style.opacity = "1";
    } else {
        div.style.overflow = "hidden";
		div.style.visibility = "hidden";
		div.style.height = "0";
		div.style.opacity = "0";
	}
}

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

/*************************
 ELEMENT CREATORS
 **************************/
function createCheckBox(divClass, divID, labelText, inputID, inputName,facetObj) {
	var div = document.createElement("div");
	div.className = divClass;
	div.id = divID;
	var label = document.createElement("label");
	label.htmlFor = inputID;
	label.nodeValue = labelText;
	//disables text selection on double click.
	label.addEventListener('mousedown', function (e) {
		e.preventDefault();
	}, false);
	var input = document.createElement("input");
	input.id = inputID;
	input.name = inputName;
	input.type = "checkbox";
	input.onchange = function () {
	    showFacetOptions(div, facetObj);
	};
	var text = document.createTextNode(labelText);
	label.appendChild(input);
	label.appendChild(text);
	div.appendChild(label);
	return div;
}

/***************************
 DATE UTILS
 ****************************/

function getCurrentDateForm() {
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
	var form = document.createElement("form");
	var input = document.createElement("input");
	input.type = "date";
	input.value = current;
	form.appendChild(input);
	return form;
}

function getCurrentHourForm() {
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
	var form = document.createElement("form");
	var input = document.createElement("input");
	input.type = "time";
	input.name = "readTime";
	input.value = current;
	form.appendChild(input);
	return form;
}

/************************
 ELEMENT STYLING
 *************************/

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