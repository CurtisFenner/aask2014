/*
This file is part of the AdamBots Automated Scouting Kit (AASK).

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

For the 2014 FIRST season, 
*/

"use strict";

var competitionList = [
	["Central Illinois Regional","2014comp/Events/ILIL/"],
	["Palmetto Regional","2014comp/Events/SCMB/"],
	["Alamo Regional sponsored by Rackspace Hosting","2014comp/Events/TXSA/"],
	["Greater Toronto West Regional","2014comp/Events/ONTO2/"],
	["Inland Empire Regional","2014comp/Events/CASB/"],
	["Israel Regional","2014comp/Events/ISTA/"],
	["Greater Toronto East Regional","2014comp/Events/ONTO/"],
	["Arkansas Regional","2014comp/Events/ARFA/"],
	["San Diego Regional","2014comp/Events/CASD/"],
	["Crossroads Regional","2014comp/Events/INTH/"],
	["Lake Superior Regional","2014comp/Events/MNDU/"],
	["Northern Lights Regional","2014comp/Events/MNDU2/"],
	["Hub City Regional","2014comp/Events/TXLU/"],
	["Central Valley Regional","2014comp/Events/CAMA/"],
	["Mexico City Regional","2014comp/Events/MXMC/"],
	["Sacramento Regional","2014comp/Events/CASA/"],
	["Orlando Regional","2014comp/Events/FLOR/"],
	["Greater Kansas City Regional","2014comp/Events/MOKC/"],
	["St. Louis Regional","2014comp/Events/MOSL/"],
	["North Carolina Regional","2014comp/Events/NCRE/"],
	["New York Tech Valley Regional","2014comp/Events/NYTR/"],
	["Dallas Regional","2014comp/Events/TXDA/"],
	["Utah Regional","2014comp/Events/UTWV/"],
	["Waterloo Regional","2014comp/Events/ONWA/"],
	["Festival de Robotique FRC a Montreal Regional","2014comp/Events/QCMO/"],
	["Arizona Regional","2014comp/Events/AZCH/"],
	["Los Angeles Regional sponsored by The Roddenberry Foundation","2014comp/Events/CALB/"],
	["Boilermaker Regional","2014comp/Events/INWL/"],
	["Buckeye Regional","2014comp/Events/OHCL/"],
	["Virginia Regional","2014comp/Events/VARI/"],
	["Wisconsin Regional","2014comp/Events/WIMI/"],
	["North Bay Regional","2014comp/Events/ONNB/"],
	["Peachtree Regional","2014comp/Events/GADU/"],
	["Hawaii Regional","2014comp/Events/HIHO/"],
	["Minnesota North Star Regional","2014comp/Events/MNMI2/"],
	["Minnesota 10000 Lakes Regional","2014comp/Events/MNMI/"],
	["SBPLI Long Island Regional","2014comp/Events/NYLI/"],
	["Finger Lakes Regional","2014comp/Events/NYRO/"],
	["Queen City Regional","2014comp/Events/OHCI/"],
	["Oklahoma Regional","2014comp/Events/OKOK/"],
	["Greater Pittsburgh Regional","2014comp/Events/PAPI/"],
	["Smoky Mountains Regional","2014comp/Events/TNKN/"],
	["Greater DC Regional","2014comp/Events/DCWA/"],
	["Western Canada Regional","2014comp/Events/ABCA/"],
	["Windsor Essex Great Lakes Regional","2014comp/Events/ONWI/"],
	["Silicon Valley Regional","2014comp/Events/CASJ/"],
	["Colorado Regional","2014comp/Events/CODE/"],
	["South Florida Regional","2014comp/Events/FLFO/"],
	["Midwest Regional","2014comp/Events/ILCH/"],
	["Bayou Regional","2014comp/Events/LAKE/"],
	["Chesapeake Regional","2014comp/Events/MDBA/"],
	["Las Vegas Regional","2014comp/Events/NVLV/"],
	["New York City Regional","2014comp/Events/NYNY/"],
	["Lone Star Regional","2014comp/Events/TXHO/"],
	["Howell District","2014comp/Events/MIHOW/"],
	["West Michigan Robotics District","2014comp/Events/MIWMI/"],
	["Great Lakes Bay Region District","2014comp/Events/MIMID/"],
	["Traverse City District","2014comp/Events/MITVC/"],
	["Livonia District","2014comp/Events/MILIV/"],
	["St. Joseph District","2014comp/Events/MISJO/"],
	["Waterford District","2014comp/Events/MIWAT/"],
	["Lansing District","2014comp/Events/MILAN/"],
	["Bedford District","2014comp/Events/MIBED/"],
	["Troy District","2014comp/Events/MITRY/"],
	["Michigan State Championship","2014comp/Events/MICMP/"],
	["MAR Mt. Olive District","2014comp/Events/NJFLA/"],
	["MAR Hatboro-Horsham District","2014comp/Events/PAHAT/"],
	["MAR Springside Chestnut Hill District","2014comp/Events/PAPHI/"],
	["MAR Clifton District","2014comp/Events/NJCLI/"],
	["MAR Lenape-Seneca District","2014comp/Events/NJTAB/"],
	["MAR Bridgewater-Raritan District","2014comp/Events/NJBRI/"],
	["Mid-Atlantic Region Championship","2014comp/Events/MRCMP/"],
	["New England Region Championship","2014comp/Events/NECMP/"],
	["PNW Auburn Mountainview District","2014comp/Events/WAAMV/"],
	["PNW Oregon City District","2014comp/Events/ORORE/"],
	["PNW Glacier Peak District","2014comp/Events/WASNO/"],
	["PNW Eastern Washington University District","2014comp/Events/WACHE/"],
	["PNW Mt. Vernon District","2014comp/Events/WAMOU/"],
	["PNW Wilsonville District","2014comp/Events/ORWIL/"],
	["PNW Shorewood District","2014comp/Events/WASHOU/"],
	["PNW Auburn District","2014comp/Events/WAAHS/"],
	["PNW Central Washington University District","2014comp/Events/WAELL/"],
	["PNW Oregon State University District","2014comp/Events/OROSU/"],
	["Autodesk PNW Championship","2014comp/Events/PNCMP/"],
	["Center Line District","2014comp/Events/MICEN/"],
	["Southfield District","2014comp/Events/MISOU/"],
	["Kettering University District","2014comp/Events/MIKET/"],
	["Gull Lake District","2014comp/Events/MIGUL/"],
	["Escanaba District","2014comp/Events/MIESC/"],
	["Granite State District","2014comp/Events/NHNAS/"],
	["UNH District","2014comp/Events/NHDUR/"],
	["Groton District","2014comp/Events/CTGRO/"],
	["WPI District","2014comp/Events/MAWOR/"],
	["Rhode Island District","2014comp/Events/RISMI/"],
	["Southington District","2014comp/Events/CTSOU/"],
	["Northeastern University District","2014comp/Events/MABOS/"],
	["Hartford District","2014comp/Events/CTHAR/"],
	["Pine Tree District","2014comp/Events/MELEW/"],
	["FIRST Championship Archimedes","2014comp/Events/Archimedes"],
	["FIRST Championship Curie","2014comp/Events/Curie"],
	["FIRST Championship Galileo","2014comp/Events/Galileo"],
	["FIRST Championship Newton","2014comp/Events/Newton"]
];



