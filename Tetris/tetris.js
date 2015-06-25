var Shape = function(arr) {
	this.arr = arr;
	this.top = 0;
	this.left = 0;
	this.matrix = [
		[0, 0, 3, 0],
		[1, 0, 3, 1],
		[2, 0, 3, 2],
		[3, 0, 3, 3],
		[0, 1, 2, 0],
		[1, 1, 2, 1],
		[2, 1, 2, 2],
		[3, 1, 2, 3],
		[0, 2, 1, 0],
		[1, 2, 1, 1],
		[2, 2, 1, 2],
		[3, 2, 1, 3],
		[0, 3, 0, 0],
		[1, 3, 0, 1],
		[2, 3, 0, 2],
		[3, 3, 0, 3]
	];
};

Shape.create = function() {
	var data = [
		[0, 0, 1, 0, 2, 0, 3, 0, "#ff6600"], // 一
		[0, 0, 0, 1, 0, 2, 0, 3, "#012323"], // 1
		[0, 0, 0, 1, 0, 2, 1, 2, "#ff0066"], // L
		[1, 0, 1, 1, 1, 2, 0, 2, "#6600ff"], // 反L
		[0, 0, 1, 0, 1, 1, 2, 1, "#00ff66"], // z
		[0, 1, 1, 1, 1, 0, 2, 0, "#607990"], // 反z
		[1, 0, 0, 1, 1, 1, 2, 1, "#1079ff"], // 上
		[0, 0, 1, 0, 2, 0, 1, 1, "#987909"], // 下
		[0, 0, 0, 1, 1, 1, 1, 2, "#792233"], // 竖z
		[1, 0, 1, 1, 0, 1, 0, 2, "#799955"] // 反竖z
	];
	return new Shape(data[parseInt(Math.random() * 10)]);
};

Shape.prototype.getColor = function() {
	return this.arr[8];
};

Shape.prototype.update = function(x, y) {
	this.left += x;
	this.top += y;
};

Shape.prototype.intCompare = function(x, y) {
	return parseInt(x) === parseInt(y);
};

Shape.prototype.getChangePoint = function(x, y) {
	var obj = null;
	var len = this.matrix.length;
	for (var i = 0; i < len; i++) {
		if (this.intCompare(x, this.matrix[i][0]) && this.intCompare(y, this.matrix[i][1])) {
			obj = {
				x: this.matrix[i][2],
				y: this.matrix[i][3]
			};
			break;
		}
	}
	return obj;
};

Shape.prototype.containPosition = function(x, y) {
	var flag = false;
	var arr = this.getRelativePosition();
	for (var i = 0, len = arr.length; i < len; i++) {
		if (this.intCompare(x, arr[i].x) && this.intCompare(y, arr[i].y)) {
			flag = true;
			break;
		}
	}
	return flag;
};

Shape.prototype.change = function() {
	var arr = [];
	var brr = this.getRelativePosition();
	for (var i = 0, len = brr.length; i < len; i++) {
		var obj = this.getChangePoint(brr[i].x, brr[i].y);
		if (obj) {
			arr.push(obj.x);
			arr.push(obj.y);
		}
	}

	for (var i = 0, len = arr.length; i < len; i++) {
		this.arr[i] = arr[i];
	}
};

Shape.prototype.getRelativePosition = function() {
	var arr = [];
	arr.push({
		x: this.arr[0],
		y: this.arr[1]
	});
	arr.push({
		x: this.arr[2],
		y: this.arr[3]
	});
	arr.push({
		x: this.arr[4],
		y: this.arr[5]
	});
	arr.push({
		x: this.arr[6],
		y: this.arr[7]
	});
	return arr;
};

Shape.prototype.getPosition = function() {
	var arr = this.getRelativePosition();
	for (var i = 0, len = arr.length; i < len; i++) {
		arr[i].x = this.left + arr[i].x;
		arr[i].y = this.top + arr[i].y;
	}
	return arr;
};


