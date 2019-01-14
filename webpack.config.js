const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const marked = require('meta-marked');
const highlight = require('highlight.js')

const srcDir = path.join(__dirname, 'src');
const outputDir = path.join(__dirname, 'dist');

marked.setOptions({
  highlight: (code) => {
    return highlight.highlightAuto(code).value;
  }
});

// mdFiles contains object representations of the markdown files
// {
//   name: "someFile",
//   content: "content of the file as utf8 encoded string"
// }
const mdFiles = fs
  // Read directory contents
  .readdirSync(srcDir)
  // Take only .md files
  .filter(filename => /\.md$/.test(filename))
  // Normalize file data,
  // and write it to the array
  .map(filename => {
    return {
      name: path.parse(filename).name,
      content: fs.readFileSync(path.join(srcDir, filename), 'utf8')
    };
  });

const createPage = (mdFile) => {
  const content = marked(mdFile.content);
  console.log(`Building makdown file: ${mdFile.name}.md...`)

  return new HtmlWebpackPlugin({
    template: path.join(srcDir, 'template.html'),
    hash: true,
    filename: path.join(outputDir, `${mdFile.name}.html`),
    title: content.meta.title,
    content: content.html
  });
};

module.exports = {
  entry: {
    index: path.join(srcDir, 'index.js'),
  },
  output: {
    path: path.resolve(outputDir),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [

    ]
  },
  plugins: [
    // Spread the returned HtmlWebpackPlugin config
    // objects into the plugins array.
    ...mdFiles.map(mdFile => createPage(mdFile))
  ]
};