define([], function() {
	return class Drawer {
		constructor(canvas) {
			this.canvas = canvas;
			this.context = this.canvas.getContext("2d");
		}

		drawCell(x, y, color = "#cecece") {
			let width = WIDTH/WIDTH_CELLS;
			let height = HEIGHT/HEIGHT_CELLS;

			this.context.fillStyle = color;
			this.context.fillRect(x*width + 1, y*height + 1, width - 1, height - 1);
		}

		openCell(x, y, data) {
			if(data == 0) {
				this.refreshCell(x, y);
				this.drawCell(x, y, "white");
			} else {
				let mX = (x + 0.5)*WIDTH/WIDTH_CELLS;
				let mY = (y + 0.75)*HEIGHT/HEIGHT_CELLS;

				this.context.font = "20px Arial";
				this.context.fillStyle = "black";
				this.context.textAlign = "center";
				this.context.fillText(data, mX, mY);
			}
		}

		drawFlag(x, y) {
			let img = document.getElementById("flag");
			this.context.drawImage(img, x*WIDTH/WIDTH_CELLS + 2, y*HEIGHT/HEIGHT_CELLS + 2, WIDTH/WIDTH_CELLS - 2, HEIGHT/HEIGHT_CELLS - 2);
		}

		refreshCell(x, y) {
			this.context.clearRect(x*WIDTH/WIDTH_CELLS, y*HEIGHT/HEIGHT_CELLS, WIDTH/WIDTH_CELLS, HEIGHT/HEIGHT_CELLS);
			this.drawCell(x, y);
		}
	}
});