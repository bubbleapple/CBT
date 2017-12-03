// TODO: perform the graph and the tree seperately

// FUNCTION: plot_point(pnt)
//      plot one point on the current canvas.
// PARAMETERS:
//      pnt: an instance of MST_SPT.Point
// RETURN:
//      void
//
function plot_point(pnt) {
    var myCircle =
        new paper.Path.Circle(new paper.Point(pnt.vector[0],pnt.vector[1]), 5);
    myCircle.strokeColor = 'black';
    myCircle.fillColor = 'black';
}

// FUNCTION: plot_tree(set)
//      plot the set on the current canvas
// PARAMETERS:
//      set: set of points(MST_SPT.Point)
// RETURN:
//      void
//
function plot_tree(set) {
    for(let pnt of set) {
        // plot the point
        plot_point(pnt);

        // plot the edge
        for(let pnt1 of pnt.neighbors) {
            var path = new paper.Path();
            path.strokeColor = 'black';
            path.add(new paper.Point(pnt.vector[0],pnt.vector[1]));
            path.add(new paper.Point(pnt1.vector[0],pnt1.vector[1]));
        }
    }
}

// FUNCTION: plot_points(set)
//      plot all the points in the set on the current canvas.
// PARAMETERS:
//      set: a Set instance of MST_SPT.Point
// RETURN:
//      void
//
function plot_points(set) {
    for(let pnt of set) {
        plot_point(pnt);
    }
}

// FUNCTION: plot_wrapper(set, canvasId)
//      set the plot canvas and draw the plot.
// PARAMETERS:
//      set: set of points(MST_SPT.Point)
//      canvas: canvas object from dom.
//      func: the function determining how to plot the set
//          choose from: plot_tree, plot_points
// RETURN:
//      void
//
function plot_wrapper(set, canvas, func) {
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);

    func(set);
	// Draw the view now:
	paper.view.draw();
}

// FUNCTION: plot_mst(set, source, canvasId)
//      plot the mst tree from the set, started at source on the canvas of canvasId
// PARAMETERS:
//      set: set of points(MST_SPT.Point)
//      source: assigned source for the mst Tree
//      canvas: canvas object from dom.
// RETURN:
//      void
//
function plot_mst(set, source, canvas) {
    console.log(set);
    plot_wrapper(PrimsMST(set, source), canvas, plot_tree);
}

// FUNCTION: plot_spt(set, source, canvasId)
//      plot the spt tree from the set, started at source on the canvas of canvasId
// PARAMETERS:
//      set: set of points(MST_SPT.Point)
//      source: assigned source for the mst Tree
//      canvas: canvas object from dom.
// RETURN:
//      void
//
function plot_spt(set, source, canvas) {
    plot_wrapper(SPT(set, source), canvas, plot_tree);
}

function plot_freetree(set, source, value, canvas) {
    plot_wrapper(getTree(set, source, value), canvas, plot_tree);
}

// FUNCTION: plot_points_in(set, canvas)
//      plot all the points from the set
// PARAMETERS:
//      set: set of points(MST_SPT.Point)
//      canvas: canvas object from dom.
// RETURN:
//      void
//
function plot_points_in(set, canvas) {
    plot_wrapper(set, canvas, plot_points);
}
