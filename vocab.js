// Fetch a random Japanese word
const keyword = wordList[Math.floor(Math.random() * (wordList.length))];

//  Make an API call
var xhr = new XMLHttpRequest();
var apiurl = 'https://jisho.org/api/v1/search/words?keyword=' + keyword;
xhr.open("GET", apiurl, false);
xhr.send(); 

// Store result in appropriate variables
const result = JSON.parse(xhr.responseText)["data"][0];
const kanji = result["japanese"][0]["word"];
const hiragana = result["japanese"][0]["reading"];
const romaji = wanakana.toRomaji(hiragana);
const katakana = wanakana.toKatakana(hiragana);
const thepartofspeech = result["senses"][0]["parts_of_speech"];
const thedefinition = result["senses"][0]["english_definitions"];

// Remove strings from objects and prettify
let actualposstring = "("
for (a = 0; a < thepartofspeech.length; a++) {
    actualposstring += thepartofspeech[a];
    
    if (a < thepartofspeech.length - 1) {
        actualposstring += ', ';
    }
    
}
actualposstring += ')';

// Remove strings from objects and prettify
let actualdefstring = "";
for (a = 0; a < thedefinition.length; a++) {
    actualdefstring += thedefinition[a];
    
    if (a < thedefinition.length - 1) {
        actualdefstring += ', ';
    }
    
}

/* COOKIES --------------------------------------- */

// If chose nothing, choose a default
if (Cookies.get("romaji")) {
	Cookies.set("romaji", Cookies.get("romaji"));
}
else {
	Cookies.set("romaji", "on");
}

// if already chose a topText setting, pick that
if (Cookies.get("topText")) {
	Cookies.set("topText", Cookies.get("topText"));
}
else {
	Cookies.set("topText", "hiragana first");
}

if (Cookies.get("romaji") == "off") {
	document.getElementById('romaji').style.visibility = "hidden";
}
if (Cookies.get("romaji") == "on") {
	document.getElementById('romaji').style.visibility = "visible";	
}

if (Cookies.get("topText") == "hiragana first") {
	document.getElementById("kanji").innerHTML = kanji;
	document.getElementById("hiragana").innerHTML = hiragana;
}
if (Cookies.get("topText") == "kanji first") {
	document.getElementById("kanji").innerHTML = hiragana;
	document.getElementById("hiragana").innerHTML = kanji;
}

document.getElementById("romaji").innerHTML = romaji;
document.getElementById("katakana").innerHTML = katakana;
document.getElementById("part of speech").innerHTML = actualposstring.toLowerCase();
document.getElementById("definition").innerHTML = actualdefstring.toLowerCase();


function onAnchorClick(event) {
  chrome.tabs.create({ url: event.srcElement.href });
  return false;
}

/* AUDIO ---------------------------------------- */

document.getElementById("audio").innerHTML = "<img src=audio.svg style='opacity: 0.4; width: 20px; height: 20px;'>";
var msg = new SpeechSynthesisUtterance(hiragana);

msg.lang = 'ja';

document.getElementById("audio").addEventListener('click', function() {
	window.speechSynthesis.speak(msg);
});


// Get the top sites and display then
function buildPopupDom(mostVisitedURLs) {
  var popupDiv = document.getElementById('mostVisited_div');
  var ul = popupDiv.appendChild(document.createElement('ul'));
  var desired_url_num = 10;

  for (var i = 0; i < desired_url_num; i++) {
    
    var a_link = ul.appendChild(document.createElement('a'));
    a_link.href = mostVisitedURLs[i].url; 

    var li = a_link.appendChild(document.createElement('li'));
    li.className = "link";
    
    var img = li.appendChild(document.createElement("img"));
    var a = li.appendChild(document.createElement('a'));

    img.src = "http://www.google.com/s2/favicons?domain=" + mostVisitedURLs[i].url;
    img.className = "favicon";
    a.href = mostVisitedURLs[i].url;
    a.className = "link_text";

    var url_title = (mostVisitedURLs[i].title);

    if (mostVisitedURLs[i].url == "http://www.youtube.com/") {
      url_title = "YouTube";}

    if (mostVisitedURLs[i].url == "http://www.google.com") {
      url_title = "Google";}

    if (mostVisitedURLs[i].url == "http://www.facebook.com/") {
      url_title = "Facebook";}

    if (mostVisitedURLs[i].url == "http://www.baidu.com") {
      url_title = "Baidu";}

    if (mostVisitedURLs[i].url == "http://www.yahoo.com") {
      url_title = "Yahoo";}

    if (mostVisitedURLs[i].url == "http://www.gmail.com/") {
      url_title = "Gmail";}

    if (mostVisitedURLs[i].url == "http://drive.google.com/") {
      url_title = "Google Drive";}

    if (mostVisitedURLs[i].url == "https://twitter.com/") {
      url_title = "Twitter";}


    a.appendChild(document.createTextNode(url_title));
  }
}
chrome.topSites.get(buildPopupDom);

/* COLOURS --------------------------------------- */

// 8 colours
const yellowlight = '#FFFBDF';
const greenlight = '#EAFFEF';
const bluelight = '#D9E5FF';
const purplelight = '#CBC5F5';
const pinkdark = '#E2C8E5';
const pink = '#F3D3EA';
const pinklight = '#F9DFE8';
const orangelight = '#FDECE4';
const white = '#fff';
const whitedark = '#F0EAD6';
const grey = '#3b3b3b';
const black = '#000'

