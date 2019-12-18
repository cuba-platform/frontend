/* This script generates Table of contents for README.
 *
 * Sections and subsections will be included if their headers have the following format:
 *
 * [link, e.g. <a name="overview"/>]
 * [empty line (markdown will break without it)]
 * [name of section (preceded with ##) or subsection (preceded with ###)]
 */

const fs = require('fs');

const linkPattern = /^<a name="([^"]*)"/;
const namePattern = /^#{2,3} (.*)/;

const readme = fs.readFileSync('./README.md', 'utf8');

let link;
let linkIndex;

let toc = readme.split('\n').reduce((accumulator, line, index) => {
  if (line.match(linkPattern)) {
    if (link) {
      console.log('Skipping link not followed by (sub)section name: ' + link);
    }

    link = line.match(linkPattern)[1];
    linkIndex = index;
    return accumulator;
  }

  if (line.match(namePattern)) {
    const name = line.match(namePattern)[1];
    if (index === linkIndex + 2) {
      const isSubsection = line.startsWith('###');
      const tocItem = `${isSubsection ? '    ' : ''}- [${name}](#${link})\n`;
      link = null;
      linkIndex = null;
      return accumulator + tocItem;
    } else {
      console.log('Skipping (sub)section name not preceded by a link and an empty line: ' + name);
    }
  }

  return accumulator;
}, '');

if (link) {
  console.log('Skipping link not followed by (sub)section name: ' + link);
}

toc += '\n'; // there must be a newline between the TOC and the TOC-end comment, otherwise the comment will be visible

const tocRegex = /(\[comment\]: <> \(TOC-start\)\n)([\s\S]*?)(\[comment\]: <> \(TOC-end\))/g;
const updatedReadme = readme.replace(tocRegex, `$1${toc}$3`);
fs.writeFileSync('./README.md', updatedReadme);

console.log();
console.log(`Table of contents in main README has been updated`);
