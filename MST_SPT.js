// Point class
function Point()
{
    this.vector = [];
    this.Gneighbors = [];
    this.Tneighbors = [];
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


// FUNCTION: metric(u, v)
//      calculate the distance between two Points
// PARAMETERS:
//      u, v    -   Two object of Point class
// RETURN:
//      distance between u and v
//
function metric(u, v)
{
    distance = 0;
    // Euclidean Distance:
    for(let i = 0; i < u.vector.length; i++)
    {
        distance += Math.pow((u.vector[i] - v.vector[i]), 2);
    }
    return Math.sqrt(distance);
}


// FUNCTION: PrimsMST(vertices, startVertex)
//      find the MST using Prim's algorithm
// PARAMETERS:
//      vertices    -   a Set object containing all the points
//      startVertex -   the root of the MST
// RETURN:
//      MST represented by a set of Points
function PrimsMST(vertices, startVertex, fullmesh = true)
{
    var S = new Set([startVertex]); // the graph to be returned
    var T = new Set(vertices);      // a copy of parameter vertices
    T.delete(startVertex);          // TODO: not working - remove root from the vertices set.

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
                neighbors = u.Gneighbors.filter( v => T.has(v));
            for (let v of neighbors)// V has all the points to be added
            {
                let distance = metric(u, v);
                if (distance < min.distance)
                {
                    min.distance = distance;
                    min.start = u;
                    min.end = v;
                }
            }
        }

        // update the neighbor set
        min.end.Tneighbors.push(min.start);
        min.start.Tneighbors.push(min.end);
        // add the new vertex into G and remove it from V
        S.add(min.end);
        T.delete(min.end);
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
function SPT(vertices, startVertex, fullmesh = true)
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
            neighbors = minVertex.Gneighbors.filter( v => T.has(v));
        
        // update neighbor's distance
        let distance = Infinity;
        for(let v of neighbors)
        {
            distance = minVertex.path.length + metric(minVertex, v);
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

    return S;
}

///////////////////////////////////////////////////////////////////////////////
// below are merely testing codes:

function neighbors(u)
{
    var res = "";
    for(let x of u.Tneighbors)
    {
        res += x.vector + ' ';
    }
    return res;
}

        
function printGraph(V)
{
    for(let v of V)
    {
        console.log("Point: %s neighbors: %s", v.vector, neighbors(v));
    }
}




V = new Set();
a = new Point();
b = new Point();
c = new Point();
d = new Point();
e = new Point();

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

console.log("\n\n\n");
console.log("SPT, full mesh:\n");
printGraph(SPT(V, a));



a.Gneighbors = [d, e];
b.Gneighbors = [e, d];
// c.Gneighbors = [b, e, d];
d.Gneighbors = [a, b];
e.Gneighbors = [a, b];
            

console.log("Prim's MST, NOT fullmesh:\n");
printGraph(PrimsMST(V, a, false));

console.log("\n\n\n");

console.log("SPT, NOT fullmesh:\n");
printGraph(SPT(V, a, false));
