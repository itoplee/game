var isBlack = true;
var fillArr = [];
var canvas = document.getElementById("checkerboard");
var context = canvas.getContext("2d");
var cellCount = 15;

context.strokeStyle = "#aaa";

var bg = new Image();
bg.src = "image/bg.png";
bg.onload = function () {
	context.drawImage(bg,0,0,450,450);
	drawChess();
};

function drawChess() {
	for(var i=0; i<cellCount; i++){
		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30);
		context.stroke();
		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435);
		context.stroke();
		fillArr[i] = [];
		for(var j=0; j<cellCount; j++){
			fillArr[i][j] = 0;
		}
	}
}

function drawPiece(i, j, isBlack){
	var x = 15 + i * 30;
	var y = 15 + j * 30;
	var gradient = context.createRadialGradient(x,y,13,x,y,0);
	if(isBlack){
		gradient.addColorStop(0, "#0a0a0a");
		gradient.addColorStop(1, "#636766");
	}else{
		gradient.addColorStop(0, "#ccc");
		gradient.addColorStop(1, "#f0f0f0");
	}
	context.beginPath();
	context.fillStyle = gradient;
	context.arc(x,y, 13, 0, 2*Math.PI);
	context.fill();
	context.closePath();
}

canvas.onclick = function (e) {
	var i = Math.floor(e.offsetX / 30);
	var j = Math.floor(e.offsetY / 30);
	if(fillArr[i][j] < 1){
		drawPiece(i, j, isBlack);
		isBlack = !isBlack;
		fillArr[i][j] = isBlack ? 1 : 2;
	}	
};