Shape.prototype.getMovePosition = function(x, y) {
	var arr = [];
	var brr = this.getPosition();

	for (var i = 0, len = brr.length; i < len; i++) {
		var newX = brr[i].x + x;
		var newY = brr[i].y + y;
		var flag = this.containPosition(newX - this.left, newY - this.top);

		if (!flag) {
			arr.push({
				x: newX,
				y: newY
			});
		}
	}

	return arr;
};

Shape.prototype.getChangePosition = function() {
	var arr = [];
	var brr = this.getRelativePosition();

	for (var i = 0, len = brr.length; i < len; i++) {
		var obj = this.getChangePoint(brr[i].x, brr[i].y);
		if (obj) {
			var flag = this.containPosition(obj.x, obj.y);
			if (!flag) {
				arr.push({
					x: this.left + obj.x,
					y: this.top + obj.y
				});
			}
		}
	}

	return arr;
};

var HtmlHelper = {
	tableElement: null,
	nextElement: null,
	scoreElement: null,

	createDom: function(option) {
		var table = document.createElement("table");
		var row = table.insertRow();
		var cell = row.insertCell();
		HtmlHelper.tableElement = HtmlHelper.createTable(option.row, option.cell, option.cellWidth, option.cellHeight);
		cell.appendChild(HtmlHelper.tableElement);
		HtmlHelper.nextElement = HtmlHelper.createTable(option.box, option.box, option.cellWidth, option.cellHeight);
		cell = row.insertCell();
		cell.style.verticalAlign = "top";
		cell.appendChild(HtmlHelper.nextElement);
		var div = document.createElement("div");
		div.style.height = "40px";
		div.style.lineHeight = "40px";
		div.style.fontSize = "22px";
		div.style.textAlign = "center";
		div.innerHTML = "得分：0";
		cell.appendChild(div);
		HtmlHelper.scoreElement = div;
		document.body.appendChild(table);
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
	},

	disNextShape: function(shape) {
		var arr = shape.getRelativePosition();
		var rowCount = HtmlHelper.nextElement.rows.length;
		for (var i = 0; i < rowCount; i++) {
			var cellCount = HtmlHelper.nextElement.rows[i].cells.length;
			for (var j = 0; j < cellCount; j++) {
				HtmlHelper.nextElement.rows[i].cells[j].style.backgroundColor = "#f2f2f2";
			}
		}

		for (var i = 0, len = arr.length; i < len; i++) {
			HtmlHelper.nextElement.rows[arr[i].y].cells[arr[i].x].style.backgroundColor = shape.getColor();
		}
	},

	move: function(shape, x, y) {
		var arr = shape.getPosition();
		for (var i = 0, len = arr.length; i < len; i++) {
			HtmlHelper.tableElement.rows[arr[i].y].cells[arr[i].x].style.backgroundColor = "#f2f2f2";
		}
		shape.update(x, y);
		arr = shape.getPosition();
		for (var i = 0, len = arr.length; i < len; i++) {
			HtmlHelper.tableElement.rows[arr[i].y].cells[arr[i].x].style.backgroundColor = shape.getColor();
		}
	},

	change: function(shape) {
		var arr = shape.getPosition();
		for (var i = 0, len = arr.length; i < len; i++) {
			HtmlHelper.tableElement.rows[arr[i].y].cells[arr[i].x].style.backgroundColor = "#f2f2f2";
		}
		shape.change();
		arr = shape.getPosition();
		for (var i = 0, len = arr.length; i < len; i++) {
			HtmlHelper.tableElement.rows[arr[i].y].cells[arr[i].x].style.backgroundColor = shape.getColor();
		}
	},

	isFill: function(x, y) {
		var color = HtmlHelper.tableElement.rows[y].cells[x].style.backgroundColor;
		return !(color.toString() == "rgb(242, 242, 242)");
	},

	isFullLine: function(rowIndex, cellCount) {
		var flag = true;
		for (var i = 0; i < cellCount; i++) {
			if (!HtmlHelper.isFill(i, rowIndex)) {
				flag = false;
				break;
			}
		}
		return flag;
	},

	isEmptyLine: function(rowIndex, cellCount) {
		var flag = true;
		for (var i = 0; i < cellCount; i++) {
			if (HtmlHelper.isFill(i, rowIndex)) {
				flag = false;
				break;
			}
		}
		return flag;
	},

	calcLine: function() {
		var row = HtmlHelper.tableElement.rows.length;
		var cell = HtmlHelper.tableElement.rows[0].cells.length;

		for (var i = row - 1; i >= 0; i--) {
			if (HtmlHelper.isEmptyLine(i, cell)) {
				break;
			} else {
				if (HtmlHelper.isFullLine(i, cell)) {
					Tetris.removeLines += 1;
					HtmlHelper.scoreElement.innerHTML = "得分：" + Tetris.removeLines;
					for (j = i; j >= 0; j--) {
						if (HtmlHelper.isEmptyLine(j, cell)) {
							break;
						} else {
							for (var k = 0; k < cell; k++) {
								HtmlHelper.tableElement.rows[j].cells[k].style.backgroundColor = HtmlHelper.tableElement.rows[j - 1].cells[k].style.backgroundColor;
							}
						}
					}
					i++;
				}
			}
		}
	}
};