var compselector = document.getElementById("compselector");
var goToComp = document.getElementById("goToComp");
var s = "";

for (var i = 0; i < competitionList.length; i++) {
	var cmp = competitionList[i][0];
	s += "<option id='event" + cmp.split(" ").join("").split("-").join("") +"'>" + cmp + "</option>";
}

compselector.innerHTML = s;
var url = document.URL;
if (url.indexOf("#") >= 0) {
	url = url.split("#")[0];
}
url = url.split("?");
url[1] = !url[1] ? [] : url[1].split("&");

for (var i = 0; i < url[1].length; i++) {
	url[1][i] = url[1][i].split("=");
}

url = {"url" : url[0], "params" : url[1], "param" : {}};

for (var i = 0; i < url.params.length; i++) {
	url.param[url.params[i][0]] = url.params[i][1];
}

if (url.param.comp) {
	document.getElementById("event" + url.param.comp.split(" ").join("").split("-").join("")).selected = "selected";
}

goToComp.onclick = function() {
	window.location = url.url + "?comp=" + (compselector.options[compselector.selectedIndex].innerHTML).split(" ").join("-");
}

var eventName = competitionList[i][0];
var eventURL = competitionList[i][1];

for (var i = 0; i < competitionList.length; i++) {
	if ((url.param.comp||"").split("-").join("") == competitionList[i][0].split(" ").join("").split("-").join("")){
		eventName = competitionList[i][0];
		eventURL = competitionList[i][1];
	}
}