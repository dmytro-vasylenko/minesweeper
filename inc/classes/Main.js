require.config({
	baseUrl: "inc/classes/",
	paths: {
		Main: "Main",
		Drawer: "Drawer"
	}
});

const MINE = "M";
const FLAG = "F";
const WIDTH = 600;
const HEIGHT = 600;
const WIDTH_CELLS = 20;
const HEIGHT_CELLS = 20;
const MINES = 40;

require(["Field"], function(Field) {
	var field = new Field({
		width: WIDTH_CELLS,
		height: HEIGHT_CELLS,
		mines: MINES,
		elem: document.getElementById("field")
	});
});