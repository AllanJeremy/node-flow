"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _score = require("./score");

var _output = require("./output");

var _helper = require("./helper");

class MatchingAlgorithm {
  constructor(obj) {
    this.showOriginal = false;
    this.decimals = 2;
    this.matchIndex = 10;
    this.verbose = 0;

    for (const key in obj) this[key] = obj[key];

    if (this.verbose) (0, _helper.log)(`[MatchingAlgorithm] - Initialized`, null, true);
  }

  match(obj) {
    const dists = (0, _score.calculateItemDistance)({
      obj,
      keys: this.keys,
      array: this.source,
      showOriginal: this.showOriginal
    });
    
    const {
      results,
      max
    } = (0, _score.calculateResults)(dists, this.source);
    const oresult = (0, _output.output)({
      max,
      results,
      index: this.matchIndex,
      decimals: this.decimals
    });

    this._resetAll();

    return oresult;
  }

  log() {
    console.log(`hello world`);
  }

  _resetAll() {
    (0, _score.resetScore)();
    (0, _output.resetOutput)();
  }

}

var _default = MatchingAlgorithm;
exports.default = _default;
