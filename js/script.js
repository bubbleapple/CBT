V = new Set();

paper.install(window)
window.onload = function() {
	var canvas = document.getElementById('inputCanvas');
	var mstCanvas = document.getElementById('mstCanvas');
	var sptCanvas = document.getElementById('sptCanvas');
	var freeCanvas = document.getElementById('freeCanvas');
	var slider = document.getElementById("myRange");

	paper.setup(canvas);

	var tool = new Tool();
	// Define a mousedown and mousedrag handler

	// TODO: change the source color
	var source;

	tool.onMouseDown = function(event) {
		console.log(event.point.x);
		var temp = new MyPoint([event.point.x, event.point.y]);
		console.log(temp);
		if(V.size == 0) source = temp;
		V.add(temp);

		plot_points_in(V, canvas);

		plot_mst(V, source, mstCanvas);
		plot_spt(V, source, sptCanvas);
		plot_freetree(V, source, slider.value/100.0, freeCanvas);
	}

	slider.oninput = function() {
        // console.log(slider.value);
		plot_freetree(V, source, slider.value/100.0, freeCanvas);
	}
}
