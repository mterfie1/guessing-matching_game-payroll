// script for part "A" starts here

var hrsArray = [];
var hourlyRate = 15;
var totalHrsPerWeek = 40;

function takeinputs() {
    var txt;
    var box = prompt("Please enter total number of hours employee has worked this week. Enter '-1' to finish:");
    if (box == null || box == "") {
		alert("Please enter a value.");
        return takeinputs();
    } else {
        addHours(box);
    }
}




function addHours(Hrsworked) {
    var hours = Hrsworked
	var total_pay = 0;
    if (hours == -1 && hrsArray.length == 0  ) {
        alert("Hours of employee have not been added yet.");
        return takeinputs();
    }
	
	else if (hours < -1){
		alert("Please do not enter negative hours.");
        return takeinputs();
		
	}

    else if (hours == -1 && hrsArray.length > 0) {

        var tableRows = document.getElementById("rows");
		

        var data = "";
        for (var i = 0 ; i < hrsArray.length ; i++) {

            data += "<tr>";
            data += "<td>" + (i + 1) + " </td>";
            data += "<td>" + hrsArray[i] + "</td>";

            var extraPay = 0, actualPay = 0, pay = 0;


            if (hrsArray[i] > totalHrsPerWeek) {
                extraPay = (hrsArray[i] - totalHrsPerWeek) * (hourlyRate + (hourlyRate * 0.5));
                pay = extraPay + (hourlyRate * totalHrsPerWeek);
            }
            else {
                pay = hourlyRate * hrsArray[i];
            }

			total_pay += pay;
            data += "<td>" + pay + "</td>";
            data += "</tr>";  
        }

        document.getElementById("rows").innerHTML = data;
		document.getElementById("totalPay").innerHTML = "Total pay = $" + total_pay;

    }

    else {
        //document.getElementById("Hrsworked").value = "";
        //document.getElementById("Hrsworked").focus();


        hrsArray.push(hours);
        takeinputs();
    }

}

//script for part "A" ends here


//script for part "B" starts from here

var turnsLeft = 10;
var guessedNo = Math.floor((Math.random() * 100) + 1);

if (document.getElementById("turnsLeft") != null) {
    document.getElementById("turnsLeft").innerHTML = "Turns left: " + turnsLeft;
}

function startDateAndSound() {
    var snd = new Audio("file.wav"); // buffers automatically when created
    snd.play();

    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();

    document.getElementById("dateTime").innerHTML = n + ' ' + time;
}





function checkGuess() {
    var userNo = document.getElementById("num").value;
    if (userNo > guessedNo || userNo < guessedNo) {
        if (turnsLeft == 1) {
            alert("You guessed wrong number, original number was: " + guessedNo + "\n" + "Game over. Try again");
            turnsLeft = 10;
			guessedNo = Math.floor((Math.random() * 100) + 1);
            document.getElementById("turnsLeft").innerHTML = "Turns left: " + turnsLeft;
            document.getElementById("num").value = "";
            return;
        }

        if (userNo > guessedNo)
            alert("Guessed to high, try again");
        else
            alert("Guessed to low, try again");

        turnsLeft--;
        document.getElementById("turnsLeft").innerHTML = "Turns left: " + turnsLeft;
        document.getElementById("num").value = "";
        document.getElementById("num").focus();
    } else if (userNo == guessedNo) {
		alert("You have guessed the number correctly.");
		turnsLeft = 10;
        guessedNo = Math.floor((Math.random() * 100) + 1);
		document.getElementById("turnsLeft").innerHTML = "Turns left: " + turnsLeft;
        document.getElementById("num").value = "";
		return;
      	
    }
    //guessedNo = Math.floor((Math.random() * 100) + 1);
}



//script for part "B" ends here



//script for part "C" starts here

var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.png', '9.jpg', '10.jpg', '11.jpg', '12.jpg'];
var diffLevel;
var peekTime = {
    "8": 3000,
    "10": 5000,
    "12": 8000
};

