const {runCmdSync} = require('../common');
const yaml = require('js-yaml');
const fse = require('fs-extra');

const highlight = '\x1b[34m%s\x1b[0m';
const success = '\x1b[32m%s\x1b[0m';

console.log(highlight, 'Generating site...');
const playbookFile = yaml.safeLoad(fse.readFileSync('docs-src/antora-playbook.yml'));
// Clean
const buildDir = playbookFile.output.dir;
fse.emptyDirSync(buildDir);
// Generate the site from asciidoc
runCmdSync('npm run antora:gen');
// Add API Reference documentation
// - Determine the branches corresponding to versions that will be documented on the site
const repo = playbookFile.content.sources[0].url;
const branches = playbookFile.content.sources[0].branches;
console.log('Repo:', repo);
console.log('Branches containing documentation:', branches);
// - Checkout the repo to a temporary directory
const projectRootDir = process.cwd();
const gitTempDir = 'docs-src/_temp';
runCmdSync(`mkdir ${gitTempDir}`);
process.chdir(gitTempDir);
runCmdSync(`git clone ${repo}`);
process.chdir('frontend');
// - For each branch copy the API reference files to the built site
branches.forEach(branch => {
    runCmdSync(`git checkout ${branch}`);
    // Determine version number for this branch
    const componentDescriptorFile = yaml.safeLoad(fse.readFileSync('docs-src/doc-component-repo/antora.yml'));
    const version = componentDescriptorFile.version;
    console.log(`Copying API reference documentation for version ${version}...`);
    fse.copySync(
        'docs-src/api-reference',
        `${projectRootDir}/${buildDir}/cuba-frontend-docs/${version}/api-reference`
    );
});
// - Cleanup
process.chdir(projectRootDir);
fse.removeSync(gitTempDir);

// Create redirect files
// - Determine the latest version. Assumes that the script is run from the branch containing the last version.
const lastVersionComponentDescriptorFile = yaml.safeLoad(fse.readFileSync('docs-src/doc-component-repo/antora.yml'));
const lastVersion = lastVersionComponentDescriptorFile.version;
// - Create and write files
let template = fse.readFileSync('docs-src/redirect-page-template.html').toString();
// -- this file redirects to the latest version of CUBA REST JS API reference. The link to it is in the CUBA REST JS README.
const redirectLatestCubaRest = template
    .replace(/\{REDIRECT_PATH\}/g, 'cuba-frontend-docs/{DOCUMENTATION_VERSION}/api-reference/cuba-rest-js/index.html')
    .replace(/\{DOCUMENTATION_VERSION\}/g, lastVersion);

fse.writeFileSync(`${buildDir}/latest-cuba-rest-js.html`, redirectLatestCubaRest);

console.log(success, 'Documentation site has been generated successfully');