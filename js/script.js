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

    document.getElementById('freeCanvasE').innerHTML = "e = " + sliderSPT.value / 100.0;
    document.getElementById('BRBCCanvasE').innerHTML = "e = " + sliderBRBC.value;

	var radiusList = [document.getElementById('mstRadius'), document.getElementById('sptRadius'),
						document.getElementById('freeRadius'), document.getElementById('BRBCRadius')];
	var costList = [document.getElementById('mstCost'), document.getElementById('sptCost'),
						document.getElementById('freeCost'), document.getElementById('BRBCCost')];
    // 	paper.setup(MSTCanvas);
    var tool = new Tool();
    // Define a mousedown and mousedrag handler

    // TODO: change the source color
    var source;

    tool.onMouseDown = function(event) {
        var temp = new MyPoint([event.point.x, event.point.y]);
        if (V.size == 0)
            source = temp;
        V.add(temp);

        // 		plot_points_in(V, canvas);
        refreshRC(0, plot_mst(V, source, mstCanvas), source, radiusList, costList);
        refreshRC(1, plot_spt(V, source, sptCanvas), source, radiusList, costList);
        refreshRC(2, plot_freetree(V, source, sliderSPT.value / 100.0, freeCanvas), source, radiusList, costList);
        refreshRC(3, plot_brbc(V, source, sliderBRBC.value / 5.0, brbcCanvas), source, radiusList, costList);
    }

    sliderSPT.oninput = function() {
        let e = sliderSPT.value / 100.0;
        refreshRC(2, plot_freetree(V, source, e, freeCanvas), source, radiusList, costList);
        document.getElementById('freeCanvasE').innerHTML = "e = " + e;
    }

    sliderBRBC.oninput = function() {
        let e = sliderBRBC.value;
        refreshRC(3, plot_brbc(V, source, e, brbcCanvas), source, radiusList, costList);
        document.getElementById('BRBCCanvasE').innerHTML = "e = " + e;
    }
}

round = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

function refreshRC(index, tree, source, radiusList, costList) {
	//console.log(radius(tree, source, false));
	radiusList[index].innerHTML = round(radius(tree, findSource(tree, source), false),3);
	costList[index].innerHTML = round(graphCost(tree, false),3);
}
