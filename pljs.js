var marketDepth;
var allSymbols;
var rpcServer;
var stat;

function MarkStat () {
	ColorizeRight ("#plstat");
	ChangeWindow ("#plhistrades");
}

//adds listeners to all of the buttons
function addListeners(){
	var depositButton=document.getElementById("Deposit");
	depositButton.addEventListener("click",function(){
		    ChangeWindow("#pldepositform");
	}
	,true);
	
	var logButton=document.getElementById("Logs");
    logButton.addEventListener("click",function(){
			ChangeWindow("#pllogs");
			}
	,true);
	var holdingsButton=document.getElementById("Holdings");
	holdingsButton.addEventListener("click",function(){
		    ChangeWindow("#plholdings");
	        }
	,true);
	var dividendsButton=document.getElementById("Dividends");
	dividendsButton.addEventListener("click",function(){
		    ChangeWindow("#pldividends");
	        }
	,true);
	var historyButton=document.getElementById("TradeHistory");
	historyButton.addEventListener("click",function(){
		    ChangeWindow("#plhistrades");
	        }
	,true);
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

//changes the central window
function ChangeWindow (win) {
	$('#plhistrades').css({"display":"none"});
	$('#pltradeoptions').css({"display":"none"});
	$('#pldepositform').css({"display":"none"});
	$('#plgraph').css({"display":"none"});
    $('#plholdings').css({"display":"none"});
	$('#pldividends').css({"display":"none"});
    $('#pllogs').css({"display":"none"});
//	$('.depositform').css({"display":"none"});

	$(win).css({"display":"block"});
}

//get all MPSIC symbols from mpex.coinbr.com
/*function getMPSICSymbols(){
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
}*/

//load all of the mpsic symbols from config.conf file
function loadMPSICSymbols(){
	var symbols=new Array();

    var getSymbols=function(){
	$.ajax({
		type: "GET",
		url: "config.conf",
	    dataType: "text",
	    error: function(result){
			console.log("error");
			console.log(result);
		},
		success: function(results){
			console.log(results);
			symbols=results.split(',');
			console.log(symbols);

	        createSelect(symbols);
		}
	});
	}
		


	getSymbols();

	//creates html select list with loaded MPSIC values
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

//loads market depth data from mpex.co
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
			loadMPSICSymbols();
		},
		success: function(results){
			console.log("success");
			console.log(results);
			setMarketDepth(results);
			loadMPSICSymbols();
		}
	});
}

function setMarketDepth(res){
	marketDepth=res;
}

//add event listener to every MPSIC symbol in select
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
			marketDepth[name].B.sort(function(a,b){return b[0]-a[0];});
			marketDepth[name].S.sort(function(a,b){return b[0]-a[0];});

			//add sells
			for(var i=0;i<marketDepth[name].S.length;i++){
				sellqty=marketDepth[name].S[i][1];
				price=marketDepth[name].S[i][0];
				html+="<tr><td></td><td>"+price+"</td><td>"+sellqty+"</td></tr>";
			}
			//add buys
			for(var i=0;i<marketDepth[name].B.length;i++){
				buyqty=marketDepth[name].B[i][1];
				price=marketDepth[name].B[i][0];
				html+="<tr><td>"+buyqty+"</td><td>"+price+"</td><td></td></tr>";
			}
			html+="</table>";
		}
	}
	
	//insert created html and add listeners
	graph.innerHTML=html;
	addTableListeners();
}

//adds listeners to every row of trade data, listeners fill the price form with 
//price data from clicked row
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

//fills the form with price from clicked table row
function fillPrice(row){
	price=document.getElementById("priceinput");
	price.value=parseFloat(row.cells[1].innerHTML);
}

