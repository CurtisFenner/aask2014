"use strict";


function Main() {
	var event = new FRCEvent(eventURL,"TEST",
		function(event) {
		var analyze = new Analyze(event);

		if (analyze.message) {
			bigtableplace.innerHTML = "<strong style=color:red>" + analyze.message + "</strong>";
			return;
		}

		var data = []; //list of rows.
		//Team	Rank	Auton	Truss	Assist	Teleop	OPR	CCWM	DPR	Seed
		for (var i = 0; i < analyze.teams.length; i++) {
			var u = [analyze.teams[i], i+1];
			for (var j = 0; j < analyze.expected.length; j++) {
				u.push(parseFloat(analyze.expected[j].get(i,0).toFixed(1)));
			}
			u.push(analyze.ccwm.get(i,0).toFixed(1));
			u.push(analyze.QS[i]);
			data.push(u);
		}

		var tab = table.make(
			[eventName + "(Analysis)",
				[["<em>FIRST</em> Data*",["Team","Rank"]] ,
				["Direct Calculations<sup>†</sup>",["Auton","Truss/Catch","Assist","Other Teleop","OPR (Total)"]] ,
				["Indirect Calculations<sup>‡</sup>",["CCWM","Predicted QS"]]]
			],
			data,
			[false,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed],
			["increase","increase","decrease","decrease","decrease","decrease","decrease","decrease","decrease"],
			1
		);
		bigtableplace.innerHTML = "";
		tab.addSelf(document.getElementById("bigtableplace"));

		createDistributionGraph(analyze);
	});
}

function goToRankings(){
	window.open("http://www2.usfirst.org/" + eventURL + "rankings.html", "_self");
}

function goToSchedule(){
	window.open("http://www2.usfirst.org/" + eventURL + "matchresults.html", "_self");
}


function createDistributionGraph(an) {
	var oprs = an.expected[an.expected.length-1];
	var ccwms = an.ccwm.toSingleArray();
	var min = oprs[0];
	var max = oprs[0];
	for (var i = 0; i < an.teams.length; i++) {
		var exp = oprs[i];
		var ccw = ccwms[i];
		min = Math.min(exp,min);
		max = Math.max(exp,max);
		min = Math.min(ccw,min);
		max = Math.max(ccw,max);
	}

	max = Math.floor(max*0.11)*10;//roundPretty(winMax);
	min = Math.floor((min-Math.abs(min)*0.1)/10)*10;//roundPretty(winMin);


	var maxRange = 0;

	var oprmean = mean(oprs);
	var oprstd = std(oprs);
	var oprLine = normPDFRange(-100,200,oprmean,oprstd);

	for (var i = 0; i < oprLine.length; i++) {
		maxRange = Math.max(maxRange,oprLine[i][1]);
	}

	var ccwmmean = mean(ccwms);
	var ccwmstd = std(ccwms);
	var ccwmLine = normPDFRange(-100,200,ccwmmean,ccwmstd);
	for (var i = 0; i < oprLine.length; i++) {
		maxRange = Math.max(maxRange,ccwmLine[i][1]);
	}

	var graphDistro = document.getElementById("graphDistro").getContext("2d");

	plotAxis(graphDistro, min, max, 0, maxRange * 1.1, "", "","",true,true,true); //empty titles and no ticks so we don't double up text.
	graphDistro.lines = 0.5;
	plotCurve(graphDistro, oprLine , "#EE9999" , true);

	graphDistro.lines = 0.5;
	plotCurve(graphDistro, ccwmLine , "#9999EE" , true);

	plotAxis(graphDistro, min, max, 0, maxRange * 1.1, "", "","",true,true,true); //empty titles and no ticks so we don't double up text.

}