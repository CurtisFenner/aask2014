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
Team 245, the AdamBots, for use by other FRC teams.

This file created 2014 by Nathan Fenner of Team 245, the AdamBots, for use by
other FRC teams.

*/

//// FRCEVENT -----------------------------------------------------------------

/**
Represents all of the pages and data necessary for all of the calculations
about an Event.

	@param baseurl Event URL, e.g., 2013comp/Events/MIGBL
	@param eventName The name of the event, e.g. "Grand Blanc District"
	@param callback The function to call on completion of parsing and calculations.
Fields:
	ready : true once the response has been received
	eventName : whatever is given as the second argument
Methods:
	getMatches()
		returns an array of matches. Each match is an object of the form:
		match = {
			red: [redteam1, redteam2, redteam3],
			blue: [blueteam1, blueteam2, blueteam3],
			redScore: redScore,
			blueScore: blueScore,
			name: matchName,
			number: matchNumber
			time: time(string)
			}
	getEliminations()
		returns an array of elimation matches. If not have been played,
		the list is empty.
	getRanks()
		returns an array of rank-rows. these are the same as the ranks
		page data. A "get" method for each row is used, with aliases for
		specific columns. IE: event.getRanks()[5].get("team") will be
		the sixth team in the table (since it's zero-indexed).
		These are the valid aliases (not case sensitive)
		[ to modify them in source, they must be "UPPERCASED"]
			colAlias.TEAM = 1;
			colAlias.QS = 2;
			colAlias.ASSIST = 3;
			colAlias.AUTO = 4;
			colAlias.TRUSS = 5;
			colAlias.CATCH = 5;
			colAlias["T&C"] = 5;
			colAlias.TELEOP = 6;
			colAlias.RECORD = 7;
			colAlias.DQ = 8;
			colAlias.PLAYED = 9;
**/


function createRequest() {
	var request;
	try{
		request = new XMLHttpRequest();
	} catch(trymicrosoft) {
		try{
			request = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(othermicrosoft){
			try{
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(failed) {
				request = false;
			}
		}
	}
	// Ensure Request Existence
	if(!request) {
		alert("Unfortunately, your browser cannot utilize AASK. Please enable, or switch to a browser with, XMLHttpRequests! (Chrome, Opera, Safari, IE, others)");
	}
	return request;
}

function pageAsk(url,callback) {
	var request = createRequest();
	request.open("GET","?grab=" + url,true);
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			callback(request.responseText);
		}
	}
	request.send();
}


function FRCEvent(baseurl,eventName,callback) {
	var p = parseFloat;
	var me = this;
	var gotRankings = false;
	var gotResults = false;
	var rankingsPage = false;
	var resultsPage = false;

	function getRankings(text) {
		rankingsPage = text.split("\n");
		// the relevant bit starts when one of them is '1', the rank of the team
		var i = 0;
		while (i < rankingsPage.length && rankingsPage[i].charAt(0) != "1") {
			i++;
		}
		var n = 0;
		var dataTable = [];
		while (i + n < rankingsPage.length && rankingsPage[i+n].charAt(0) != "&") {
			dataTable[n] = rankingsPage[i+n].split(";");
			for (var j = 0; j < dataTable[n].length; j++) {
				if (p(dataTable[n][j]) == p(dataTable[n][j])) {
					dataTable[n][j] = p(dataTable[n][j]);
				}
			}
			n++;
		}
		rankingsPage = dataTable;
		gotRankings = true;
		if (gotResults) {
			calculate();
		}
	}
	var results = false;
	var matches = false;
	var elimMatches = false;
	function getResults(text) {
		resultsPage = text;
		results = resultsPage.split("\n");
		// time match red2 red2 red3 blue1 blue2 blue3 redscore bluescore
		for (var i = 0; i < results.length; i++) {
			if (("0123456789").indexOf(results[i].charAt(0)) >= 0) {
				break;
			}
		}
		matches = [];
		for (; i < results.length; i++) {
			if (("0123456789").indexOf(results[i].charAt(0)) < 0) {
				break;
			}
			var row = results[i].split(";");
			var m = {};
			m.time = row[0];
			m.number = p(row[1]);
			m.name = "Q" + m.number;
			m.red = [p(row[2]),p(row[3]),p(row[4])];
			m.blue = [p(row[5]),p(row[6]),p(row[7])];
			m.redScore = p(row[8]);
			m.blueScore = p(row[9]);
			matches.push(m);
		}
		for (; i < results.length; i++) { // pan for the possibility of elimination matches
			if (("0123456789").indexOf(results[i].charAt(0)) >= 0) {
				break;
			}
		}
		elimination = [];
		for (; i < results.length; i++) {
			if (("0123456789").indexOf(results[i].charAt(0)) < 0) {
				break;
			}
			var row = results[i].split(";");
			if (row.length < 5) {
				continue;
			}
			var m = {};
			m.time = row[0];
			m.name = row[1].replace("Qtr","QF").replace("Semi","SF").replace("Final","F");
			m.number = p(row[2]);
			m.red = [p(row[3]),p(row[4]),p(row[5])];
			m.blue = [p(row[6]),p(row[7]),p(row[8])];
			m.redScore = p(row[9]);
			m.blueScore = p(row[10]);

			elimination.push(m);
		}
		gotResults = true;
		if (gotRankings) {
			calculate();
		}
	}
	me.getMatches = function() {
		return matches;
	}
	me.getEliminations = function() {
		return elimination;
	}
	me.ready = false;
	function calculate() {
		me.ready = true;
		// both pages are ready now
		callback(me);
	}

	me.rankingsPage = rankingsPage;

	getRankRow = function(row) {
		var r = rankingsPage[row];
		r.get = function(x) {
			return r[(typeof x == "string") ? colAlias[x.toUpperCase()] : x];
		};
		return r;
	}

	// returns the ranks 2D array
	me.getRanks = function() {
		var r = [];
		for (var i = 0; i < rankingsPage.length; i++) {
			r[i] = getRankRow(i);
		}
		return r;
	}

	var rowAlias = {}; // this all for the 2014 game
	var colAlias = {};
	colAlias.RANK = 0;
	colAlias.TEAM = 1;
	colAlias.QS = 2;
	colAlias.ASSIST = 3;
	colAlias.AUTO = 4;
	colAlias.AUTON = 4;
	colAlias.AUTONOMOUS = 4;
	colAlias.TRUSS = 5;
	colAlias.CATCH = 5;
	colAlias["T&C"] = 5;
	colAlias.TELEOP = 6;
	colAlias.TELEOPERATED = 6;
	colAlias.RECORD = 7;
	colAlias.DQ = 8;
	colAlias.PLAYED = 9;


	me.eventName = eventName;
	pageAsk(baseurl + "rankings.html",getRankings);
	pageAsk(baseurl + "matchresults.html",getResults);
}


