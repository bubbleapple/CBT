"use strict";
// Point class
function Point()
{
    this.vector = [];
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


// FUNCTION: radius(G, s, metricType = "euclidean", fullmesh = true) 
//      calculate the radius of a graph G
// PARAMETERS:
//      G           -   Graph to be calculated
//      metricType  -   specify which type of distance it is going to calculate:
//                         "euclidean" -   euclidean distance (default)
//                         "manhattan" -   manhattan distance
//      fullmesh    -   whether the graph is treated as a full mesh topo
// RETURN:
//      radius of the graph
//
function radius(G, s, metricType = "euclidean", fullmesh = true)
{
    var radius = 0;
    if(fullmesh)
    {
        for (let v of G)
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
// RETURN:
//      MST represented by a set of Points
function PrimsMST(vertices, startVertex, metricType = "euclidean", fullmesh = true)
{
    var S = new Set([startVertex]); // the graph to be returned
    var T = new Set(vertices);      // a copy of parameter vertices
    for(let vertex of T)            // delete start vertex from the vertices set
    {
        if (arrayEqual(vertex.vector, startVertex.vector))
        {
            T.delete(vertex);
            break;
        }
    }
    
    // clear the Tree neighbor information:
    for(let item of S)
        item.Tneighbors = [];
    for(let item of T)
        item.Tneighbors = [];


    while (T.size > 0)
    {
        let min = {distance : Infinity, start : null, end : null};
        for (let u of S)    // S has all the points in the MST
        {
            let neighbors;
            if (fullmesh)
                neighbors = T;
            else
                neighbors = u.neighbors.filter( v => T.has(v));
            for (let v of neighbors)// V has all the points to be added
            {
                let distance = metric(u, v, metricType);
                if (distance < min.distance)
                {
                    min.distance = distance;
                    min.start = u;
                    min.end = v;
                }
            }
        }

        // update the tree neighbor list
        min.end.Tneighbors.push(min.start);
        min.start.Tneighbors.push(min.end);
        // add the new vertex into G and remove it from V
        S.add(min.end);
        T.delete(min.end);
    }
    // clear the auxiliary Tneighbors array
    for(let v of S)
    {
        v.neighbors =v.Tneighbors;
        delete v.Tneighbors;

    }


    return S;
}


// FUNCTION SPT(vertices, startVertex)
//      find out the SPT using Dijkstra's algorithm
// PARAMETERS:
//      vertices    -   a Set object containing all the points
//      startVertex -   the root of the MST
// RETURN:
//      SPT represented by a set of Points
function SPT(vertices, startVertex, metricType = "euclidean", fullmesh = true)
{
    var S = new Set();              // the graph to be returned
    var T = new Set(vertices);      // a copy of parameter vertices
    
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
            distance = minVertex.path.length + metric(minVertex, v, metricType);
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



let V = new Set();
let a = new Point();
let b = new Point();
let c = new Point();
let d = new Point();
let e = new Point();

a.vector = [1, 1];
b.vector = [2, 2];
c.vector = [3, 3];
d.vector = [2, 3];
e.vector = [3, 2];
V.add(a);
V.add(b);
// V.add(c);
V.add(d);
V.add(e);



// kaka = SPT(V, b);
console.log("Prim's MST, full mesh:\n");
printGraph(PrimsMST(V, a));

console.log("\n\n");
console.log("SPT, full mesh:");
printGraph(SPT(V, a));



a.neighbors = [d, e];
b.neighbors = [e, d];
// c.neighbors = [b, e, d];
d.neighbors = [a, b];
e.neighbors = [a, b];
            

// test for radius:
console.log("\n\nGraph V is :");
printGraph(V);
console.log("radius of the original graph is %d", radius(SPT(V, a, 'manhattan'), a, "manhattan", false));



console.log("\n\n");
console.log("Prim's MST, NOT fullmesh:");
printGraph(PrimsMST(V, a, "manhattan", false));

console.log("\n\n");

console.log("SPT, NOT fullmesh:");
printGraph(SPT(V, a, "manhattan", false));

