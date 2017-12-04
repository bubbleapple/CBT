V = new Set();

paper.install(window)
window.onload = function() {
// 	var canvas = document.getElementById('inputCanvas');
	var mstCanvas = document.getElementById('mstCanvas');
	var sptCanvas = document.getElementById('sptCanvas');
	var freeCanvas = document.getElementById('freeCanvas');
	var brbcCanvas = document.getElementById('BRBCCanvas')
	var sliderSPT = document.getElementById("mySPTRange");
    var sliderBRBC = document.getElementById("myBRBCRange");

    paper.setup(mstCanvas);
	paper.setup(sptCanvas);
    paper.setup(freeCanvas);
	paper.setup(brbcCanvas);


// 	paper.setup(MSTCanvas);
	var tool = new Tool();
	// Define a mousedown and mousedrag handler

	// TODO: change the source color
	var source;

	tool.onMouseDown = function(event) {
		var temp = new MyPoint([event.point.x, event.point.y]);
        console.log(event.target);
		console.log(temp);
		if(V.size == 0)
            source = temp;
		V.add(temp);

// 		plot_points_in(V, canvas);
		plot_mst(V, source, mstCanvas);
		plot_spt(V, source, sptCanvas);
		plot_freetree(V, source, sliderSPT.value/100.0, freeCanvas);
		plot_brbc(V, source, sliderBRBC.value/100.0, brbcCanvas)
	}

	sliderSPT.oninput = function() {
        // console.log(slider.value);
		plot_freetree(V, source, sliderSPT.value/100.0, freeCanvas);
	}

	sliderBRBC.oninput = function () {
		console.log(sliderBRBC.value/100);
		plot_brbc(V, source, sliderBRBC.value/100.0, brbcCanvas)
	}
}
