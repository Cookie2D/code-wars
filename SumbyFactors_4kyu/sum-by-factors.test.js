const chai = require("chai");
const { sumOfDivided } = require("./sum-by-factors");
const assert = chai.assert;
chai.config.truncateThreshold = 0;

function testing(arr, exp) {
  assert.deepEqual(sumOfDivided(arr), exp);
}

describe("Basic tests", function () {
  it("sumOfDivided", function () {
    testing(
      [12, 15],
      [
        [2, 12],
        [3, 27],
        [5, 15],
      ]
    );
    testing(
      [15, 21, 24, 30, 45],
      [
        [2, 54],
        [3, 135],
        [5, 90],
        [7, 21],
      ]
    );
  });
});
