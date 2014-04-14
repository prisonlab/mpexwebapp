function MarkStat () {
	ColorizeRight ("#plstat");
	ChangeWindow ("#plhistrades");
}

function MarkOptions () {
	ColorizeRight ("#plops");
	ChangeWindow ("#pltradeoptions");
}

function MarkDeposit () {
	ColorizeRight ("#pldeposit");
	ChangeWindow ("#pldepositform");
}

function MarkBuySell () {
	ColorizeRight ("#plbuysell");
	ChangeWindow ("#plgraph");
}

function ColorizeRight (mark) {
	$('#plstat').css({"background":"white"});
	$('#plops').css({"background":"white"});
	$('#pldeposit').css({"background":"white"});
	$('#plbuysell').css({"background":"white"});
	
	$(mark).css({"background":"orange"});
}

function ChangeWindow (win) {
	$('#plhistrades').css({"display":"none"});
	$('#pltradeoptions').css({"display":"none"});
	$('#pldepositform').css({"display":"none"});
	$('#plgraph').css({"display":"none"});
	
	$(win).css({"display":"block"});
}