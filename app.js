// Approach
// 1. Split input to test cases input
// 2. Parse test case input
// 3. Find distance to nearest white
// 3.1 Mark pixels around the image as visisted (-1)
// 3.2 Starting from a pixel, get pixels on up, left, down, right.
//     If a white pixel is found, calculate distance and exit.
//     If not put every pixel that is not state in a queue.
// 3.3 Mark current pixel as state (-1).
// 3.4 Dequeue an element from queue
// 3.5 Repeat 3.2-3.4 until a white pixel is found.
// 4. Repeat 2-3 for all test cases
// 5. Write output
var fs = require("fs");
var setCoord = function (obj, coord, value) {
    obj[coord[0] + "," + coord[1]] = { "coord": coord, "value": value };
};
var getPixel = function (obj, coord) {
    return obj[coord[0] + "," + coord[1]];
};
var getPixelUp = function (obj, coord) {
    return obj[(coord[0] - 1) + "," + coord[1]];
};
var getPixelLeft = function (obj, coord) {
    return obj[coord[0] + "," + (coord[1] - 1)];
};
var getPixelDown = function (obj, coord) {
    return obj[(coord[0] + 1) + "," + coord[1]];
};
var getPixelRight = function (obj, coord) {
    return obj[coord[0] + "," + (coord[1] + 1)];
};
var getDistance = function (pixel1, pixel2) {
    var x0 = pixel1.coord[0];
    var y0 = pixel1.coord[1];
    var x1 = pixel2.coord[0];
    var y1 = pixel2.coord[1];
    return Math.abs(x1 - x0) + Math.abs(y1 - y0);
};
var setupState = function (rows, num_rows, num_cols) {
    var state = {};
    // Exract white/black information and set it to
    // state object via the setCoord helper function
    // The value property of state holds the values
    // 1 and 0 for white and black, as well as -1 for
    // a state pixel or a boundary condition pixel.
    for (var i = 0; i < num_rows; i++) {
        var values = rows[i].split("");
        for (var j = 0; j < values.length; j++) {
            var value = values[j];
            setCoord(state, [i, j], parseInt(value));
        }
    }
    // Set boundary pixels on state object
    for (var i = 0; i < num_rows; i++) {
        setCoord(state, [i, -1], -1); // top boundary
        setCoord(state, [i, num_cols], -1); // bottom boundary
    }
    for (var i = 0; i < num_cols; i++) {
        setCoord(state, [-1, i], -1); // left boundary
        setCoord(state, [num_rows, i], -1); // right boundary
    }
    return state;
};
// Start solution
var data = fs.readFileSync("input.txt", "utf8");
var data_arr = data.split("\n\n");
var result = "";
var n = 0;
data_arr.forEach(function (row) {
    // Parse variables from string
    var idx = (n === 0) ? 1 : 0;
    var dims = row.split("\n")[idx];
    var num_rows = parseInt(dims.split(" ")[0]);
    var num_cols = parseInt(dims.split(" ")[1]);
    var rows = row.split("\n").slice(idx + 1);
    // state keeps the state of the solution
    state = setupState(rows, num_rows, num_cols);
    // Create a backup to reset state for every new
    // starting pixel
    var state_backup = Object.assign({}, state);
    var distances = {};
    // For every pixel in the bitmap find minimum distance
    for (var i = 0; i < num_rows; i++) {
        for (var j = 0; j < num_cols; j++) {
            var queue = [];
            var closest = -1;
            // Get starting pixel
            var pixel = getPixel(state, [i, j]);
            // Keep reference of starting pixel to
            // calculate distance with closest pixel
            // at the end
            var start = pixel;
            if (pixel.value === 1) {
                closest = pixel;
            }
            while (closest === -1) {
                // Check neighboring pixels
                for (var _i = 0, _a = [
                    getPixelUp(state, pixel.coord),
                    getPixelLeft(state, pixel.coord),
                    getPixelDown(state, pixel.coord),
                    getPixelRight(state, pixel.coord)
                ]; _i < _a.length; _i++) {
                    var elem = _a[_i];
                    var pixel_temp = getPixel(state, elem.coord);
                    // Exit if it is white
                    if (pixel_temp.value === 1) {
                        closest = pixel_temp;
                        break;
                    }
                    // Add to queue if it's not a boundary pixel
                    if (pixel_temp.value != -1) {
                        queue.push(pixel_temp);
                    }
                }
                // Set to visisted if current pixel wasn't the closest
                if (closest === -1) {
                    setCoord(state, pixel.coord, -1);
                }
                // Get next pixel from the queue
                pixel = queue.shift();
            }
            distances[i + "," + j] = getDistance(start, closest);
            // Reset state
            var state = Object.assign({}, state_backup);
        }
    }
    // Append a newline to beginning of ouput from
    // second iteration and on
    if (result != "") {
        result += "\n";
    }
    // Cast output to desired format
    for (var i = 0; i < num_rows; i++) {
        for (var j = 0; j < num_cols; j++) {
            result += distances[i + "," + j] + " ";
        }
        result = result.trim();
        result += "\n";
    }
    n++;
});
fs.writeFileSync("output.txt", result);
