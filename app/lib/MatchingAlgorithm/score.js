"use strict";

exports.default = exports.calculateResults = exports.calculateItemDistance = exports.resetScore = void 0;

var _math = require("./Math");

let dists = {};
let max;

const resetScore = () => dists = {};
const pushScore = (i, v) => { return dists[i].push(v)};

const calculateScore = id => {
  return setmax(dists[id].reduce((a, b) =>  a + b, 0));
};

const setmax = score => {
  if (max < score || max === undefined) max = score;
  return score;
};

const compareKeys = (key, m, i, obj) => {

    if(i[key] != null && i[key].length > 0) {
      switch (typeof i[key]) {

        case `string`:
          if (obj[key] !== i[key]) pushScore(i.id, 1 * m);
          break;

        case `number`:
          pushScore(i.id, (0, _math.calcDist)(i[key], obj[key]) * m);
          break;

        case 'object':
          var matched = obj[key].filter(function(el) {
            return i[key].indexOf(el) >= 0;
          }).length;

          pushScore(i.id, (0, _math.calcDist)(matched, obj[key].length) * m);
          break;
      }
    }
};

const calculateItemDistance = ({
  keys,
  array,
  obj,
  showOriginal
}) => {
  keys.map(({
    key,
    m
  }) => {
    array.map(data => {
      let i = data._source;
      const {
        id
      } = i;
      if(obj.id == id) return;
      if(obj.listed_peers && obj.listed_peers.indexOf(id) != -1) return;
      if(obj.delisted_peers && obj.delisted_peers.indexOf(id) != -1) return;
      if(obj.declined_peers && obj.declined_peers.indexOf(id) != -1) return;
      if (!(key in i) || !obj[key] || id === obj.id && !showOriginal) return;
      if (!dists[id]) dists[id] = [];
      compareKeys(key, m, i, obj);
    });
  });
  return dists;
};

exports.calculateItemDistance = calculateItemDistance;

const calculateResults = (d, a) => {
  const results = [];

  for (const id in d) {
    const score = calculateScore(id);
    results.push({
      score,
      item: a.filter(i => i._source.id.toString() === id.toString())[0]._source
    });
  }

  return {
    results: results.sort((a, b) => a.score - b.score),
    max
  };
};

exports.resetScore = resetScore;

exports.calculateResults = calculateResults;
var _default = {
  calculateItemDistance,
  calculateResults,
  resetScore
};
exports.default = _default;
