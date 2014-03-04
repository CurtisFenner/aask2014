"use strict";

function Analyze(event) {
	var matches = event.getMatches();
	var ranks = event.getRanks();
	var teams = [];
	var winMargin = [];
	for (var i = 0; i < ranks.length; i++) {
		teams.push(ranks[i].get("team"));
		winMargin.push(0);
	}
	var mpf = zeros(ranks.length,ranks.length);

	//createMPF()
	for (var i = 0; i < matches.length; i++) {
		var match = matches[i];
		if (isFinite(match.redScore) && isFinite(match.blueScore)) {
			//A played matched.
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
	for (var i = 0; i < ranks.length; i++) {
		var sum = 0;
		for (var j = 0; j < ranks.length; j++) {
			if (i != j) {
				sum += mpf.get(i,j);
			}
		}
		mpf.set(i,i, sum / 2);
	}
	// \createMPF

	//createPointMatrices()
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
		alert("Not enough matches played for any confidence!");
	} else {
		for (var i = 0; i < vectors.length; i++) {
			expected[i] = MatrixSolveLUPrefactorized(L,U,arrayToColumnVector(points[i])); //Maybe points[i] should be a matrix
		}
	}
	this.expected = expected;

	this.ccwm = MatrixSolveLUPrefactorized(L,U,arrayToColumnVector(winMargin));
}