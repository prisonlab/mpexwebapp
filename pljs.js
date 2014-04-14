var marketDepth;
var allSymbols;

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

//ziskaj vsetky MPSIC symboly z mpex.coinbr.com
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
	//vytvor select menu zo stiahnutych symbolov 
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
	console.log("i was here");
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

//na kazdy symbol v selecte pridaj listener na kliknutie
function addListenersToSelect(sym){
	var listedSymbols=document.getElementById("symbols").getElementsByTagName("option");
    //console.log(listedSymbols.length);
	for(var i=0;i<listedSymbols.length;i++){
		console.log(listedSymbols.length);

        listedSymbols[i].addEventListener("click",function(){
		    console.log(this);
			console.log("hello");
			createTradeTable(this);
	       	}
			,true);
	}

}

//vytvor tabulku pre dany symbol podla rss dat
function createTradeTable(symbol){
	console.log("i wa her");
	var graph=document.getElementById("tradetable");
//	var buys=new Array();
//	var sells=new Array();
	var html;
	html="<br>"+symbol.value+"<br>";
    console.log("i was here");
	//najdi vsetky predaje z rss podla symbolu
/*	for(var i=0;i<marketDepth.length;i++){
		if(rssData.feed.entries[i].title.indexOf(symbol.value)!=-1){
			if(rssData.feed.entries[i].content.indexOf("sold")!=-1){
				sells.push(rssData.feed.entries[i]);
			}else buys.push(rssData.feed.entries[i]);
		}
	}*/

	//vytvor z nich tabulku
//	console.log(B.length);
//	console.log(S.length);
	name=symbol.value;
	if(marketDepth[name]!=undefined){
		if(marketDepth[name].B.length>0||marketDepth[name].S.length>0){
			html+="<table>";
			html+="<tr><th>BuyQTY</th><th>Price</th><th>SellQTY</th></tr>";
			//pridaj buys
			for(var i=0;i<marketDepth[name].B.length;i++){
				buyqty=marketDepth[name].B[i][1];
				price=marketDepth[name].B[i][0];
				html+="<tr><td>"+buyqty+"</td><td>"+price+"</td><td></td></tr>";
			}

			//pridaj sells
			for(var i=0;i<marketDepth[name].S.length;i++){
				sellqty=marketDepth[name].S[i][1];
				price=marketDepth[name].S[i][0];
				html+="<tr><td></td><td>"+price+"</td><td>"+sellqty+"</td></tr>";
			}
			html+="</table>";
		}
	}
	
	//vloz vytvorene html do grafu
	graph.innerHTML=html;
}
//Nacitaj RSS feed nakupov a predajov akcii na mpex.co
//z tychto dat sa budu zostavovat tabulky pri kupe/predaji akcie
/*
function loadRSS(){
	var abc=document.getElementById("mp");
	console.log(abc);
	google.load("feeds","1");

      function init() {
      var feed = new google.feeds.Feed("http://mpex.co/mpex-rss.php");
	  feed.setNumEntries(50);
	  feed.includeHistoricalEntries();
      feed.load(function(result) {
        if (!result.error) {
			localStorage.setItem("feedSaved",JSON.stringify(result));
          var container = document.getElementById("feed");
          for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            var div = document.createElement("div");
            div.appendChild(document.createTextNode(entry.title));
            container.appendChild(div);
          }
			console.log(result);
			setRss(result);
        }
		addListenersToSelect(allSymbols);
      });
    }
    google.setOnLoadCallback(init);
	var feed=JSON.parse(localStorage.getItem("feedSaved"));
	console.log(feed);
	rssData=feed;
	addListenersToSelect(allSymbols);
}
function setRss(res){
	rssData=res;
}*/
