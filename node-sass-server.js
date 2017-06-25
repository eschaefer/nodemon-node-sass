const sass = require("node-sass");
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");

const MAIN_SCSS_FILE = path.resolve(__dirname, "styles", "main.scss");

const CSS_DIR = path.resolve(__dirname, "dist");
const FIRST_PASS_CSS = path.resolve(CSS_DIR, "styles.css");
const SECOND_PASS_CSS = path.resolve(CSS_DIR, "styles.min.css");

const printFiles = files => {
  const splitFiles = files.reduce((acc, file) => {
    return `${acc}\n${file}`;
  }, "");

  return `Re-compiled Sass files: ${splitFiles}`;
};

const onFileWrite = (error, result) => {
  if (error) {
    return console.error(error);
  } else {
    console.log("👍");
    console.log(printFiles(result.stats.includedFiles));

    return applyPostCSS();
  }
};

const onRenderCallback = (error, result) => {
  if (error) {
    return console.error(error);
  }

  fs.writeFile(`${FIRST_PASS_CSS}.map`, result.map);

  return fs.writeFile(FIRST_PASS_CSS, result.css, err =>
    onFileWrite(err, result)
  );
};

const applyPostCSS = () => {
  return fs.readFile(FIRST_PASS_CSS, (err, css) => {
    postcss([autoprefixer, cssnano])
      .process(css, { from: FIRST_PASS_CSS, to: SECOND_PASS_CSS })
      .then(result => {
        fs.writeFile(SECOND_PASS_CSS, result.css);
        if (result.map)
          fs.writeFile(`${SECOND_PASS_CSS}.map`, result.map);
      });
  });
};

const config = {
  file: MAIN_SCSS_FILE,
  outFile: CSS_DIR,
  sourceMap: true
};

/*
 *
 * Main render method
 *
*/
sass.render(config, onRenderCallback);
