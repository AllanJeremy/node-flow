"use strict";

exports.default = exports.resetOutput = exports.output = void 0;
var _math = require("./Math");

let mi = 0;

const output = ({
  results,
  max,
  index,
  decimals = 2
}) => {

  results.map((o, i) => {
    if (i % index === 0) mi++;
    const matchingPercent = (0, _math.roundDecimal)(Math.abs((0, _math.mapRange)(o.score, 0, max, 0, 100) - 100), decimals);
    setObject(o, {
      matchIndex: mi,
      score: (0, _math.mapRange)(o.score, 0, max, 0, 100),
      matching: `${!isNaN(matchingPercent) ? matchingPercent : 0}%`
    });
  });
  return results;
};

exports.output = output;

const setObject = (obj, keys) => {
  for (const key in keys) obj[key] = keys[key];
};

const resetOutput = () => {
  mi = 0;
};

exports.resetOutput = resetOutput;
var _default = {
  output,
  resetOutput
};
exports.default = _default;
