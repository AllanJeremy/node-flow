"use strict";

exports.default = exports.mapRange = exports.roundDecimal = exports.calcDist = exports.relu = void 0;

const relu = x => 1 / (1 + Math.pow(Math.E, -x));

exports.relu = relu;

const calcDist = (x1, x2) => Math.sqrt((x1 - x2) * (x1 - x2));

exports.calcDist = calcDist;

const roundDecimal = (n, d) => parseFloat(Math.round(n * 100) / 100).toFixed(d);

exports.roundDecimal = roundDecimal;

const mapRange = (n, x1, y1, x2, y2) => { return (n - x1) * (y2 - x2) / (y1 - x1) + x2 };

exports.mapRange = mapRange;
var _default = {
  relu,
  calcDist,
  roundDecimal,
  mapRange
};
exports.default = _default;
