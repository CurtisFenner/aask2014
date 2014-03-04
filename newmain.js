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

		console.log(data);

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
	});
	console.log("BEGIN");
}