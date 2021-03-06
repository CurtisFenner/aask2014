"use strict";

function Analyze(event) {
	this.getMatches = event.getMatches;
	this.getRanks = event.getRanks;
	this.getEliminations = event.getEliminations;
	var matches = event.getMatches();
	var ranks = event.getRanks();
	var teams = [];
	var winMargin = [];
	var QS = [];
	for (var i = 0; i < ranks.length; i++) {
		teams.push(ranks[i].get("team"));
		winMargin.push(0);
		QS.push(ranks[i].get("QS"));
	}
	var mpf = zeros(ranks.length,ranks.length);

	var playedMatches = 0;

	for (var i = 0; i < matches.length; i++) {
		var match = matches[i];
		if (isFinite(match.redScore) && isFinite(match.blueScore)) {
			//A played matched.
			playedMatches++;
			for (var u = 0; u < 3; u++) {
				for (var v = u+1; v < 3; v++) {
					//Pair each team on each alliance and note that they've
					//played together.
					var first;
					var second;
					first = match.red[u];
					second = match.red[v];
					mpf.increment( teams.indexOf(first) , teams.indexOf(second)  );
					mpf.increment( teams.indexOf(second) , teams.indexOf(first)  );
					first = match.blue[u];
					second = match.blue[v];
					mpf.increment( teams.indexOf(first) , teams.indexOf(second)  );
					mpf.increment( teams.indexOf(second) , teams.indexOf(first)  );
				}
			}
			var margin = match.redScore - match.blueScore;
			for (var j = 0; j < 3; j++) {
				var u;
				u = teams.indexOf(match.red[j]);
				winMargin[u] += margin;
				u = teams.indexOf(match.blue[j]);
				winMargin[u] -= margin;
			}
		}
	}

	if (playedMatches < 5) {
		//NOT ENOUGH MATCHES HAVE BEEN PLAYED
		this.message = "Not enough matches have been played.";
		return true;
	}

	for (var i = 0; i < ranks.length; i++) {
		var sum = 0;
		for (var j = 0; j < ranks.length; j++) {
			if (i != j) {
				sum += mpf.get(i,j);
			}
		}
		mpf.set(i,i, sum / 2);
	}

	var vectors = ["auton","truss","assist","teleop"];
	var points = []; //list of points
	while (points.length < vectors.length) {
		var qu = [];
		qu.name = vectors[points.length];
		points.push(qu);
	}
	points.push([]); //Totals
	for (var i = 0; i < ranks.length; i++) {
		//Each team.
		var total = 0;
		for (var j = 0; j < vectors.length; j++) {
			var value = ranks[i].get(vectors[j]);
			points[j].push(value);
			total += value;
		}
		points[points.length-1].push(total);
	}
	vectors.push("total");
	
	this.mpf = mpf;
	this.points = points;
	this.teams = teams;
	this.ranks = ranks;
	this.matches = matches;

	var LU = mpf.luSeparate();
	var L = LU[0];
	var U = LU[1];
	var determinant = L.diagProduct() * U.diagProduct();
	var expected = [];

	if (!isFinite(determinant) || determinant === 0) {
		this.warning = "Not enough matches have been played.";
		return;
	} else {
		for (var i = 0; i < vectors.length; i++) {
			expected[i] = MatrixSolveLUPrefactorized(L,U,arrayToColumnVector(points[i])); //Maybe points[i] should be a matrix
		}
	}
	this.expected = expected;

	this.ccwm = MatrixSolveLUPrefactorized(L,U,arrayToColumnVector(winMargin));

	this.getCCWM = function(t) {
		var u = teams.indexOf(t);
		if (u >= 0) {
			return this.ccwm.get(u,0);
		} else {
			return 0;
		}
	}
	this.getExpected = function(t) {
		var u = teams.indexOf(t);
		if (u >= 0) {
			return expected[expected.length-1].get(u,0);
		} else {
			return 0;
		}
	}

	//Predict final QS for each team:
	for (var i = 0; i < matches.length; i++) {
		var match = matches[i];
		if (isFinite(match.redScore) && isFinite(match.blueScore)) {
			// `match` has been played (we don't need to do anything (((()))))
		} else {
			// `match` has not yet been played

			// Calculate expected scores
			var redE = predictAllianceValue(match.red[0],match.red[1],match.red[2], P_OPR, this); //Expected score for red alliance
			var blueE = predictAllianceValue(match.blue[0],match.blue[1],match.blue[2], P_OPR, this);
			var winner = redE > blueE ? match.red : match.blue;
			//Each winner gains 2 qualification points
			for (var j = 0; j < winner.length; j++) {
				QS[teams.indexOf(winner[j])] += 2;
			}
		}
	}

	this.QS = QS;
}