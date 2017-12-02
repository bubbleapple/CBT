"use strict";
// Point class
function Point(vector = [])
{
    this.vector = vector;
    this.neighbors = [];
    Point.prototype.toString = function ()
    {
        let res = "(" + this.vector + ") ---  ";
        for(let x of this.neighbors)
        {
            res += '(' + x.vector + ') ';
        }
        return res;
    }

 }

// FUNCTION: copyGraph(G1)
//      return a copy of the entire graph G1. Each point will be newly
//      created.
// PARAMETERS:
//      G1    -   Graph to be copied
// RETURN:
//      a new Graph.
// NOTICE:
//      The element of the vector member of each point is assumed to be
//      primitive type, so that they are pushed into the new point's vector
//      array directly.

function copyGraph(G1)
{
    let m = new Map();
    let v;
    let G2 = new Set();
    for (let u of G1)
    {
        v = new Point();
        for (let x of u.vector)
            v.vector.push(x);
        m.set(u, v);
    }
    for (let u of G1)
    {
        v = m.get(u);
        for (let x of u.neighbors)
            v.neighbors.push(m.get(x));
        G2.add(v);
    }
    return G2;
}


// FUNCTION: arrayEqual(a, b)
//      compare the elements of two arrays one by one to determine if they
//      are the same.
// PARAMETERS:
//      u, v    -   Two object of Point class
// RETURN:
//      true if two arrays have same size and elements are the same at every
//      index. Otherwise, return false.
//
function arrayEqual(a, b)
{
    if (a.length != b.length)
        return false;
    else
    {
        for(let i = 0; i < a.length; i++)
        {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
}


// FUNCTION: metric(u, v, type)
//      calculate the distance between two Points
// PARAMETERS:
//      u, v    -   Two object of Point class
//      type    -   specify which type of distance it is going to calculate:
//                  "euclidean" -   euclidean distance (default)
//                  "manhattan" -   manhattan distance
// RETURN:
//      distance between u and v
//
function metric(u, v, type = "euclidean")
{
    let distance = 0;
    // Euclidean Distance:
    if(type === "euclidean")
    {
        for(let i = 0; i < u.vector.length; i++)
            distance += Math.pow((u.vector[i] - v.vector[i]), 2);
        distance = Math.sqrt(distance);
    }
    else if (type === "manhattan")
    {
        for(let i = 0; i < u.vector.length; i++)
            distance += Math.abs(u.vector[i] - v.vector[i]);
    }
    else
        console.log("ERROR: Unsupport metric type!!");
    return distance;
}


// FUNCTION: radius(T, s, metricType = "euclidean", fullmesh = true) 
//      calculate the radius of an SPT T
// PARAMETERS:
//      T           -   SPT to be calculated
//      metricType  -   specify which type of distance it is going to calculate:
//                         "euclidean" -   euclidean distance (default)
//                         "manhattan" -   manhattan distance
//      fullmesh    -   whether the graph is treated as a full mesh topo
// RETURN:
//      radius of the T. See NOTICE for details.
// NOTICE:
//      If the parameter T is NOT a SPT but a normal graph, and the fullmesh
//      is set to false, the result returned is the longest acyclic path of
//      the graph, not actually the radius.
//
function radius(T, s, fullmesh = true, metricType = "euclidean")
{
    var radius = 0;
    if(fullmesh)
    {
        for (let v of T)
            radius = Math.max(radius, metric(s, v, metricType)); // assuming metric(s, s) == 0
    }
    else
    {
        function DFS(p, pathLength)
        {
            if(p.visited === undefined)
            {
//                 console.log("Visiting %s ||| path is %d", p, pathLength);
                p.visited = true;
                radius = Math.max(radius, pathLength);
                for (let c of p.neighbors)
                    DFS(c, pathLength + metric(p, c, metricType));
                delete p.visited;
            }
        }
        DFS(s, 0);
    }
    return radius;
}



// FUNCTION: PrimsMST(vertices, startVertex)
//      find the MST using Prim's algorithm
// PARAMETERS:
//      vertices    -   a Set object containing all the points
//      startVertex -   the root of the MST
//      fullmesh    -   whether the topo is treated as full mesh or not
//      metricType  -   parameter for metric()
// RETURN:
//      MST represented by a set of Points
function PrimsMST(vertices, startVertex, fullmesh = true, metricType = "euclidean")
{
    return getTree(vertices, startVertex, 0, fullmesh, metricType);
}


// FUNCTION SPT(vertices, startVertex)
//      find out the SPT using Dijkstra's algorithm
// PARAMETERS:
//      vertices    -   a Set object containing all the points
//      startVertex -   the root of the SPT
//      fullmesh    -   whether the topo is treated as full mesh or not
//      metricType  -   parameter for metric()
// RETURN:
//      SPT represented by a set of Points
function SPT(vertices, startVertex, fullmesh = true, metricType = "euclidean")
{
    return getTree(vertices, startVertex, 1, fullmesh, metricType);
}




// FUNCTION getTree(vertices, startVertex, e, fullmesh = true, metricType = "euclidean")
//      find out the SPT using Dijkstra's algorithm
// PARAMETERS:
//      vertices    -   a Set object containing all the points
//      startVertex -   the root of the tree generated
//      e           -   epsilone, used to tune the weight of the path
//      fullmesh    -   whether the topo is treated as full mesh or not
//      metricType  -   parameter for metric()
// RETURN:
//      SPT represented by a set of Points
function getTree(vertices, startVertex, e, fullmesh = true, metricType = "euclidean")
{
    var S = new Set();              // the graph to be returned
    var T = copyGraph(vertices);      // a copy of parameter vertices
    
    // mark the starting vertex
    for(let p of T)
    {
        if(arrayEqual(startVertex.vector, p.vector))
            p.path = {parent: null, length : 0};
        else
            p.path = {parent: null, length : Infinity};
        p.Tneighbors = [];
    }

    while (T.size > 0)
    {
        let minVertex = null;
        let neighbors = null;
        // find the vertex having the min path
        for(let u of T)
        {
            if (minVertex == null || (u.path.length < minVertex.path.length))
                minVertex = u;
        }
        // remove the vertex from the set
        T.delete(minVertex);
        // update the edge in the SPT
        if(minVertex.path.parent !== null)
        {
            minVertex.Tneighbors.push(minVertex.path.parent);
            minVertex.path.parent.Tneighbors.push(minVertex);
        }

        // figure out the neighbor set
        if (fullmesh)
            neighbors = T;
        else
            neighbors = minVertex.neighbors.filter( v => T.has(v));
        
        // update neighbor's distance
        let distance = Infinity;
        for(let v of neighbors)
        {
            distance =  e * minVertex.path.length + metric(minVertex, v, metricType);
            if (v.path.length > distance)
            {
                // update v's path:
                v.path.parent = minVertex;
                v.path.length = distance;

//                 console.log("update %s's path to be %s\n", v.vector, v.path.length);
            }
        }
        delete minVertex.path;
        S.add(minVertex);
//         console.log("added %s into the solution set.\n", minVertex.vector);
    }
    // clear the auxiliary Tneighbors array
    for(let v of S)
    {
        v.neighbors =v.Tneighbors;
        delete v.Tneighbors;
    }

    return S;
}







///////////////////////////////////////////////////////////////////////////////
// below are merely testing codes:

function printGraph(V)
{
    for(let v of V)
    {
        console.log("%s", v);
    }
}




function test()
{

    let V = new Set();
    let a = new Point([1, 1]);
    let b = new Point([2, 2]);
    let c = new Point([3, 3]);
    let d = new Point([2, 3]);
    let e = new Point([3, 2]);

    V.add(a);
    V.add(b);
    // V.add(c);
    V.add(d);
    V.add(e);


    a.neighbors = [d, e];
    b.neighbors = [e, d];
    // c.neighbors = [b, e, d];
    d.neighbors = [a, b];
    e.neighbors = [a, b];

    // kaka = SPT(V, b);
    //
    console.log("\n\nGraph V is :");
    printGraph(V);
    console.log("\nPrim's MST, full mesh:");
    printGraph(PrimsMST(V, a));


    console.log("\n\nGraph V is :");
    printGraph(V);
    console.log("\nSPT, full mesh:");
    printGraph(SPT(V, a));


    // test for radius:
    console.log("\n\nGraph V is :");
    printGraph(V);
    console.log("radius of the original graph is %d", radius(SPT(V, a, true, 'manhattan'), a, true, "manhattan"));


    console.log("\n\nGraph V is :");
    printGraph(V);
    console.log("\nPrim's MST, NOT fullmesh:");
    printGraph(PrimsMST(V, a, false, "manhattan"));

    console.log("\n\nGraph V is :");
    printGraph(V);
    console.log("\nSPT, NOT fullmesh:");
    printGraph(SPT(V, a, false , "manhattan"));


}


test();