//adds listeners to buy/sell buttons
function addBuySellListeners(){
	console.log(document.URL);
	buy=document.getElementById("Buy");
	sell=document.getElementById("Sell");

	buy.addEventListener("click",function(){
		histlog=document.getElementById("plhistrades");
		amountVal=document.getElementById("amountinput").value;
		symbolVal=document.getElementById("symbols").value;
		priceVal=document.getElementById("priceinput").value;
		histlog.innerHTML=histlog.innerHTML+"<br>"+"B "+symbolVal+" "+amountVal+"@"+priceVal+"satoshi";
		amountVal=parseFloat(amountVal);
		priceVal=parseFloat(priceVal);

		$.ajax({
			type: 'POST',
			url: document.URL+'jsonrpc/',
			//crossDomain: true,
			data: JSON.stringify({"jsonrpc": "2.0", "method": "neworder","params":["B",symbolVal,amountVal,priceVal], "id": 1}),
			dataType: 'json',
			success: function(responseData, textStatus, jqXHR) {
	            receipt=document.getElementById("bsrec");
				$(".bsreceipt").show("fast");
				receipt.innerHTML=receipt.innerHTML+responseData.message+"<br>"+responseData.data+"<br>"+responseData.result+"<br>";
				receipt.addEventListener("click",function(){
					$(".bsreceipt").hide("fast");
				}
				,true);
			},
			error: function (responseData, textStatus, errorThrown) {
			    receipt=document.getElementById("bsrec");
				$(".bsreceipt").show("fast");
				receipt.innerHTML=receipt.innerHTML+responseData.message+"<br>"+responseData.data+"<br>"+responseData.result+"<br>";
				receipt.addEventListener("click",function(){
					$(".bsreceipt").hide("fast");
				}
				,true);
			}
		});
				}
			,true);

	sell.addEventListener("click",function(){
	   histlog=document.getElementById("plhistrades");
	   amountVal=document.getElementById("amountinput").value;
	   symbolVal=document.getElementById("symbols").value;
	   priceVal=document.getElementById("priceinput").value;
	   histlog.innerHTML=histlog.innerHTML+"<br>"+"S "+symbolVal+" "+amountVal+"@"+priceVal+"satoshi";
       amountVal=parseFloat(amountVal);
	   priceVal=parseFloat(priceVal);
	   $.ajax({
			type: 'POST',
			url: document.URL+'jsonrpc/',
			//crossDomain: true,
			data: JSON.stringify({"jsonrpc": "2.0", "method": "neworder","params":["S",symbolVal,amountVal,priceVal], "id": 1}),
			dataType: 'json',
			success: function(responseData, textStatus, jqXHR) {
	            receipt=document.getElementById("bsrec");
				$(".bsreceipt").show("fast");
				receipt.innerHTML=receipt.innerHTML+responseData.message+"<br>"+responseData.data+"<br>"+responseData.result+"<br>";
				receipt.addEventListener("click",function(){
					$(".bsreceipt").hide("fast");
				}
				,true);
			},
			error: function (responseData, textStatus, errorThrown) {
			    receipt=document.getElementById("bsrec");
				$(".bsreceipt").show("fast");
				receipt.innerHTML=receipt.innerHTML+responseData.message+"<br>"+responseData.data+"<br>"+responseData.result+"<br>";
				receipt.addEventListener("click",function(){
					$(".bsreceipt").hide("fast");
				}
				,true);
			}
		});
		}
		,true);
}

//calls the statjson command from agent.py
function callStat(){

	$.ajax({
    type: 'POST',
    url: document.URL+'jsonrpc/',
    //crossDomain: true,
    data: JSON.stringify({"jsonrpc": "2.0", "method": "statjson", "id": 1}),
    dataType: 'json',
    success: function(responseData, textStatus, jqXHR) {
		stat=responseData;
		console.log(responseData);
		processStat();
    },
    error: function (responseData, textStatus, errorThrown) {
       // alert("POST failed.");
		console.log(responseData);
		console.log(textStatus);
		console.log(errorThrown);
    }
});
}

//processes the result of the statjson command
function processStat(){
	statdate=document.getElementById("statdate");
	statdate.innerHTML=statdate.innerHTML+stat.DateTime;
	holdings=document.getElementById("holdlist");
	for(var i=0;i<stat.Holdings.length;i++){
		holdings.innerHTML=holdings.innerHTML+stat.Holdings[i]+"<br>";
	}
	dividends=document.getElementById("divilist");
	for(var i=0;i<stat.Dividends.length;i++){
		dividends.innerHTML=dividends.innerHTML+stat.Dividends[i]+"<br>";
	}
}

//gets the list of all server logs
function callLogs(){
	$.ajax({
    type: 'POST',
    url: document.URL+'jsonrpc/',
    //crossDomain: true,
    data: JSON.stringify({"jsonrpc": "2.0", "method": "sendloglist", "id": 1}),
    dataType: 'json',
    success: function(responseData, textStatus, jqXHR) {
		stat=responseData;
		console.log(responseData);
		makeLogList(responseData);
    },
    error: function (responseData, textStatus, errorThrown) {
       // alert("POST failed.");
		console.log(responseData);
		console.log(textStatus);
		console.log(errorThrown);
    }
});
    //creates the select list that contains names of all sent log files
    function makeLogList(data){
		loglist=document.getElementById("loglist");
		var html;
		for(var i=0;i<data.result.length;i++){
			html+="<option>"+data.result[i]+"</option>";
		}
		loglist.innerHTML=html;
		addListenersToLog();
	}

    //adds listeners to every select value
	//listener gets the contents of log file after clicking
    function addListenersToLog(){
		logs=document.getElementById("loglist").getElementsByTagName("option");
		for(var i=0;i<logs.length;i++){
			logs[i].addEventListener("click",function(){
				logContents=document.getElementById("logcontents");
					$.ajax({
						type: 'POST',
						url: document.URL+'jsonrpc/',
						//crossDomain: true,
						data: JSON.stringify({"jsonrpc": "2.0", "method": "sendlog","params":[this.value], "id": 1}),
						dataType: 'json',
						success: function(responseData, textStatus, jqXHR) {
							stat=responseData;
							console.log(responseData);
							logContents.innerHTML=responseData.result.replace(/\n/g,"<br>");
						},
						error: function (responseData, textStatus, errorThrown) {
		//					alert("POST failed.");
							console.log(responseData);
							console.log(textStatus);
							console.log(errorThrown);
						}
					});

			}
			,true);

        }
    }
}
