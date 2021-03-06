/*
This file is part of the Adambots Automated Scouting Kit (AASK).

AASK is free software: you can redistribute it and/or modify it under the terms
of the GNU General Public License as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.

AASK is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
AASK.  If not, see <http://www.gnu.org/licenses/>.

AASK was started during the 2013 FIRST season by Ben Bray and Curtis Fenner of
Team 245, the Adambots, for use by other FRC teams.
*/

/**
Mode:
0: Only OPR
1: OPR + DRP
2: CCWM
**/

var P_OPR = 0;
var P_CCWM = 2;

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

//This is for convenience. It loads from the FRCEvent `even` the data.
function predictTeamValue(team,mode,even) {
	team = parseInt("" + team);
	if (mode === P_CCWM) {
		return even.getCCWM(team);
	}
	if (mode === P_OPR) {
		return even.getExpected(team);
	}
}

//Also for convenience, this computes the value of a particular alliance under the current mode `m` and FRCEvent `e`.
function predictAllianceValue(t1,t2,t3,m,e) {
	return predictTeamValue(t1,m,e) + predictTeamValue(t2,m,e) + predictTeamValue(t3,m,e);
}

function setupMatchPredictor(an) {
	predictionred1.onchange = predictionred2.onchange = predictionred3.onchange = predictionblue1.onchange = predictionblue2.onchange = predictionblue3.onchange = 
	predictionred1.onkeyup = predictionred2.onkeyup = predictionred3.onkeyup = predictionblue1.onkeyup = predictionblue2.onkeyup = predictionblue3.onkeyup = m1atchpredictionmode0.onchange = m1atchpredictionmode2.onchange = function() {

		style = function(obj) {
			var k = obj.value.trim();
			k = parseInt(k);
			if (an.teams.indexOf(k) >= 0) {
				obj.style.fontWeight = "bold";
			} else {
				obj.style.fontWeight = "normal";
			}
		}
		style(predictionred1);
		style(predictionred2);
		style(predictionred3);
		style(predictionblue1);
		style(predictionblue2);
		style(predictionblue3);

		var mode = 0;
		if (m1atchpredictionmode2.checked) {
			mode = 2;
		}

		var red = predictAllianceValue(predictionred1.value,predictionred2.value,predictionred3.value,mode,an);

		redallianceprediction.value = red.toFixed(2);
		if (red == 0) {
			redallianceprediction.value = "";
		}

		var blue = predictAllianceValue(predictionblue1.value,predictionblue2.value,predictionblue3.value,mode,an);


		blueallianceprediction.value = blue.toFixed(2);
		if (blue == 0) {
			blueallianceprediction.value = "";
		}
		
		if (Math.abs(blue - red) < 1) {
			predictedresult.innerHTML = "Expected near tie.";
		}
		if (blue > red + 1) {
			predictedresult.innerHTML = "Blue wins" + (mode==2 ? "." : " by an expected " + (blue - red).toFixed(1) + " points.");
		}
		if (red > blue + 1) {
			predictedresult.innerHTML = "Red wins" + (mode==2 ? "." : " by an expected " + (red-blue).toFixed(1) + " points.");
		}

	}
}

