
/** Variables **/
var TargetPreviousUrl = "";
var TargetRunning = false;


/** Functions **/
function refreshCurrentTab() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id, {}, function () { });
    });
}

function generateKeyword() {
    var possible = ["niche", "keyword", "comp", "volume", "web", "monitor", "generator", "density", "add", "program", "adsense", "python", "traffic", "desk", "using", "loss", "term", "list", "bad", "affiliate", "popular", "google", "weight", "meta", "seo", "insurance", "what", "distriute", "research", "does", "marketing", "analyzer", "sports", "care", "search", "service", "advertising", "suggestion", "software", "ppc", "firefox", "one", "custom", "use", "java", "billing", "top", "long", "rcs", "checker", "more", "website", "nutrition", "dogpile", "company", "selector", "external", "elite", "than", "paying", "keyword", "this", "bed", "air", "optimization", "uk", "engine", "ranking", "parser", "tag", "need", "phrase", "check", "information", "monitoring", "adwords", "travel", "when", "html", "which", "online", "you", "tool", "development", "important", "services", "why", "tracking", "natural", "url", "analysis", "enter"];
    return text = possible[Math.floor(Math.random() * possible.length)];
}

function validUrl(hostname) {
    hostname = (new URL(hostname)).hostname.split("").reverse().join("|");
    var valid = false;
    switch (hostname) {
        case "m|o|c|.|g|n|i|b|.|w|w|w":
        case "m|o|c|.|s|k|c|u|b|g|a|w|s|.|h|c|r|a|e|s":
        case "m|o|c|.|s|k|c|u|b|g|a|w|s|.|w|w|w":
        case "m|o|c|.|s|k|c|u|b|g|a|w|s|.|o|e|d|i|v":
            valid = true;
            break;
        default:
            break;
    }
    return valid;
}

function search(hostname) {
    hostname = (new URL(hostname)).hostname.split("").reverse().join("|");
    var searchString = "";
    switch (hostname) {
        case "m|o|c|.|g|n|i|b|.|w|w|w":
            searchString += 'document.getElementsByName("q")[0].value = "' + generateKeyword() + '"; document.getElementById("sb_form").submit();';
            break;
        case "m|o|c|.|s|k|c|u|b|g|a|w|s|.|h|c|r|a|e|s":
        case "m|o|c|.|s|k|c|u|b|g|a|w|s|.|w|w|w":
            searchString += 'if(document.getElementById("sawInput") !== null) { document.getElementById("sawInput").value = "' + generateKeyword() + '"; document.getElementById("searchAndWinContainer").submit(); }';
            searchString += 'if(document.getElementById("field") !== null) { document.getElementById("field").value = "' + generateKeyword() + '"; document.getElementById("searchFrm").submit(); }';
            break;
        case "m|o|c|.|s|r|a|l|l|o|d|x|o|b|n|i|.|w|w|w":
            searchString += 'document.getElementsByName("query")[0].value = "' + generateKeyword() + '"; document.getElementsByTagName("form")[0].submit();';
            break;
        case "m|o|c|.|s|k|c|u|b|g|a|w|s|.|o|e|d|i|v":
            searchString += "var script = document.createElement('script');script.type = 'text/javascript';";
            searchString += "script.innerHTML += \"sb_vd.play = eval(\\\"(\\\" + sb_vd.play.toString().substr(0, sb_vd.play.toString().length - 1) + \\\"setTimeout(function(){ if(sb_vd.lastMeterNumber == undefined) { sb_vd.pause(); setTimeout(function(){ sb_vd.play(); }, 10000); } }, 3000); })\\\"); sb_vd.tick = eval(\\\"(\\\" + sb_vd.tick.toString().substr(0, sb_vd.tick.toString().length - 1) + \\\"if (sb_vd.lastMeterNumber == 9){alert('Please Enter Capcha For Reward.');}else{window.location=window.url.substr(0, window.url.search(sbtvVidId)) + (parseInt(sbtvVidId) + 1);}})\\\");\";"
            searchString += "document.getElementsByTagName('head')[0].appendChild(script);";
            break;
        default:
            alert("Not Valid");
            break;
    }
    return searchString;
}

function script(tab) {
    var hostname = (new URL(tab.url)).hostname.split("").reverse().join("|");
    switch (hostname) {
        case "m|o|c|.|g|n|i|b|.|w|w|w":
        case "m|o|c|.|s|k|c|u|b|g|a|w|s|.|h|c|r|a|e|s":
        case "m|o|c|.|s|k|c|u|b|g|a|w|s|.|w|w|w":
        case "m|o|c|.|s|r|a|l|l|o|d|x|o|b|n|i|.|w|w|w":
            setTimeout(function () {
                chrome.tabs.executeScript(tab.id, {
                    code: search(tab.url)
                });
            }, 7000);
            break;
        case "m|o|c|.|s|k|c|u|b|g|a|w|s|.|o|e|d|i|v":
            chrome.tabs.executeScript(tab.id, {
                code: search(tab.url)
            });
            break;
    }
}


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, info) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (tabs[0].id == tabId) {

            // Check the validation
            if (validUrl(tabs[0].url)) {
                $("#lblStatus").text("VALID");
            } else {
                $("#lblStatus").text("NOT VALID");
            }

            // If Active And Script is Running, then perform Task
            if (TargetRunning && info.status == "complete") {
                script(tabs[0]);
            }
        }
    });
});

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.webRequest.onBeforeSendHeaders.addListener(function (info) {
        // Replace the User-Agent header
        var headers = info.requestHeaders
        headers.forEach(function (header, i) {
            if (header.name.toLowerCase() == 'user-agent') {
                if ($("#chkMobile").attr("checked") == "checked") {
                    header.value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4';
                } else {
                    //header.value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4';
                }
            }
        });
        return { requestHeaders: headers };
    }, { urls: ["https://*/*", "http://*/*"], types: ["main_frame", "sub_frame"], tabId: tabs[0].id, windowId: tabs[0].windowId }, ["blocking", "requestHeaders"]);
});


/** Document onReady **/
$(document).ready(function() {

    /** Click Events **/
    $("#btnSubmit").click(function () {
        if (! TargetRunning) {
            TargetRunning = true;
            refreshCurrentTab();
            $("#imgLoader").show();
        }
    });
    
    $("#btnCancel").click(function () {
        TargetRunning = false;
        refreshCurrentTab();
        $("#imgLoader").hide();
    });

    $("#chkMobile").click(function () {
        refreshCurrentTab();
    });

    // Reload the current tab
    refreshCurrentTab();
});