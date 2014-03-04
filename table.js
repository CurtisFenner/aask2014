var table = {};
	function colWidth(x) {
		if (typeof x == "string") {
			return 1;
		}
		var s = 0;
		for (var i = 0; i < x[1].length; i++) {
			s += colWidth(x[1][i]);
		}
		return s;
	}



table.make = function(header,data,decorators,orders,sortBy) {
	sortBy = sortBy || 0;
	var dp = [];
	for (var i = 0; i < data.length; i++) {
		dp[i] = data[i];
	}
	data = dp; // masking so that we can sort it
	var height = data.length;
	var r = {};
	r.header = header;
	var levelCount = 0;
	function addBuild(v) {
		var ps = [v];
		var build = [];
		var ocount = colWidth(v);
		var count = ocount;
		while (ps.length > 0) {
			var k = ps.splice(0,1)[0];		
			if (typeof k != "string") {
				build.push([k[0],colWidth(k),k[2]]);
				count -= colWidth(k);
				// its children follow
				for (var i = 0; i < k[1].length; i++) {
					ps.push(k[1][i]);
				}
			} else {
				build.push([k,1]);
				count -= 1;
			}

			if (count <= 0) {
				count = ocount;
				build.push("*");
				levelCount++;
			}
		}
		return build;
	}
	var columnCount = 0;
	r.build = addBuild(header);
	r.columns = {};
	var thisLevel = 1;
	for (var i = 0; i < r.build.length; i++) {
		if (r.build[i] == "*") {
			thisLevel++;
			continue;
		}
		if (thisLevel == levelCount) {
			var name = r.build[i][0].toLowerCase().replace(/[^a-zA-Z]+/g,"_");
			r.columns[name] = [];
			r.columns[columnCount] = r.columns[name];
			columnCount++;
		}
	}
	r.compare = {};
	// construct the header, now
	r.element = document.createElement("table");
	var head = document.createElement("thead");
	r.element.appendChild(head);
	var thisRow = document.createElement("tr");
	var titles = [];
	var rowTitle = [];
	for (var i = 0; i < r.build.length; i++) {
		var c = r.build[i];
		if (c == "*") {
			titles.push(rowTitle);
			rowTitle = [];
			head.appendChild(thisRow);
			thisRow = document.createElement("tr");
			rowTitle.tr = thisRow;
			continue;
		}
		var label = document.createElement("td");
		rowTitle.push(label);
		label.colSpan = r.build[i][1];
		label.innerHTML = r.build[i][0];
		if (r.build[i][2]) {
			for (p in r.build[i][2]) {
				label.style[p] = r.build[i][2][p];
			}
		}
		thisRow.appendChild(label);
	}
	r.addSelf = function(to) {
		to.appendChild(r.element);
	}
	r.bodyElement = document.createElement("tbody");
	r.element.appendChild(r.bodyElement);
	r.bodyElements = [];
	r.rowElements = [];
	r.columnCount = columnCount;
	for (var i = 0; i < data.length; i++) {
		r.bodyElements[i] = [];
		var row = document.createElement("tr");
		r.bodyElement.appendChild(row);
		r.rowElements[i] = row;
		for (var j = 0; j < columnCount; j++) {
			r.bodyElements[i][j] = document.createElement("td");
			row.appendChild(r.bodyElements[i][j]);
			//r.columns[j][i] = data[i][j];
			//r.bodyElements[i][j].innerHTML = r.columns[i][j];
		}
	}
	function render() {
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < data[i].length; j++) {
				r.bodyElements[i][j].innerHTML = data[i][j];
				if (decorators[j]) {
					var place = 0;
					for (var k = 0; k < data.length; k++) {
						if (data[k][j] >= data[i][j]) {
							place++;
						}
					}
					if (orders[j] == "increase") {
						place = data.length - 1 - place;
					}
					var p = decorators[j](place / (data.length-1));
					r.bodyElements[i][j].style.backgroundColor = p;
				} else {
					r.bodyElements[i][j].style.backgroundColor = "#EEE";
				}
			}
		}
	}
	render();
	var sortedBody = -1;
	function sortByColumn(c) {
		var m = orders[c] == "increase" ? 1 : -1;
		if (sortedBody == c) {
			sortedBody = -1;
			m *= -1;
		} else {
			sortedBody = c;
		}
		data.sort(function(a,b) {
			return (a[c] - b[c]) * m;
		});
		// sort the data! woo
		render();
	}
	for (var i = 0; i < titles.length; i++) {
		for (var j = 0; j < titles[i].length; j++) {
			titles[i][j].style.background= "#F9F9F9";
			//titles[i][h].style.color = "#FFF";
		}
	}
	for (var i = 0; i < titles[titles.length-1].length; i++) {
		(function() {
			var m = i;
			titles[titles.length-1][i].onmousedown = function(e) {
			sortByColumn(m);
		}})();

		titles[titles.length-1][i].style.cursor = "pointer";
		titles[titles.length-1][i].style.textDecoration = "underline";
	}
	sortByColumn(sortBy);
	return r;
}

function cssRGB(r,g,b) {
	return "rgb(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) +")";
}

function lerp(a,b,x) {
	return a * (1-x) + b * x;
}

function gradientGreenToRed(prop) {
	// red = 227, 137, 147
	// yellow = 247, 247, 137
	// green = 157, 227, 167
	if (prop < 0.5) {
		prop *= 2;
		return cssRGB(lerp(157,247,prop),lerp(227,247,prop),lerp(167,137,prop));
	}
	prop = 2 * (prop - 0.5);
	return cssRGB(lerp(247,227,prop),lerp(247,137,prop),lerp(137,147,prop));
}
function flatGrey() {
	return cssRGB(238,238,238);
}