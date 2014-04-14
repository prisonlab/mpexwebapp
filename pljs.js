var marketDepth;
var allSymbols;
var rpcServer;

function MarkStat () {
	ColorizeRight ("#plstat");
	ChangeWindow ("#plhistrades");
}

function MarkOptions () {
	ColorizeRight ("#plops");
	ChangeWindow ("#pltradeoptions");
	
}
function addListeners(){
	var optionsListed=document.getElementById("options").getElementsByTagName("li");
	for(var i=0;i<optionsListed.length;i++){
		optionsListed[i].addEventListener("click",function(){
			showExerciseButton(this);
	       	}
			,true);
	}
//	var depositButton=document.getElementsByTagName("button");
 //   console.log(depositButton.length);
//	$("button[name=Deposit]").
//	depositButton[0].addEventListener("click",function(){
//	console.log("i was here");
	//var form=document.getElementById("depositform");
	//form.show();
	//$(".depositform").show();
//	console.log("and here");
/*	$("#depositform").css({"display":"block"});
	console.log("the end");
	}
	,true);*/
	
}

function showExerciseButton(option){
	var options=document.getElementById("options").getElementsByTagName("li");
	for(var i=0;i<options.length;i++){
		
		if(options[i].innerHTML.indexOf("<button>Exercise</button>")!=-1){
			options[i].innerHTML=options[i].innerHTML.replace("<button>Exercise</button>","");
		}
	}
	buttonHTML="<button>Exercise</button>";
	option.innerHTML=option.innerHTML+buttonHTML;
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
	$('#plstat').css({"box-shadow":"2px 2px black"});
	$('#plops').css({"box-shadow":"2px 2px black"});
	$('#pldeposit').css({"box-shadow":"2px 2px black"});
	$('#plbuysell').css({"box-shadow":"2px 2px black"});
	
	$(mark).css({"box-shadow":"6px 6px blue"});
}

function ChangeWindow (win) {
	$('#plhistrades').css({"display":"none"});
	$('#pltradeoptions').css({"display":"none"});
	$('#pldepositform').css({"display":"none"});
	$('#plgraph').css({"display":"none"});

	$(win).css({"display":"block"});
//	$("#depositform").css({"display":"none"});
	$(".depositform").hide();
}

//get all MPSIC symbols from mpex.coinbr.com
function getMPSICSymbols(){
    var symbols=new Array();

    var getSymbols=function(){
	$.ajax({
		type: "GET",
		url: "http://mpex.coinbr.com/mpex-vwap-jsonp.php",
	    dataType: "jsonp",
	    contentType: "jsonp",
	    jsonpCallback: "JurovP",
	    error: function(result){
			console.log("error");
			console.log(result);
		},
		success: function(results){
			console.log(results);

			for(result in results){
				symbols.push(result.toString());
			}
	        createSelect(symbols);

//			loadRSS();
		}
	});
	}

	getSymbols();
	//create select menu from downloaded symbols
    function createSelect(sym){
		allSymbols=sym;
        var select=document.getElementById("symbols");
		var html;
		for(var i=0;i<sym.length-1;i++){
			html=html+"<option value=\""+sym[i]+"\">"+sym[i]+"</option>";
		}
		select.innerHTML=html;
		addListenersToSelect(sym);
	}
}

function getMarketDepth(){
	$.ajax({
		type: "GET",
		url: "http://mpex.co/mpex-mktdepth-jsonp.php",
	    dataType: "jsonp",
	    contentType: "jsonp",
	    jsonpCallback: "JurovP",
	    error: function(result){
			console.log("error");
			console.log(result);
		},
		success: function(results){
			console.log("success");
			console.log(results);
			setMarketDepth(results);
			getMPSICSymbols();
		}
	});
}

function setMarketDepth(res){
	marketDepth=res;
}

//add event listener to every symbol in select
function addListenersToSelect(sym){
	var listedSymbols=document.getElementById("symbols").getElementsByTagName("option");
    //console.log(listedSymbols.length);
	for(var i=0;i<listedSymbols.length;i++){

        listedSymbols[i].addEventListener("click",function(){
			createTradeTable(this);
	       	}
			,true);
	}

}

