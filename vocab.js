// CONSTANTS ---------------------------------------------

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

const colours = [yellowlight, orangelight, pinklight, pink, white, pinkdark, purplelight, bluelight, greenlight, grey];
const palette = document.getElementsByClassName('colourBlock');

const textElementIDs = ["romaji", "kanji", "hiragana", "katakana", "part of speech", "definition"];

// FUNCTIONS ---------------------------------------------

function fetchJishoData(keyword) {
	var xhr = new XMLHttpRequest();
	var apiurl = 'https://jisho.org/api/v1/search/words?keyword=' + keyword;
	xhr.open("GET", apiurl, false);
	xhr.send(); 
	return JSON.parse(xhr.responseText)["data"][0];
}

function prettifyPartOfSpeech(partOfSpeech) {
	let prettifiedPartOfSpeech = "("
	for (a = 0; a < partOfSpeech.length; a++) {
		prettifiedPartOfSpeech += partOfSpeech[a];
		
		if (a < partOfSpeech.length - 1) {
			prettifiedPartOfSpeech += ', ';
		}
		
	}
	prettifiedPartOfSpeech += ')';
	return prettifiedPartOfSpeech;
}

function prettifyDefinition(definition) {
	let prettifiedDefinition = "";
	for (a = 0; a < definition.length; a++) {
		prettifiedDefinition += definition[a];
		
		if (a < definition.length - 1) {
			prettifiedDefinition += ', ';
		}
		
	}
	return prettifiedDefinition;
}

function setCookies() {
	// Store background color preference
	if (Cookies.get("color")) {
		Cookies.set("color", Cookies.get("color"));
	}
	else {
		Cookies.set("color", 3);
	}
	// apply the colour
	palette[Cookies.get("color")].click();

	// Store romaji visibility preference
	if (Cookies.get("romaji")) {
		Cookies.set("romaji", Cookies.get("romaji"));
	}
	else {
		Cookies.set("romaji", "on");
	}

	// Store "hiragana first" preference
	if (Cookies.get("topText")) {
		Cookies.set("topText", Cookies.get("topText"));
	}
	else {
		Cookies.set("topText", "hiragana first");
	}

	// Store top visited site visibility preference
	if (Cookies.get("linksVisibility")) {
		Cookies.set("linksVisibility", Cookies.get("linksVisibility"));
	}
	else {
		Cookies.set("linksVisibility", "visible");
	}
}

function getCookies(kanji, hiragana) {
	// Apply romaji visibility preference
	if (Cookies.get("romaji") == "off") {
		document.getElementById('romaji').style.visibility = "hidden";
	}
	if (Cookies.get("romaji") == "on") {
		document.getElementById('romaji').style.visibility = "visible";	
	}

	// Apply "hiragana first" preference
	if (Cookies.get("topText") == "hiragana first") {
		document.getElementById("kanji").innerHTML = kanji;
		document.getElementById("hiragana").innerHTML = hiragana;
	}
	if (Cookies.get("topText") == "kanji first") {
		document.getElementById("kanji").innerHTML = hiragana;
		document.getElementById("hiragana").innerHTML = kanji;
	}

	// Apply top visited sites display preference
	if (Cookies.get("linksVisibility") == "hidden") {
		document.getElementById('toggleLinks').innerHTML = "<img src='/show.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
	}
	else {
		document.getElementById('toggleLinks').innerHTML = "<img src='/hide.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
	}
	document.getElementById('mostVisited_div').style.visibility = Cookies.get("linksVisibility");
}

function onAnchorClick(event) {
  chrome.tabs.create({ url: event.srcElement.href });
  return false;
}

function toggleTextColor(color) {
	for (const element of textElementIDs) {
		document.getElementById(element).style.color = color;
	}
}

