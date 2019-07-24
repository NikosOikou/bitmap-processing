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

var setCoord = function (coord, value) {
  obj[coord[0] + "," + coord[1]] = {"coord": coord, "value": value};
};

var setDistance = function (coord, value) {
  distances[coord[0] + "," + coord[1]] = {"coord": coord, "value": value};
};

var getCoord = function (coord) {
  return obj[coord[0] + "," + coord[1]];
};

var getCoordUp = function (coord) {
  return obj[(coord[0] - 1) + "," + coord[1]];
};

var getCoordLeft = function (coord) {
  return obj[coord[0] + "," + (coord[1] - 1)];
};

var getCoordDown = function (coord) {
  return obj[(coord[0] + 1) + "," + coord[1]];
};

var getCoordRight = function (coord) {
  return obj[coord[0] + "," + (coord[1] + 1)];
};

var getDistance = function (pnt1, pnt2) {
  var x0 = pnt1.coord[0];
  var y0 = pnt1.coord[1];
  var x1 = pnt2.coord[0];
  var y1 = pnt2.coord[1];
  return Math.abs(x1 - x0) + Math.abs(y1 - y0);
};

var setupObj = function(rows, num_rows, num_cols) {
  obj = {};

  for (var x = 0; x < num_rows; x++) {
    var row = rows[x];
    var values = row.split("");

    for (var y = 0; y < values.length; y++) {
      var value = values[y];
      setCoord([x, y], parseInt(value));
    }
  }

  // Setup boundary conditions

  for (var x = 0; x < num_rows; x++) {
    setCoord([x, -1], -1);    // top boundary
    setCoord([x, num_cols], -1);   // bottom boundary
  }

  for (var x = 0; x < num_cols; x++) {
    setCoord([-1, x], -1);   // left boundary
    setCoord([num_rows, x], -1);  // right boundary
  }
  return obj;
}

// Start solution

var data = fs.readFileSync("input.txt", "utf8");
var data_arr = data.split("\n\n");
var result = "";

for (var [i, row] of data_arr.entries()) {

  if (i == 0) {
    var idx = 1;
  } else {
    var idx = 0;
  }

  var dims = row.split("\n")[idx];
  var num_rows = parseInt(dims.split(" ")[0]);
  var num_cols = parseInt(dims.split(" ")[1]);
  var row_arr = row.split("\n");
  var rows = row_arr.slice(idx+1, row_arr.length);
  var obj = setupObj(rows, num_rows, num_cols);
  var obj_old = Object.assign({}, obj);
  var distances = {};

  // For every pixel in the bitmap find minimum distance
  for (var x = 0; x < num_rows; x++) {

    for (var y = 0; y < num_cols; y++) {

      var queue = [];
      var closest = -1;
      var pnt = getCoord([x, y]);
      var start = pnt;

      if (pnt.value === 1) {
        closest = pnt;
      }

      while (closest === -1) {

        for (var elem of [
          getCoordUp(pnt.coord),
          getCoordLeft(pnt.coord),
          getCoordDown(pnt.coord),
          getCoordRight(pnt.coord)
        ]) {

          var pnt_temp = getCoord(elem.coord);

          if (pnt_temp.value === 1) {
            closest = pnt_temp;
            break
          }

          if (pnt_temp.value != -1) {
            queue.push(pnt_temp);
          }
        }

        if (closest == -1) {
          setCoord(pnt.coord, -1);
        }

        pnt = queue.shift();

      }
      var distance = getDistance(start, closest);
      setDistance([x, y], distance);

      // Reset obj
      var obj = Object.assign({}, obj_old);
    }
  }

  if (result != "") {
    result += "\n";
  }

  for (var x = 0; x < num_rows; x++) {

    for (var y = 0; y < num_cols; y++) {
      var distance = distances[x + "," + y].value;
      result += distance + " ";
    }

    result = result.trim();
    result += "\n";
  }
}

fs.writeFileSync("output.txt", result);