var gameplayTime = {
    "8": 120000,
    "10": 150000,
    "12": 180000
};

var startGamePlay = false;
var prevSelectedImageSrc;
var imagesGuessed;
var countIntervalId;
var timeCount = 0;



function start() {

    imagesGuessed = 0;
    prevSelectedImageSrc = "";
    resetText();

    var select = document.getElementById("diff-level");
    diffLevel = select.options[select.selectedIndex].value;

    createGrid(parseInt(diffLevel), images);

    setTimeout(function () {
        toggleImagesVisibility(false, true);
        startGamePlay = true;
        startTimer(gameplayTime[diffLevel]);
    }, peekTime[diffLevel]);
}


function toggleImagesVisibility(show, reset) {
    var images = document.getElementById('rows').getElementsByTagName('img');
    for (var i = 0; i < images.length; i++) {
        if (images[i].getAttribute("src") != "images/tick.png" || reset) {
            images[i].setAttribute("src", (show) ? images[i].getAttribute("data-src") : "images/placeholder.png");
        }
    }
}



function setTick(src) {
    var images = document.getElementById('rows').getElementsByTagName('img');
    for (var i = 0; i < images.length; i++) {
        if (images[i].getAttribute("data-src") == src) {
            images[i].setAttribute("src", "images/tick.png");
        }
    }
}



function createGrid(size, images) {

    var width = size / 2,
        height = size * 2 / width,
        imgItr = 0;

    var tmpImages = images.slice(0, size);
    tmpImages = tmpImages.concat(tmpImages);
    tmpImages = shuffle(tmpImages);

    var rows = "";

    for (var i = 0; i < height; i++) {
        rows += "<tr>";
        var cols = "";
        for (var j = 0; j < width; j++) {
            cols += "<td><img onclick='selectImage(this)' data-src='images/" + tmpImages[imgItr] + "' src='images/" + tmpImages[imgItr++] + "' /></td>";
        }

        rows += cols + "</tr>";
    }

    document.getElementById("rows").innerHTML = rows;
}



function selectImage(obj) {

    var selectedImageSrc = obj.getAttribute("data-src");

    if (selectedImageSrc == "images/tick.png" || !startGamePlay) {
        return;
    }

    obj.setAttribute("src", selectedImageSrc);

    if (prevSelectedImageSrc != "") {
        if (selectedImageSrc == prevSelectedImageSrc) {
            setTimeout((function (selectedImageSrc) {
                ++imagesGuessed;
                setTick(selectedImageSrc);
            })(selectedImageSrc), 500);
        }
        else {
            setTimeout(function () {
                toggleImagesVisibility(false, false);
            }, 500);
        }
        prevSelectedImageSrc = "";
    }
    else {
        prevSelectedImageSrc = selectedImageSrc;
    }

    if (imagesGuessed == parseInt(diffLevel)) {
        clearInterval(countIntervalId);
        setGameState(true);
    }
}



function setGameState(win) {
    document.getElementById("game-state").innerHTML = (win) ? " You won!" : " You Lost! Press Start to try again";
    startGamePlay = false;
    document.getElementById("timer").innerHTML = "";
}



function resetText() {
    document.getElementById("timer").innerHTML = "";
    document.getElementById("game-state").innerHTML = "";
}



function startTimer(time) {
    countIntervalId = setInterval(timer, 1000);
    timeCount = time / 1000;

}



function timer() {
    --timeCount;
    if (timeCount <= 0) {
        clearInterval(countIntervalId);
        setGameState(false);
        return;
    }

    document.getElementById("timer").innerHTML = timeCount + " seconds left";
}



function shuffle(arr) {
    var currIndex = arr.length, tmpVal, randIndex;

    while (0 !== currIndex) {

        randIndex = Math.floor(Math.random() * currIndex);
        currIndex -= 1;

        tmpVal = arr[currIndex];
        arr[currIndex] = arr[randIndex];
        arr[randIndex] = tmpVal;
    }

    return arr;
}




//script for part "C" ends here