function predictUnplayed(an) {
	var mode = P_OPR;
	if (m2atchpredictionmode2.checked) {
		mode = P_CCWM;
	}
	//Rebuild the datatata.
	//console.log(frcEvent.qualTable.data);
	var correct = [0,0,0];
	var counted = 0;
	var matches = an.getMatches().concat(an.getEliminations() || []);

	var colmatch = [];
	var finmatch = [];
	var colteams = [[],[]]//[[],[],[],[],[],[]];
	var finteams = [[],[]];
	var colscores = [[],[]];
	var finscores = [[],[]];
	var finscoresreal = [[],[]];

	for (var m = 0; m < matches.length; m++) {
		// Get Match (Row)
		var match = matches[m];
		// Tabulate
		if (isNaN(match.redScore)) {
			//{Match has NOT been played}
			colmatch.push(matches[m].name);
			var redalli = match.red[0] + "&nbsp;&nbsp;" + match.red[1] + "&nbsp;&nbsp;" + match.red[2];
			var bluealli = match.blue[0] + "&nbsp;&nbsp;" + match.blue[1] + "&nbsp;&nbsp;" + match.blue[2];
			var red = predictAllianceValue(match.red[0],match.red[1],match.red[2] , mode , an);
			var blue = predictAllianceValue(match.blue[0],match.blue[1],match.blue[2] , mode , an);
			
			if (red > blue ) {
				// Prediction Table
				colscores[0].push( "<b>" + red.toFixed(1) + "</b>" );
				colscores[1].push( blue.toFixed(1) );
				redalli = "<b>" + redalli + "</b>";
			} else {
				// Prediction Table
				colscores[0].push( red.toFixed(1) );
				colscores[1].push( "<b>" + blue.toFixed(1) + "</b>" );
				bluealli = "<b>" + bluealli + "</b>";
			}
			colteams[0].push(redalli);
			colteams[1].push(bluealli);
		} else {
			//{Match HAS been played}
			finmatch.push(matches[m].name);
			var redA = match.red; //red alliance
			var blueA = match.blue;//blue alliance
			var redalli = redA[0] + "&nbsp;&nbsp;" + redA[1] + "&nbsp;&nbsp;" + redA[2];
			var bluealli = blueA[0] + "&nbsp;&nbsp;" + blueA[1] + "&nbsp;&nbsp;" + blueA[2];
			var red = predictAllianceValue(redA[0],redA[1],redA[2] , mode , an);
			var blue = predictAllianceValue(blueA[0],blueA[1],blueA[2] , mode , an);
			
			var op = "";
			var cp = "";
			if (red >= blue !== parseInt(match.redScore) >= parseInt(match.blueScore)) {
				op = "<del>";
				cp = "</del>";
			}

			if (red > blue ) {
				// Prediction Table
				finscores[0].push( op + "" + red.toFixed(1) + "" + cp );
				finscores[1].push( op + blue.toFixed(1)  + cp );
			} else {
				// Prediction Table
				finscores[0].push( op + red.toFixed(1) + cp );
				finscores[1].push( op + "" + blue.toFixed(1) + "" + cp );
			}
			if (match.redScore >= match.blueScore) {
				finscoresreal[0].push("<b>" + match.redScore + "</b>");
				redalli = "<b>" + redalli + "</b>";
			} else {
				finscoresreal[0].push(match.redScore);
			}
			if (match.blueScore >= match.redScore) {
				finscoresreal[1].push("<b>" + match.blueScore + "</b>");
				bluealli = "<b>" + bluealli + "</b>";
			} else {
				finscoresreal[1].push(match.blueScore);
			}
			finteams[0].push(redalli);
			finteams[1].push(bluealli); //</derivative from above>
			for (var z = 0; z < 3; z++) {
				var red = predictAllianceValue(match.red[0],match.red[1],match.red[2], z , an ); //The scores predicted by the current game model.
				var blue = predictAllianceValue(match.blue[0],match.blue[1],match.blue[2] , z , an );
				var realRed = parseInt(match.redScore); //The actual scores for this match reported by FIRST
				var realBlue = parseInt(match.blueScore);
				
				// Count Correct
				if ((red >= blue) == (realRed >= realBlue) ) {
					correct[z] = correct[z] + 1; //`z` refers to prediction mode, so this is done for all 3 here.
				}
			}
			counted = counted + 1;
		}
	}


	m2ode0acc.innerHTML = Math.floor(100 * correct[0]/counted) + "% accuracy";
	//m2ode1acc.innerHTML = Math.floor(100 * correct[1]/counted) + "% accuracy";
	m2ode2acc.innerHTML = Math.floor(100 * correct[2]/counted) + "% accuracy";

	if(colmatch.length > 0){
		// Unplayed Matches Exist
		fillTable("matchpredictions", [colmatch , colteams[0], colteams[1], colscores[0], colscores[1] ], ["grey","white","white","red","blue"] , [-1,-1,-1,-1,-1] );
	} else {
		// No Unplayed Matches
		document.getElementById("matchpredictions").tBodies[0].innerHTML = "<tr><td colspan=\"5\" class=\"error\">No unplayed matches are scheduled.</td></tr>";
	}

	if(finmatch.length > 0){
		// Played Matches Exist
		fillTable("matchresults", [finmatch , finteams[0], finteams[1], finscoresreal[0], finscoresreal[1], finscores[0], finscores[1] ], ["grey","white","white","red","blue","red","blue"] , [-1,-1,-1,-1,-1,-1,-1] );
	} else {
		// No played Matches
		document.getElementById("matchresults").tBodies[0].innerHTML = "<tr><td colspan=\"5\" class=\"error\">No matches have been played yet.</td></tr>";
	}
}