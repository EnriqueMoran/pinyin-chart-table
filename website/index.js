const url = 'ws://127.0.0.1:3000';    // add your own url
const connection = new WebSocket(url);


var pinyinInfo  = {
				 "pinyin": "",
				 "tone1_audio": [],
				 "tone2_audio": [],
				 "tone3_audio": [],
				 "tone4_audio": []
			    };

var isAudioPlaying = false;

function start() {    // Initialize website and show all characters
	connection.send('find - ');
}


function showContent() {    // Adjust items size
	var items = document.getElementsByClassName('item');
  	for(i = 0; i < items.length; i++) {
		items[i].style.fontSize = "25px";
  	}
}

function sortResultsById(pinyinList) {
    pinyinList.sort(function(a, b) {
        return a.order - b.order;
    });
    return pinyinList;
}


function showInfo(event) {    // Show character data on mouse hovering
	var element = document.getElementById('info');

	element.style.position = "absolute";
	element.style.left     = event.target.getBoundingClientRect().x +'px';
	element.style.top      = (event.target.getBoundingClientRect().y + 70) +'px';
	element.classList.toggle("show");
}


function hideInfo() {
	document.getElementById("info").classList.remove("show");
}


connection.onopen = () => {
	console.log("Connection established");
	start();
}


connection.onerror = error => {
	console.log("Websocket error: " + error.data)
}


connection.onmessage = e => {
	var object = JSON.parse(e.data)
	showData(object);
}



function showData(pinyinList) {
	var ul = document.getElementById("pinyin-list");
	pinyinList = sortResultsById(pinyinList);

	pinyinList.forEach(function (pinyin){
		var li = document.createElement("li");
		li.setAttribute("class", "item");

		li.setAttribute("data-pinyin",       pinyin.pinyin);
		li.setAttribute("data-tone1_audio",  pinyin.tone1_audio);
		li.setAttribute("data-tone2_audio",  pinyin.tone2_audio);
		li.setAttribute("data-tone3_audio",  pinyin.tone3_audio);
		li.setAttribute("data-tone4_audio",  pinyin.tone4_audio);


		li.onmouseenter = function(event) {
			var scrollTop = window.pageYOffset || 0;
			var element   = document.getElementById('info');

			element.style.position = "absolute";		
			element.style.left     = (event.target.getBoundingClientRect().x - 80) + 'px';
			element.style.top      = (event.target.getBoundingClientRect().y + 40 + scrollTop) +'px';
			element.innerHTML      = '<div class="inner-menu-container"><div class="inner-menu">tone1</div><div class="inner-menu">tone2</div><div class="inner-menu">tone3</div><div class="last-item">tone4</div></div>';
			element.classList.add("show");

			pinyinInfo["pinyin"]        = event.target.getAttribute("data-pinyin");
			pinyinInfo["tone1_audio"]   = event.target.getAttribute("data-tone1_audio");
			pinyinInfo["tone2_audio"]   = event.target.getAttribute("data-tone2_audio");
			pinyinInfo["tone3_audio"]   = event.target.getAttribute("data-tone3_audio");
			pinyinInfo["tone4_audio"]   = event.target.getAttribute("data-tone4_audio");
		};

		li.onmouseleave = function() {
			//hideInfo();
        };


		li.appendChild(document.createTextNode(pinyin.pinyin));
		ul.appendChild(li);
		
	});	
	showContent();
}


document.addEventListener('click', function (e) {
	if (e.target.classList.contains('item')) {

		var pinyin =  e.target.getAttribute("data-pinyin");
		var tone1  =  e.target.getAttribute("data-tone1_audio");
		var tone2  =  e.target.getAttribute("data-tone2_audio");
		var tone3  =  e.target.getAttribute("data-tone3_audio");
		var tone4  =  e.target.getAttribute("data-tone4_audio");

		var randomNumber = Math.random();
		var randomInt = Math.floor(randomNumber * 4) + 1;

		if (isAudioPlaying) {
			//return;
		}	

		switch (randomInt) {
			case 1:
				src = tone1;
				break;
			case 2:
				src = tone2;
				break;
			case 3:
				src = tone3;
				break;
			case 4:
				src = tone4;
				break;
			default:
			break;
		}

		isAudioPlaying = true;

		var a = new Audio(src);
		a.play();

		a.addEventListener('ended', function () {
			isAudioPlaying = false;
    });

	}
});


document.body.addEventListener('click', function (e) {
	var info = document.getElementById("info");

	if (!e.target.classList.contains('item') && !info.contains(e.target)) {
		hideInfo();
	}
});

document.body.addEventListener('click', function (e) {
	var info = document.getElementById("info");

	if (e.target.classList.contains('inner-menu')) {
		var toneClicked = e.target.innerText.toLowerCase();
		handleToneClick(toneClicked);
	}

	if (e.target.classList.contains('last-item')) {
		var toneClicked = e.target.innerText.toLowerCase();
		handleToneClick(toneClicked);
	}
});

function handleToneClick(tone) {
	if (isAudioPlaying) {
       // return;
    }

	var src = "";
	switch (tone) {
		case 'tone1':
			src = pinyinInfo["tone1_audio"];
			break;
		case 'tone2':
			src = pinyinInfo["tone2_audio"];
			break;
		case 'tone3':
			src = pinyinInfo["tone3_audio"];
			break;
		case 'tone4':
			src = pinyinInfo["tone4_audio"];
			break;
		default:
			break;
	}

	isAudioPlaying = true;

    var a = new Audio(src);
    a.play();

    a.addEventListener('ended', function () {
        isAudioPlaying = false;
    });
}