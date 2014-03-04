"use strict";

var analyze;

function Main() {
	var event = new FRCEvent(eventURL,"TEST",
		function(event) {
		var an = new Analyze(event);
		analyze = an;

		console.log(an);

		var data = []; //list of rows.
		//Team	Rank	Auton	Truss	Assist	Teleop	OPR	CCWM	DPR	Seed
		for (var i = 0; i < an.teams.length; i++) {
			var u = [an.teams[i], i+1];
			for (var j = 0; j < an.expected.length; j++) {
				u.push(parseFloat(an.expected[j].get(i,0).toFixed(1)));
			}
			u.push(an.ccwm.get(i,0).toFixed(1));
			u.push(1);
			data.push(u);
		}

		console.log(data);

		var tab = table.make(
			[eventName + "(Analysis)",
				[["<em>FIRST</em> Data*",["Team","Rank"]] ,
				["Direct Calculations<sup>†</sup>",["Auton","Truss/Catch","Assist","Other Teleop","OPR (Total)"]] ,
				["Indirect Calculations<sup>‡</sup>",["CCWM","Predicted Seed"]]]
			],
			data,
			[false,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed,gradientGreenToRed],
			["increase","increase","decrease","decrease","decrease","decrease","decrease","decrease","increase"],
			1
		);
		bigtableplace.innerHTML = "";
		tab.addSelf(document.getElementById("bigtableplace"));
	});
	console.log("BEGIN");
}