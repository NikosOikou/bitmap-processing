// Approach

// 1. Split input to test cases input
// 2. Parse test case input
// 3. Find distance to nearest white
// 3.1 Mark pixels around the image as visisted (-1)
// 3.2 Starting from a pixel, get pixels on up, left, down, right.
//     If a white pixel is found, calculate distance and exit.
//     If not put every pixel that is not visited in a queue.
// 3.3 Mark current pixel as visited (-1).
// 3.4 Dequeue an element from queue
// 3.5 Repeat 3.2-3.4 until a white pixel is found.
// 4. Repeat 2-3 for all test cases
// 5. Write output

var fs = require("fs");

var setCoord = function (obj, coord, value) {
  obj[coord[0] + "," + coord[1]] = {"coord": coord, "value": value};
};

var setDistance = function (distances, coord, value) {
  distances[coord[0] + "," + coord[1]] = {"coord": coord, "value": value};
};

var getCoord = function (obj, coord) {
  return obj[coord[0] + "," + coord[1]];
};

var getCoordUp = function (obj, coord) {
  return obj[(coord[0] - 1) + "," + coord[1]];
};

var getCoordLeft = function (obj, coord) {
  return obj[coord[0] + "," + (coord[1] - 1)];
};

var getCoordDown = function (obj, coord) {
  return obj[(coord[0] + 1) + "," + coord[1]];
};

var getCoordRight = function (obj, coord) {
  return obj[coord[0] + "," + (coord[1] + 1)];
};

var getDistance = function (pixel1, pixel2) {
  var x0 = pixel1.coord[0];
  var y0 = pixel1.coord[1];
  var x1 = pixel2.coord[0];
  var y1 = pixel2.coord[1];
  return Math.abs(x1 - x0) + Math.abs(y1 - y0);
};

var setupVisitedPixels = function(rows, num_rows, num_cols) {
  var visited = {};

  // Exract white/black information and set it to
  // visited object via the setCoord helper function
  // The value property of visited holds the values
  // 1 and 0 for white and black, as well as -1 for
  // a visited pixel or a boundary condition pixel.
  for (var x = 0; x < num_rows; x++) {
    var row = rows[x];
    var values = row.split("");

    for (var y = 0; y < values.length; y++) {
      var value = values[y];
      setCoord(visited, [x, y], parseInt(value));
    }
  }

  // Set boundary pixels as visited on visited object

  for (var x = 0; x < num_rows; x++) {
    setCoord(visited, [x, -1], -1);    // top boundary
    setCoord(visited, [x, num_cols], -1);   // bottom boundary
  }

  for (var x = 0; x < num_cols; x++) {
    setCoord(visited, [-1, x], -1);   // left boundary
    setCoord(visited, [num_rows, x], -1);  // right boundary
  }
  return visited;
}

// Start solution

var data = fs.readFileSync("input.txt", "utf8");
var data_arr = data.split("\n\n");
var result = "";
var n = 0;

data_arr.forEach(function(row) {

  if (n == 0) {
    var idx = 1;
  } else {
    var idx = 0;
  }

  // Parse variables from string
  var dims = row.split("\n")[idx];
  var num_rows = parseInt(dims.split(" ")[0]);
  var num_cols = parseInt(dims.split(" ")[1]);
  var row_arr = row.split("\n");
  var rows = row_arr.slice(idx+1, row_arr.length);

  // visited keeps the state of the solution
  visited = setupVisitedPixels(rows, num_rows, num_cols);

  // Create a backup to reset visited for every new
  // starting pixel
  var visited_backup = Object.assign({}, visited);
  var distances = {};

  // For every pixel in the bitmap find minimum distance
  for (var i = 0; i < num_rows; i++) {

    for (var j = 0; j < num_cols; j++) {

      var queue = [];
      var closest = -1;

      // Get starting pixel
      var pixel = getCoord(visited, [i, j]);

      // Keep reference of starting pixel to
      // calculate distance with closest pixel
      // at the end
      var start = pixel;

      if (pixel.value === 1) {
        closest = pixel;
      }

      while (closest === -1) {

        // Check neighboring pixels
        for (var elem of [
          getCoordUp(visited, pixel.coord),
          getCoordLeft(visited, pixel.coord),
          getCoordDown(visited, pixel.coord),
          getCoordRight(visited, pixel.coord)
        ]) {

          var pixel_temp = getCoord(visited, elem.coord);

          // Exit if it is white
          if (pixel_temp.value === 1) {
            closest = pixel_temp;
            break
          }

          // Add to queue if it's not a boundary pixel
          if (pixel_temp.value != -1) {
            queue.push(pixel_temp);
          }
        }

        // Set to visisted if current pixel wasn't the closest
        if (closest == -1) {
          setCoord(visited, pixel.coord, -1);
        }

        // Get next pixel from the queue
        pixel = queue.shift();

      }
      var distance = getDistance(start, closest);
      setDistance(distances, [i, j], distance);

      // Reset visited
      var visited = Object.assign({}, visited_backup);
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
      var distance = distances[i + "," + j].value;
      result += distance + " ";
    }

    result = result.trim();
    result += "\n";
  }

  n++;
});

fs.writeFileSync("output.txt", result);
