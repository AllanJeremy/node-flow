"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = void 0;

const log = (msg, color = `grey`, bold = 0, options = []) => {
  console.log(`%c${msg}`, `color:${color};${bold ? `font-weight:bold;` : null}${options}`);
};

exports.log = log;