var Tetris = {
	option: {
		row: 20,
		cell: 15,
		cellWidth: 20,
		cellHeight: 20,
		box: 4
	},
	removeLines: 0,
	currentShape: null,
	nextShape: null,
	timeFun: null,

	init: function() {
		HtmlHelper.createDom(Tetris.option);
		Tetris.currentShape = Shape.create(); 
		Tetris.nextShape = Shape.create(); 
		Tetris.currentShape.update(parseInt((Tetris.option.cell - Tetris.option.box) / 2), 0);
		Tetris.timeFun = setInterval("Tetris.start()", 500);

		document.onkeyup = function(e) {
			var e = e || event;
			var currKey = e.keyCode || e.which || e.charCode;
			switch (currKey) {
				case 32: // 空格
					break;
				case 37: // 左移
					if (Tetris.canMove(-1, 0)) {
						HtmlHelper.move(Tetris.currentShape, -1, 0);
					}
					break;
				case 38: // 变形
					if (Tetris.canChange()) {
						//Tetris.currentShape.change();
						HtmlHelper.change(Tetris.currentShape);
					}
					break;
				case 39: // 右移
					if (Tetris.canMove(1, 0)) {
						HtmlHelper.move(Tetris.currentShape, 1, 0);
					}
					break;
				case 40: // 加速
					break;
			}
		};
	},

	start: function() {
		HtmlHelper.disNextShape(Tetris.nextShape);
		HtmlHelper.move(Tetris.currentShape, 0, 0);
		if (Tetris.canMove(0, 1)) {
			HtmlHelper.move(Tetris.currentShape, 0, 1);
		} else {
			if (Tetris.currentShape.top > 0) {
				HtmlHelper.calcLine();
				Tetris.currentShape = Tetris.nextShape;
				Tetris.nextShape = Shape.create(); 
				Tetris.currentShape.update(parseInt((Tetris.option.cell - Tetris.option.box) / 2), 0);
			} else {
				window.clearInterval(Tetris.timeFun);
				alert("game over");
			}
		}
	},

	canMove: function(x, y) {
		var flag = true;
		var shape = Tetris.currentShape;
		var cells = shape.getMovePosition(x, y);

		if (cells) {
			for (var i = 0, len = cells.length; i < len; i++) {
				if (cells[i].x < 0 || cells[i].x >= Tetris.option.cell || cells[i].y >= Tetris.option.row || HtmlHelper.isFill(cells[i].x, cells[i].y)) {
					flag = false;
					break;
				}
			}
		}

		return flag;
	},

	canChange: function() {
		var flag = true;
		var shape = Tetris.currentShape;
		var cells = shape.getChangePosition();

		if (cells) {
			for (var i = 0, len = cells.length; i < len; i++) {
				if (cells[i].x < 0 || cells[i].x >= Tetris.option.cell || cells[i].y >= Tetris.option.row || HtmlHelper.isFill(cells[i].x, cells[i].y)) {
					flag = false;
					break;
				}
			}
		}

		return flag;
	}
};

window.onload = Tetris.init;