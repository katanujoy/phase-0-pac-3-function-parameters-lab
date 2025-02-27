global.expect = require('expect');

const babel = require("@babel/core");
const { JSDOM } = require("jsdom"); // Use JSDOM instead of jsdom.env
const path = require("path");
const fs = require("fs");

before(function (done) {
  const babelResult = babel.transformFileSync(
    path.resolve(__dirname, "..", "index.js"),
    { presets: ["@babel/preset-env"] } // Use @babel/preset-env
  );

  const html = fs.readFileSync(path.resolve(__dirname, "..", "index.html"), "utf8");

  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable"
  });

  // Attach JSDOM window to global scope
  global.window = dom.window;
  global.document = dom.window.document;

  Object.keys(dom.window).forEach(key => {
    if (typeof global[key] === "undefined") {
      global[key] = dom.window[key];
    }
  });

  done();
});
