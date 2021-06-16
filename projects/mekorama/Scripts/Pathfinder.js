// Start location will be in the following format:
// [distanceFromTop, distanceFromLeft]
//var layer = 5;
var findShortestPath = function (startCoordinates, grid) {
    var distanceFromTop = startCoordinates[0];
    var distanceFromLeft = startCoordinates[1];
    var layer = startCoordinates[2];

    // Each "location" will store its coordinates
    // and the shortest path required to arrive there
    var location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        layer: layer,
        path: [],
        status: 'Start'
    };

    // Initialize the queue with the start location already inside
    var queue = [location];

    // Loop through the grid searching for the goal
    while (queue.length > 0) {
        // Take the first location off the queue
        var currentLocation = queue.shift();

        // Explore North
        var newLocation = exploreInDirection(currentLocation, 'North', grid);
        if (newLocation.status === 20) {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore East
        var newLocation = exploreInDirection(currentLocation, 'East', grid);
        if (newLocation.status === 20) {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore South
        var newLocation = exploreInDirection(currentLocation, 'South', grid);
        if (newLocation.status === 20) {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore West
        var newLocation = exploreInDirection(currentLocation, 'West', grid);
        if (newLocation.status === 20) {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }
    }

    // No valid path found
    return false;

};

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
var locationStatus = function (location, grid) {
    var gridSize = grid.length;
    var dft = location.distanceFromTop;
    var dfl = location.distanceFromLeft;
    var layer = location.layer;

    if (location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= gridSize ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= gridSize) {

        // location is not on the grid--return false
        return 'Invalid';
    } else if (grid[layer][dft][dfl] === 20) {
        return 20;
    } else if (grid[layer][dft][dfl] !== 0) {
        // location is either an obstacle or has been visited
        return 'Blocked';
    } else {
        return 'Valid';
    }
};


// Explores the grid from the given location in the given
// direction
var exploreInDirection = function (currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);

    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;
    var layer = currentLocation.layer;

    if (direction === 'North') {
        dft -= 1;
    } else if (direction === 'East') {
        dfl += 1;
    } else if (direction === 'South') {
        dft += 1;
    } else if (direction === 'West') {
        dfl -= 1;
    }

    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        layer: layer,
        path: newPath,
        status: 'Unknown'
    };
    try {
        if (grid[layer][newLocation.distanceFromTop][newLocation.distanceFromLeft] == 13) {
            newLocation.layer++;
        }
    } catch (error) { }
    newLocation.status = locationStatus(newLocation, grid);

    // If this new location is valid, mark it as 'Visited'
    if (newLocation.status === 'Valid') {
        grid[layer][newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
    }

    return newLocation;
};


// OK. We have the functions we need--let's run them to get our shortest path!

// Create a 4x4 grid
// Represent the grid as a 2-dimensional array


// Think of the first index as "distance from the top row"
// Think of the second index as "distance from the left-most column"
var levelMap = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ], [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1],
        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 16, 0],
        [1, 1, 1, 1, 3, 1, 1, 16, 0, 0, 0]
    ], [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 16, 0],
        [1, 1, 3, 1, 1, 1, 1, 16, 0, 0, 0],
        [1, 1, 1, 1, 13, 7, 7, 7, 7, 0, 0],
        [1, 1, 1, 1, 0, 7, 7, 7, 7, 0, 0],
        [1, 1, 1, 16, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 11, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0],
        [13, 1, 1, 1, 1, 7, 7, 0, 8, 0, 0],
        [0, 0, 0, 0, 0, 7, 7, 0, 8, 0, 0],
        [0, 0, 0, 19, 0, 7, 7, 7, 10, 0, 0],
        [0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [1, 1, 1, 1, 1, 20, 2, 2, 2, 2, 2],
        [1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2],
        [2, 2, 2, 2, 3, 3, 3, 3, 6, 0, 0],
        [2, 2, 2, 2, 3, 3, 3, 3, 6, 0, 0],
        [13, 2, 2, 2, 3, 4, 4, 3, 6, 0, 0],
        [0, 2, 2, 2, 2, 4, 4, 0, 6, 0, 0],
        [0, 0, 0, 0, 0, 4, 4, 0, 6, 0, 0],
        [0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0],
        [0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [2, 2, 2, 2, 2, 20, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 3, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
        [0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
        [0, 17, 17, 0, 3, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
        [0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
        [0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 14, 3, 3, 15, 0, 0, 0],
        [0, 0, 0, 0, 14, 3, 3, 15, 0, 0, 0],
        [0, 0, 0, 0, 14, 3, 3, 15, 0, 0, 0],
        [0, 0, 0, 0, 14, 3, 3, 15, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ], [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 14, 15, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 12, 15, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 14, 15, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 14, 15, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
];
// This is how we would represent the grid with obstacles above


var startx = 3;
var starty = 7;
var startz = 2;
var newtest = findShortestPath([starty, startx, startz], levelMap);
var newertest = [];
var test = [];
for (var i = 0; i < newtest.length; i++) {
    if (newtest[i] != newtest[i - 1]) {
        newertest.push([newtest[i], i + 1]);
    }
}

for (var i = 0; i < newertest.length; i++) {
    if (newertest[i][0] == 'South') {
        starty -= newertest[i][1];
        test.push([starty, startx, startz]);
    } else if (newertest[i][0] == 'North') {
        starty += newertest[i][1];
        test.push([starty, startx, startz]);
    } else if (newertest[i][0] == 'East') {
        startx += newertest[i][1];
        test.push([starty, startx, startz]);
    } else if (newertest[i][0] == 'West') {
        startx -= newertest[i][1];
        test.push([starty, startx, startz]);
    }
}
console.log(newtest);
console.log(newertest);
console.log(test);