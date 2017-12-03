V = new Set();

paper.install(window)
window.onload = function() {
	var canvas = document.getElementById('inputCanvas');
	var mstCanvas = document.getElementById('mstCanvas');
	var sptCanvas = document.getElementById('sptCanvas');

	//TODO: move this to css file
    mstCanvas.width = 500;
    mstCanvas.height = 500;

	sptCanvas.width = 500;
	sptCanvas.height = 500;

	canvas.width = 500;
	canvas.height = 500;

	paper.setup(canvas);

	var tool = new Tool();
	// Define a mousedown and mousedrag handler

	// TODO: change the source color
	var source;

	tool.onMouseDown = function(event) {
		console.log(event.point.x);
		var temp = new Point();
		console.log(temp);
		if(V.size == 0) source = temp;
		V.add(temp);

		plot_points_in(V, canvas);

		plot_mst(V, source, mstCanvas);
		plot_spt(V, source, sptCanvas);
	}
}
