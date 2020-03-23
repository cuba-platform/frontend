const {runCmdSync} = require('../common');
const yaml = require('js-yaml');
const fse = require('fs-extra');

const highlight = '\x1b[34m%s\x1b[0m';
const success = '\x1b[32m%s\x1b[0m';

console.log(highlight, 'Generating site...');
// Clean
fse.emptyDirSync('docs');
// Generate the site from asciidoc
runCmdSync('npm run antora:gen');
// Add .nojekyll file so that site can be deployed to GitHub Pages
fse.writeFileSync('docs/.nojekyll', '');
// Add API Reference documentation
// - Determine the branches corresponding to versions that will be documented on the site
const playbookFile = yaml.safeLoad(fse.readFileSync('docs-src/antora-playbook.yml'));
const branches = playbookFile.content.sources[0].branches;
console.log('Branches containing documentation:', branches);
// - Checkout the repo in a temporary directory
const projectRootDir = process.cwd();
const gitTempDir = 'docs-src/_temp';
runCmdSync(`mkdir ${gitTempDir}`);
process.chdir(gitTempDir);
runCmdSync('git clone https://github.com/cuba-platform/frontend.git');
process.chdir('frontend');
// - For each branch copy the API reference files to the built site
branches.forEach(branch => {
    runCmdSync(`git checkout ${branch}`);
    // Determine version number for this branch
    const antoraYmlFile = yaml.safeLoad(fse.readFileSync('docs-src/doc-component-repo/antora.yml'));
    const version = antoraYmlFile.version;
    console.log(`Copying API reference documentation for version ${version}...`)
    fse.copySync(
        'docs-src/api-reference',
        `${projectRootDir}/docs/cuba-frontend-docs/${version}/api-reference`
    );
});
// - Cleanup
process.chdir(projectRootDir);
fse.removeSync(gitTempDir);

// Create redirect files
// - Determine the latest version. Assumes that the script is run from the branch containing the last version.
const lastVersionAntoraYmlFile = yaml.safeLoad(fse.readFileSync('docs-src/doc-component-repo/antora.yml'));
const lastVersion = lastVersionAntoraYmlFile.version;
// - Create and write files
let template = fse.readFileSync('docs-src/redirect-page-template.html').toString();
// -- index.html is opened when a user visits GitHub Pages. It redirects to the latest version of documentation.
const indexFile = template
    .replace(/\{REDIRECT_PATH\}/g, 'cuba-frontend-docs/{DOCUMENTATION_VERSION}/index.html')
    .replace(/\{DOCUMENTATION_VERSION\}/g, lastVersion);
// -- this file redirects to the latest version of CUBA REST JS API reference. The link to it is in the CUBA REST JS README.
const redirectLatestCubaRest = template
    .replace(/\{REDIRECT_PATH\}/g, 'cuba-frontend-docs/{DOCUMENTATION_VERSION}/api-reference/cuba-rest-js/index.html')

fse.writeFileSync('docs/index.html', indexFile);
fse.writeFileSync('docs/latest-cuba-rest-js.html', redirectLatestCubaRest);

console.log(success, 'Documentation site has been generated successfully');