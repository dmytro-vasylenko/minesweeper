define(["Drawer"], function(Drawer) {
	return class Field {
		constructor(props) {
			this.width = props.width;
			this.height = props.height;
			this.mines = props.mines;
			this.cells = [];
			this.elem = props.elem;
			this.drawer = new Drawer(this.elem);
			this.gameState = true;
			this.cursorFlag = false;


			this.elem.onclick = function(event) {
				let coords = this.toCoords({x: event.offsetX, y: event.offsetY});
				let x = coords.x;
				let y = coords.y;
				if(this.cells[x][y].state && this.flagsAround(x, y) == this.cells[x][y].value) {
					this.openNeighbours(x, y);
				}else {
					if(this.cursorFlag) {
						if(!this.cells[x][y].state) {
							this.toggleFlag(x, y);
						}
					} else if(!this.cells[x][y].flag) {
						this.openCell(x, y);
					}
				}
				if(this.checkWin()) {
					alert("Вы выиграли!");
					this.gameState = false;
				}
			}.bind(this);

			window.onkeydown = function(event) {
				this.toggleClick();
			}.bind(this);

			this.initCells();
			this.generateMines();
		}

		initCells() {
			for(let x = 0; x < this.width; x++) {
				let row = [];
				for(let y = 0; y < this.height; y++) {
					row.push({state: false, value: 0, flag: false});
					this.drawer.drawCell(x, y);
				}
				this.cells.push(row);
			}
		}

		generateMines() {
			for(let i = 0; i < this.mines; i++) {
				do {
					var x = Math.floor(Math.random()*(this.width - 1));
					var y = Math.floor(Math.random()*(this.height - 1));
				} while(this.cells[x][y].value == MINE);
				console.log({x, y, value: this.cells[x][y].value});
				this.addMine(x, y);
			}
		}

		addMine(x, y) {
			this.cells[x][y].value = MINE;
			this.upCellsValues(x, y);
		}

		upCellsValues(x, y) {
			let steps = [
				{x: -1, y: -1}, {x: -1, y: 0},
				{x: -1, y: 1}, {x: 0, y: -1},
				{x: 0, y: 1}, {x: 1, y: -1},
				{x: 1, y: 0},{x: 1, y: 1}
			];
			for(let i = 0; i < steps.length; i++) {
				let mX = x + steps[i].x;
				let mY = y + steps[i].y;
				if(this.isOnField(mX, mY) && this.cells[mX][mY].value != MINE) {
					this.cells[mX][mY].value += 1;
				}
			}
		}

		openCell(x, y) {
			if(!this.gameState)
				return;

			if(this.cells[x][y].value == MINE) {
				this.gameState = false;
				alert("Вы проиграли!");
				return;
			}
			if(!this.cells[x][y].state) {
				this.drawer.openCell(x, y, this.cells[x][y].value);
				this.cells[x][y].state = true;
			}
			if(this.cells[x][y].value == 0)
				this.openNeighbours(x, y);
		}

		openNeighbours(x, y) {
			let steps = [
				{x: 1, y: 0}, {x: -1, y: 0},
				{x: 0, y: -1}, {x: 0, y: 1},
				{x: 1, y: 1}, {x: -1, y: 1},
				{x: -1, y: -1}, {x: 1, y: -1}
			];

			for(let i = 0; i < steps.length; i++) {
				let cellX = x + steps[i].x;
				let cellY = y + steps[i].y;
				if(this.isOnField(cellX, cellY) && this.isEmpty(cellX, cellY)) {
					this.cells[x][y].state = true;
					this.openCell(cellX, cellY);
				}
			}
		}

		isOnField(x, y) {
			return x < this.width && x >= 0 && y < this.height && y >= 0;
		}

		isEmpty(x, y) {
			return !this.cells[x][y].state && !this.cells[x][y].flag;
		}

		checkWin() {
			let notEmptyCells = 0;
			for(let x = 0; x < this.width; x++) {
				for(let y = 0; y < this.height; y++) {
					if(this.isNotEmpty(x, y)) {
						notEmptyCells += 1;
					}
				}
			}
			let totalCells = this.width * this.height;
			return notEmptyCells == totalCells;
		}

		isNotEmpty(x, y) {
			return this.cells[x][y].state || this.cells[x][y].flag;
		}

		toggleFlag(x, y) {
			if(this.cells[x][y].flag) {
				this.removeFlag(x, y);
			} else {
				this.addFlag(x, y);
			}
		}

		addFlag(x, y) {
			this.cells[x][y].flag = true;
			this.drawer.drawFlag(x, y);
		}

		removeFlag(x, y) {
			this.drawer.refreshCell(x, y);
			this.cells[x][y].flag = false;
		}

		toggleClick() {
			if(this.elem.style.cursor == "crosshair") {
				this.elem.style.cursor = "url(inc/img/flag-mouse.png), auto";
			} else {
				this.elem.style.cursor = "crosshair";
			}
			this.cursorFlag = !this.cursorFlag;
		}

		print() {
			var result = "";
			for(let x = 0; x < this.width; x++) {
				for(let y = 0; y < this.height; y++) {
					result += this.cells[y][x].value + " ";
				}
				result += "\n";
			}
			console.log(result);
		}

		toCoords(mouseCoors) {
			return {
				x: Math.floor(mouseCoors.x/(WIDTH/WIDTH_CELLS)),
				y: Math.floor(mouseCoors.y/(HEIGHT/HEIGHT_CELLS))
			};
		}

		flagsAround(x, y) {
			let flags = 0;

			let steps = [
				{x: 1, y: 0}, {x: -1, y: 0},
				{x: 0, y: -1}, {x: 0, y: 1},
				{x: 1, y: 1}, {x: -1, y: 1},
				{x: -1, y: -1}, {x: 1, y: -1}
			];

			for(let i = 0; i < steps.length; i++) {
				let mX = x + steps[i].x;
				let mY = y + steps[i].y;
				if(this.isOnField(mX, mY) && this.cells[mX][mY].flag) {
					flags += 1;
				}
			}

			return flags;
		}
	}
});