//create table for selected symbol from json data
function createTradeTable(symbol){
	var graph=document.getElementById("tradetable");
	var html;
	html="<br>"+symbol.value+"<br>";

	name=symbol.value;
	if(marketDepth[name]!=undefined){
		if(marketDepth[name].B.length>0||marketDepth[name].S.length>0){
			html+="<table id=\"buyselltable\">";
			html+="<tr><th>BuyQTY</th><th>Price</th><th>SellQTY</th></tr>";
            //sort buys and sells
			marketDepth[name].B.sort(function(a,b){return a[0]-b[0];});
			marketDepth[name].S.sort(function(a,b){return b[0]-a[0];});
			//add buys
			for(var i=0;i<marketDepth[name].B.length;i++){
				buyqty=marketDepth[name].B[i][1];
				price=marketDepth[name].B[i][0];
				html+="<tr><td>"+buyqty+"</td><td>"+price+"</td><td></td></tr>";
			}

			//add sells
			for(var i=0;i<marketDepth[name].S.length;i++){
				sellqty=marketDepth[name].S[i][1];
				price=marketDepth[name].S[i][0];
				html+="<tr><td></td><td>"+price+"</td><td>"+sellqty+"</td></tr>";
			}
			html+="</table>";
		}
	}
	
	//insert created html and add listeners
	graph.innerHTML=html;
	addTableListeners();
}

function addTableListeners(){
	console.log("hello ");
	rows=document.getElementById("buyselltable").getElementsByTagName("tr");
     	console.log(rows.length);
		console.log(rows);
	if((rows)!=undefined){
		for(var i=1;i<rows.length;i++){
			console.log("i was here");
		    rows[i].addEventListener("click",function(){
	             fillPrice(this);
	       	}
			,true);
		}
	}
}

function fillPrice(row){
	price=document.getElementById("priceinput");
	price.value=parseFloat(row.cells[1].innerHTML);
}

function addBuySellListeners(){
	buy=document.getElementById("Buy");
	sell=document.getElementById("Sell");

	buy.addEventListener("click",function(){
		    //    console.log("buy");
				histlog=document.getElementById("plhistrades");
				amountVal=document.getElementById("amountinput").value;
				symbolVal=document.getElementById("symbols").value;
				priceVal=document.getElementById("priceinput").value;
				histlog.innerHTML=histlog.innerHTML+"<br>"+"B "+symbolVal+" "+amountVal+"@"+priceVal+"satoshi";
			}
			,true);

	sell.addEventListener("click",function(){
		    //    console.log("sell");
		       histlog=document.getElementById("plhistrades");
			   amountVal=document.getElementById("amountinput").value;
			   symbolVal=document.getElementById("symbols").value;
		       priceVal=document.getElementById("priceinput").value;
			   histlog.innerHTML=histlog.innerHTML+"<br>"+"S "+symbolVal+" "+amountVal+"@"+priceVal+"satoshi";
			}
			,true);
}
/*
function initRPC(){
	rpcServer=new $.JsonRpcClient({ajaxUrl:"http://localhost/jsonrpc:8007"});

	//console.log(rpcServer);
	rpcServer.call(
			"statjson",[],
			function (result){console.log("successs"+result);},
			function (error){console.log("error"+error);}
			);
	$.ajax({url: "http://localhost/jsorpc/:8007",
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"jsonrpc": "2.0",
			"method": "statjson", "params": [], "id": 1,
		}),
		dataType: "json",
		success: function(response) {
		    console.log(response.result);
		},
	    error: function(result){
			console.log(result);
		}
	});
	$.ajax({
    type: 'POST',
    url: 'http://localhost/jsonrpc/:8007',
    crossDomain: true,
    data: '{"some":"json"}',
    dataType: 'jsonp',
    success: function(responseData, textStatus, jqXHR) {
        var value = responseData.someKey;
    },
    error: function (responseData, textStatus, errorThrown) {
        alert('POST failed.');
    }
});
}*/

