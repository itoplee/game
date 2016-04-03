var width = 510; // 棋盘宽度
var cellWidth = 30; // 列宽
var cellCount = width / cellWidth; // 棋盘列数
var pieceWidth = 13; // 棋子半径
var isBlack = true; // 当前落子颜色
var fillArr = []; // 棋盘落子记录
var wins = []; // 赢法数组
var myWin = []; // 我的赢法
var computerWin = []; // 计算机赢法
var count = 0; // 赢法统计
var over = false; // 是否结束
var canvas = document.getElementById("checkerboard");
var context = canvas.getContext("2d");
var bg = new Image();

bg.src = "image/bg.png";
bg.onload = function() {
    context.drawImage(bg, 0, 0, width, width);
    drawChess();
};

// 画棋盘
function drawChess() {
    var dis = cellWidth / 2;
    var x = 0,
        y = 0;
    context.strokeStyle = "#aaa";
    for (var i = 0; i < cellCount; i++) {
        x = dis + i * cellWidth;
        y = width - dis;
        context.moveTo(dis, x);
        context.lineTo(y, x);
        context.stroke();
        context.moveTo(x, dis);
        context.lineTo(x, y);
        context.stroke();
    }
}

// 落子
function drawPiece(i, j, isBlack) {
    var dis = cellWidth / 2;
    var x = dis + i * cellWidth;
    var y = dis + j * cellWidth;
    var gradient = context.createRadialGradient(x, y, pieceWidth, x, y, 0);
    if (isBlack) {
        gradient.addColorStop(0, "#0a0a0a");
        gradient.addColorStop(1, "#636766");
    } else {
        gradient.addColorStop(0, "#ccc");
        gradient.addColorStop(1, "#f0f0f0");
    }
    context.beginPath();
    context.fillStyle = gradient;
    context.arc(x, y, pieceWidth, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
}

function fillEach(fun) {
    for (var i = 0; i < cellWidth; i++) {
        fun(i);
    }
}
// 二维数组初始化
function arrayInit(val) {
    var arr = [];
    fillEach(function(i) {
        arr[i] = [];
        fillEach(function(j) {
            arr[i][j] = val ? val : [];
        });
    });
    return arr;
}



// 落子记录初始化
fillArr = arrayInit(0);

// 赢法数组初始化
wins = arrayInit();

for (var i = 0; i < cellCount; i++) {
    for (var j = 0; j < cellCount - 4; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

for (var i = 0; i < cellCount; i++) {
    for (var j = 0; j < cellCount - 4; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

for (var i = 0; i < cellCount - 4; i++) {
    for (var j = 0; j < cellCount - 4; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

for (var i = 0; i < cellCount - 4; i++) {
    for (var j = cellCount - 1; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

console.log(count);

// 赢法统计数组初始化
for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

// 落子事件
canvas.onclick = function(e) {
    if (over) {
        return;
    }
    var i = Math.floor(e.offsetX / cellWidth);
    var j = Math.floor(e.offsetY / cellWidth);
    if (fillArr[i][j] < 1) {
        drawPiece(i, j, true);
        fillArr[i][j] = 1;

        checkOver(i, j, myWin, computerWin, "你赢了");

        if (!over) {
            isBlack = !isBlack;
            computerAI();
        }
    }
};

function computerAI() {
    var myScore = [];
    var computerScore = [];
    var max = 0;
    var u = 0,
        v = 0;

    for (var i = 0; i < cellCount; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (var j = 0; j < cellCount; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }

    for (var i = 0; i < cellCount; i++) {
        for (var j = 0; j < cellCount; j++) {
            if (fillArr[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000;
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000;
                        }

                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 220;
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 440;
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2100;
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }

                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    u = i;
                    v = j;
                }

                if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                }
            }
        }
    }

    drawPiece(u, v, false);
    fillArr[u][v] = 2;

    checkOver(u, v, computerWin, myWin, "计算机赢了");

    if (!over) {
        isBlack = !isBlack;
    }
}

// 判定输赢
function checkOver(i, j, arr1, arr2, str) {
    for (var k = 0; k < count; k++) {
        if (wins[i][j][k]) {
            arr1[k]++;
            arr2[k] = 6;
            if (arr1[k] === 5) {
                alert(str);
                over = true;
            }
        }
    }
}
