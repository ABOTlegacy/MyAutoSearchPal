$(document).ready(function() {

	var TargetTimeout = null;
	var TargetMobile = false;
	var TargetPreviousUrl = "";

	chrome.webRequest.onBeforeSendHeaders.addListener(
		function(info) {
			// Replace the User-Agent header
			var headers = info.requestHeaders
			headers.forEach(function(header, i) {
				if (header.name.toLowerCase() == 'user-agent') {
					if ($("#chkMobile").attr("checked") == "checked" || TargetMobile){
						header.value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4';
					} else {
						//header.value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4';
					}
				}
			});
			return {requestHeaders: headers};
		},
		// Request filter
		{
			// Modify the headers for these pages
			urls: [
				"https://*/*",
				"http://*/*"
			],
			// In the main window and frames
			types: ["main_frame", "sub_frame"]
		},
		["blocking", "requestHeaders"]
	);


	

	function makeid()
	{
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i = 0; i < 5; i++)
		{
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
	
	function search(hostname)
	{
		hostname = (new URL(hostname)).hostname.split("").reverse().join("");
		var searchString = "";
		switch(hostname)
		{
			case "moc.gnib.www":
				searchString += 'document.getElementsByName("q")[0].value = "' + makeid() + '"; document.getElementById("sb_form").submit();';
				break;
			case "moc.skcubgaws.hcraes":
			case "moc.skcubgaws.www":
				searchString += 'if(document.getElementById("sawInput") !== null) { document.getElementById("sawInput").value = "' + makeid() + '"; document.getElementById("searchAndWinContainer").submit(); }';
				searchString += 'if(document.getElementById("field") !== null) { document.getElementById("field").value = "' + makeid() + '"; document.getElementById("searchFrm").submit(); }';
				break;
			case "moc.skcubgaws.oediv":
				searchString += "var script = document.createElement('script');script.type = 'text/javascript';";   
				searchString += "script.innerHTML += \"var firstPause = true; sb_vd.play = eval(\\\"(\\\" + sb_vd.play.toString().substr(0, sb_vd.play.toString().length - 1) + \\\"if(firstPause) { firstPause = false; sb_vd.pause(); setTimeout(function(){ sb_vd.play(); }, 30000);}})\\\"); var mysavedtimer = 0; sb_vd.tick = eval(\\\"(\\\" + sb_vd.tick.toString().substr(0, sb_vd.tick.toString().length - 1) + \\\"if ($('.contCongrats').length > 0){alert('Please Enter Capcha For Reward.');}else{if(sb_vd.timer == mysavedtimer || true) { window.location=window.url.substr(0, window.url.search(sbtvVidId)) + (parseInt(sbtvVidId) + 1);} else { mysavedtimer = sb_vd.timer; }}})\\\");\";"
				searchString += "document.getElementsByTagName('head')[0].appendChild(script);";
				//searchString += "$(document).ready(function() { document.getElementsByTagName('head')[0].appendChild(script);});";
				break;
			default:
				alert(hostname);
				break;
		}
		return searchString;
	}
	
	function script(tab)
	{
		var hostname = (new URL(tab.url)).hostname.split("").reverse().join("");
		switch(hostname)
		{
			case "moc.gnib.www":
			case "moc.skcubgaws.hcraes":
			case "moc.skcubgaws.www":
				TargetMobile = false;
				chrome.tabs.executeScript(tab.id,{
					code: search(tab.url)
				});
				break;
			case "moc.skcubgaws.oediv":
				TargetMobile = true;
				if (tab.url != TargetPreviousUrl) {
					chrome.tabs.executeScript(tab.id,{
						code: search(tab.url)
					});
					TargetPreviousUrl = tab.url;
				}
				//chrome.tabs.onActiveChanged.addListener(function() {
				//chrome.tabs.onUpdated.addListener(performSearch);
				//clearTimeout(TargetTimeout);
				//TargetTimeout = null;
				break;
			default:
				alert(hostname);
				break;
		}
	}
	
	function performSearch()
	{
		chrome.tabs.getSelected(null, function (tab) {
			script(tab);
			//chrome.tabs.executeScript(tab.id,{
			//	code: search(tab.url)
			//);
		});
	}
	
	$("#btnSubmit").click(function() {
		if (TargetTimeout == null)
		{
			TargetTimeout = setInterval(performSearch, 7000);
			$("#imgLoader").show();
		}
		else
		{
			clearTimeout(TargetTimeout);
			TargetTimeout = null;
		}
	});
	
	$("#btnCancel").click(function() {
		if (TargetTimeout != null)
		{
			clearTimeout(TargetTimeout);
			TargetTimeout = null;
			$("#imgLoader").hide();
		}
	});
});