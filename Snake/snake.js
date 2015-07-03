var Direction = {
	top: 1,
	right: 2,
	bottom: 3,
	left: 4
};

var Point = function(x, y, color) {
	this.x = x;
	this.y = y;
	this.color = color;
};

var Snake = function(point) {
	this.data = [point];
};

Snake.prototype.move = function(dir) {
	var len = this.data.length;
	var obj = this.getNextPos(dir);
	if (len > 1) {
		for (var i = len - 1; i > 0; i--) {
			this.data[i].x = this.data[i - 1].x;
			this.data[i].y = this.data[i - 1].y;
		}
	}
	this.data[0].x = obj.x;
	this.data[0].y = obj.y;
};

Snake.prototype.contain = function(x1, y1) {
	var flag = false;
	this.foreach(function(x, y, i) {
		if ((parseInt(x) === parseInt(x1)) && (parseInt(y) === parseInt(y1))) {
			flag = true;
		}
	});
	return flag;
}

Snake.prototype.foreach = function(fun) {
	for (var i = 0, len = this.data.length; i < len; i++) {
		fun(this.data[i].x, this.data[i].y, i);
	}
};

Snake.prototype.first = function() {
	return this.data[0];
};

Snake.prototype.add = function(dir) {
	var point = this.data[this.data.length - 1];
	var x = point.x;
	var y = point.y;
	this.move(dir);
	this.data.push(new Point(x, y, point.color));
}

Snake.prototype.getNextPos = function(dir) {
	var x = this.data[0].x;
	var y = this.data[0].y;
	switch (dir) {
		case Direction.top:
			y -= 1;
			break;
		case Direction.right:
			x += 1;
			break;
		case Direction.bottom:
			y += 1;
			break;
		case Direction.left:
			x -= 1;
			break;
	}

	return {
		"x": x,
		"y": y
	};
};

var HtmlHelper = {
	tableElement: null,
	target: null,
	snake: null,
	timeFun: null,
	colors: ["#0079ff", "#f60", "#f2f2f2"],
	row: 15,
	cell: 15,
	size: 10,
	dir: Direction.right,

	init: function() {
		var table = HtmlHelper.createTable(HtmlHelper.row, HtmlHelper.cell, HtmlHelper.size, HtmlHelper.size);
		HtmlHelper.tableElement = table;
		document.body.appendChild(table);
		HtmlHelper.snake = new Snake(HtmlHelper.getRandomPos(HtmlHelper.row, HtmlHelper.cell, HtmlHelper.colors[1]));
		HtmlHelper.showTarget();
		HtmlHelper.showSnake(Direction.top);
		HtmlHelper.timeFun = window.setInterval("HtmlHelper.start()", 500);
		document.onkeyup = function(e) {
			var e = e || event;
			var currKey = e.keyCode || e.which || e.charCode;
			switch (currKey) {
				case 37: // 左移
					HtmlHelper.dir = Direction.left;
					break;
				case 38: // 变形
					HtmlHelper.dir = Direction.top;
					break;
				case 39: // 右移
					HtmlHelper.dir = Direction.right;
					break;
				case 40: // 加速
					HtmlHelper.dir = Direction.bottom;
					break;
			}
		};
	},

	start: function() {
		var nextP = HtmlHelper.snake.getNextPos(HtmlHelper.dir);
		var flag = nextP.x < 0 || nextP.y < 0 || nextP.x >= HtmlHelper.cell || nextP.y >= HtmlHelper.row;
		if (HtmlHelper.snake.contain(nextP.x, nextP.y) || flag) {
			window.clearInterval(HtmlHelper.timeFun);
			alert("game over");
		} else {
			if (HtmlHelper.isTarget(nextP.x, nextP.y)) {
				HtmlHelper.snake.add(HtmlHelper.dir);
				HtmlHelper.showTarget();
			}
			HtmlHelper.showSnake(HtmlHelper.dir);
		}
	},

	isTarget: function(x, y) {
		return (parseInt(x) === parseInt(HtmlHelper.target.x)) && (parseInt(y) === parseInt(HtmlHelper.target.y));
	},

	showTarget: function() {
		var pos = HtmlHelper.getRandomPos(HtmlHelper.row, HtmlHelper.cell, HtmlHelper.colors[0]);
		if (HtmlHelper.snake.contain(pos.x, pos.y)) {
			HtmlHelper.showTarget();
		} else {
			if (HtmlHelper.target) {
				HtmlHelper.tableElement.rows[HtmlHelper.target.y].cells[HtmlHelper.target.x].style.backgroundColor = HtmlHelper.colors[2];
			}
			HtmlHelper.target = pos;
			HtmlHelper.tableElement.rows[HtmlHelper.target.y].cells[HtmlHelper.target.x].style.backgroundColor = HtmlHelper.target.color;
		}
	},

	showSnake: function(dir) {
		HtmlHelper.snake.foreach(function(x, y, i) {
			HtmlHelper.tableElement.rows[y].cells[x].style.backgroundColor = HtmlHelper.colors[2];
		});
		HtmlHelper.snake.move(dir);
		HtmlHelper.snake.foreach(function(x, y, i) {
			HtmlHelper.tableElement.rows[y].cells[x].style.backgroundColor = HtmlHelper.colors[1];
		});
	},

	getRandomPos: function(x, y, color) {
		return new Point(parseInt(Math.random() * x), parseInt(Math.random() * y), color);
	},

	createTable: function(rowCount, cellCount, cellWidth, cellHeight) {
		var table = document.createElement("table");
		table.style.borderCollapse = "collapse";
		table.style.border = "1px solid #ccc";
		table.style.float = "left";
		table.style.marginRight = "20px";

		for (var i = 0; i < rowCount; i++) {
			var row = table.insertRow();
			for (var j = 0; j < cellCount; j++) {
				var cell = row.insertCell();
				cell.style.width = cellWidth + "px";
				cell.style.height = cellHeight + "px";
				cell.style.border = "1px solid #ddd";
				cell.style.backgroundColor = "#f2f2f2";
			}
		}

		return table;
	}
};

window.onload = HtmlHelper.init;