function addEventListeners(kanji, hiragana) {
	// Audio
	document.getElementById("audio").innerHTML = "<img src=audio.svg style='opacity: 0.4; width: 20px; height: 20px;'>";
	let msg = new SpeechSynthesisUtterance(hiragana);
	msg.lang = 'ja';
	document.getElementById("audio").addEventListener('click', function() {
		window.speechSynthesis.speak(msg);
	});

	// Color palette
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

	// Eye icon on bottom left to display top visited sites
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

	// Menu icon on top left
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

	// Option to display romaji
	document.getElementById('romajiCheck').addEventListener("click", function() {

		if (Cookies.get("romaji") == "on") {
			Cookies.set("romaji", "off");
			document.getElementById("romajiCheck").style = "text-decoration: none";
			document.getElementById("romaji").style.visibility = "hidden";
		}

		else {
			Cookies.set("romaji", "on");
			document.getElementById("romajiCheck").style = "text-decoration: line-through";
			document.getElementById("romaji").style.visibility = "visible";
		}	

		document.getElementById("romajiCheck").style.opacity = "0.4";
		document.getElementById("romajiCheck").style.visibility = "visible";
	});

	// Option to show "hiragana first"
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
}


function constructTopSites(mostVisitedURLs) {
  const mostVisitedDiv = document.getElementById('mostVisited_div');
  let ul = mostVisitedDiv.appendChild(document.createElement('ul'));
  const numTopSites = 10;

  for (let i = 0; i < numTopSites; i++) {
    const mostVisitedURL = mostVisitedURLs[i].url.replace("https://", "").replace("http://", "").replace("www.", "");
    let a_link = ul.appendChild(document.createElement('a'));
    a_link.href = mostVisitedURL; 

    let li = a_link.appendChild(document.createElement('li'));
    li.className = "link";
    
    let img = li.appendChild(document.createElement("img"));
    img.src = "http://www.google.com/s2/favicons?domain=" + mostVisitedURL;
    img.className = "favicon";

	let a = li.appendChild(document.createElement('a'));
    a.href = mostVisitedURL;
    a.className = "link_text";

	const prettifiedUrl = mostVisitedURL.replace("https://", "").replace("http://", "");
    a.appendChild(document.createTextNode(prettifiedUrl));
  }
}

function populateWritingSystems(romaji, katakana, prettifiedPartOfSpeech, prettifiedDefinition) {
	document.getElementById("romaji").innerHTML = romaji;
	document.getElementById("katakana").innerHTML = katakana;
	document.getElementById("part of speech").innerHTML = prettifiedPartOfSpeech.toLowerCase();
	document.getElementById("definition").innerHTML = prettifiedDefinition.toLowerCase();
}

function applyWritingSystemsOrder() {
	document.getElementById('optionsImg').innerHTML += "<img src='/options.png' style='position: fixed; opacity: 0.2; height: 26px; width: 26px; left: 5vh; top: 5vh;'></img";
	document.getElementById('romajiCheck').innerHTML = "romaji";
	document.getElementById('romajiCheck').style.visibility = "hidden";
	document.getElementById('topText').style.visibility = "hidden";

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
}

// MAIN CODE ---------------------------------------------

function main() {
	// Fetch a random Japanese word
	const keyword = wordList[Math.floor(Math.random() * (wordList.length))];

	// Fetch data about the word from Jisho API
	const result = fetchJishoData(keyword);

	// Extract useful data from result
	const hiragana = result["japanese"][0]["reading"];
	const kanji = result["japanese"][0]["word"] || hiragana;
	const romaji = wanakana.toRomaji(hiragana);
	const katakana = wanakana.toKatakana(hiragana) || hiragana;
	const partOfSpeech = result["senses"][0]["parts_of_speech"];
	const definition = result["senses"][0]["english_definitions"];

	// Clean some data
	const prettifiedPartOfSpeech = prettifyPartOfSpeech(partOfSpeech);
	const prettifiedDefinition = prettifyDefinition(definition);

	// Add event listeners
	addEventListeners(kanji, hiragana);

	// Construct top sites section
	chrome.topSites.get(constructTopSites);

	// Set cookies based on preference
	setCookies();

	// Apply the preference stored in cookies
	getCookies(kanji, hiragana);

	// Populate the Japanese writing systems of keyword
	populateWritingSystems(romaji, katakana, prettifiedPartOfSpeech, prettifiedDefinition);

	// Apply the order of Japanese writing systems
	applyWritingSystemsOrder();
}

main();