// add event listeners
var palette = document.getElementsByClassName('colourBlock');
var colours = [yellowlight, orangelight, pinklight, pink, white, pinkdark, purplelight, bluelight, greenlight, grey];

function toggleTextColor(color) {
	document.getElementById("romaji").style.color = color;
	document.getElementById("kanji").style.color = color;
	document.getElementById("hiragana").style.color = color;
	document.getElementById("katakana").style.color = color;
	document.getElementById("part of speech").style.color = color;
	document.getElementById("definition").style.color = color;
}

// adds event listeners
for (var i = 0; i < palette.length; i++) {

	// pass i inside a function to addEventListeners
	(function(index) {
		palette[index].addEventListener("click", function() {
			document.getElementById('body').style.backgroundColor = colours[index];
			
			toggleTextColor(colours[index] === grey ? whitedark : black);

			// clears any highlighted boxes
			for (var j = 0; j < palette.length; j++) {
				document.getElementById(palette[j].id).style.border = '1px solid #a9a9a9';
			}

			// adds thicker border around current selection
			document.getElementById(palette[index].id).style.border = '1px black solid';
			Cookies.set("color", index);
		})
	}) (i);
	
}

// if already chose a colour, use that colour
if (Cookies.get("color")) {
	Cookies.set("color", Cookies.get("color"));
}
// if no colour chosen, use default colour
else {
	Cookies.set("color", 3);
}

// apply the colour
palette[Cookies.get("color")].click();


/* LINKS --------------------------------------- */

document.getElementById('toggleLinks').addEventListener("click", function() {

	var status = document.getElementById('mostVisited_div').style.visibility;

	if (status == 'hidden') {

		document.getElementById('toggleLinks').innerHTML = "<img src='/hide.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
		document.getElementById('mostVisited_div').style.visibility = 'visible';
		Cookies.set("linksVisibility", "visible");
	}
	else {

		document.getElementById('mostVisited_div').style.visibility = 'hidden';
		document.getElementById('toggleLinks').innerHTML = "<img src='/show.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
		Cookies.set("linksVisibility", "hidden");
	}

});

// if already chose a colour, use that colour
if (Cookies.get("linksVisibility")) {
	Cookies.set("linksVisibility", Cookies.get("linksVisibility"));
}
// if no colour chosen, use default colour
else {
	Cookies.set("linksVisibility", "visible");
}

// save the setting
document.getElementById('mostVisited_div').style.visibility = Cookies.get("linksVisibility");

if (Cookies.get("linksVisibility") == "hidden") {
	document.getElementById('toggleLinks').innerHTML = "<img src='/show.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
}
else {
	document.getElementById('toggleLinks').innerHTML = "<img src='/hide.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
}


/* OPTIONS -------------------------------- */

document.getElementById('optionsImg').innerHTML += "<img src='/options.png' style='position: fixed; opacity: 0.2; height: 26px; width: 26px; left: 5vh; top: 5vh;'></img";
document.getElementById('romajiCheck').innerHTML = "romaji";
document.getElementById('romajiCheck').style.visibility = "hidden";
document.getElementById('topText').style.visibility = "hidden";

// Event listeners
document.getElementById('optionsImg').addEventListener("click", function() {

	if (document.getElementById('romajiCheck').style.visibility == "visible") {

		document.getElementById('romajiCheck').style.visibility = "hidden";
		document.getElementById('topText').style.visibility = "hidden";
	}

	else {
		document.getElementById("romajiCheck").style.visibility = "visible";
		document.getElementById("topText").style.visibility = "visible";
	}

});

document.getElementById('romajiCheck').addEventListener("click", function() {

	// turn romaji off
	if (Cookies.get("romaji") == "on") {
		Cookies.set("romaji", "off");
		document.getElementById("romajiCheck").style = "text-decoration: none";
		document.getElementById("romaji").style.visibility = "hidden";
	}
	// turn romaji on
	else {
		Cookies.set("romaji", "on");
		document.getElementById("romajiCheck").style = "text-decoration: line-through";
		document.getElementById("romaji").style.visibility = "visible";
	}	

	document.getElementById("romajiCheck").style.opacity = "0.4";
	document.getElementById("romajiCheck").style.visibility = "visible";
});

document.getElementById('topText').addEventListener("click", function() {

	// put kanji on top
	if (Cookies.get("topText") == "hiragana first") {
		Cookies.set("topText", "kanji first");
		document.getElementById("topText").innerHTML = "hiragana first";
		document.getElementById("hiragana").innerHTML = kanji;
		document.getElementById("kanji").innerHTML = hiragana;
	}

	// put hiragana on top
	else {
		Cookies.set("topText", "hiragana first");
		document.getElementById("topText").innerHTML = "kanji first";
		document.getElementById("hiragana").innerHTML = hiragana;
		document.getElementById("kanji").innerHTML = kanji;
	}
});

// actually change the selection based on what you picked
if (Cookies.get("romaji") == "on") {
	document.getElementById("romajiCheck").style = "text-decoration: line-through";
	document.getElementById("romaji").style.visibility = "visible";
}
if (Cookies.get("romaji") == "off") {
	document.getElementById("romajiCheck").style = "text-decoration: none";	
	document.getElementById("romaji").style.visibility = "hidden";
}

if (Cookies.get("topText") == "hiragana first") {
	document.getElementById("topText").innerHTML = "kanji first";
}
if (Cookies.get("topText") == "kanji first") {
	document.getElementById("topText").innerHTML = "hiragana first";
}

document.getElementById("romajiCheck").style.opacity = "0.4";
document.getElementById("topText").style.opacity = "0.4";
