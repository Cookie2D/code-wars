const chai = require("chai");
const assert = chai.assert;
chai.config.truncateThreshold = 0;

function testMaze(expected, maze) {
  let actual = pathFinder(maze);
  assert.strictEqual(actual, expected, maze);
}

describe("Peth  Finder Tests", function () {
  it("Basic tests", function () {
    testMaze(
      true,
      `.W.
.W.
...`
    );

    testMaze(
      false,
      `.W.
.W.
W..`
    );

    testMaze(
      true,
      `......
......
......
......
......
......`
    );

    testMaze(
      false,
      `......
......
......
......
.....W
....W.`
    );
  });
});
