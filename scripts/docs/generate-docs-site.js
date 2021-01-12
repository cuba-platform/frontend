const {runCmdSync, log} = require('../common');
const yaml = require('js-yaml');
const fse = require('fs-extra');

function generateSite(docsSrcPath, mode) {
    const playbookFilePath = `${docsSrcPath}/antora-playbook.yml`;
    const playbook = yaml.safeLoad(fse.readFileSync(playbookFilePath));

    clean(playbook);
    transformAsciiDoc(playbookFilePath);
    if (mode !== 'manualOnly') {
        copyApiReference(playbook, docsSrcPath);
    }
    createRedirectFiles(playbook, docsSrcPath);

    log.success('Documentation site has been generated successfully');
}

function clean(playbook) {
    log.info('Cleaning build dir');
    const buildDir = playbook.output.dir;
    fse.emptyDirSync(buildDir);
}

function transformAsciiDoc(playbookFilePath) {
    log.info('Transforming AsciiDoc');
    runCmdSync(`npm run antora:gen -- ${playbookFilePath}`);
}

function copyApiReference(playbook, docsSrcPath) {
    log.info('Adding API Reference documentation');

    // Determine the branches corresponding to versions that will be documented on the site
    const repo = playbook.content.sources[0].url;
    const branches = playbook.content.sources[0].branches;
    log.info(`Repo: ${repo}`);
    log.info(`Branches containing documentation: ${branches}`);

    // Checkout the repo to a temporary directory
    const projectRootDir = process.cwd();
    const gitTempDir = `${docsSrcPath}/_temp`;
    runCmdSync(`mkdir ${gitTempDir}`);
    process.chdir(gitTempDir);
    runCmdSync(`git clone ${repo}`);
    process.chdir('jmix-frontend');

    // For each branch copy the API reference files to the built site
    branches.forEach(branch => {
        runCmdSync(`git checkout ${branch}`);
        // Determine version number for this branch
        const componentDescriptor = yaml.safeLoad(fse.readFileSync(`${docsSrcPath}/doc-component-repo/antora.yml`));
        const version = componentDescriptor.version;
        log.info(`Copying API reference documentation for version ${version}`);
        const buildDir = playbook.output.dir;
        fse.copySync(
          'docs-src/api-reference',
          `${projectRootDir}/${buildDir}/jmix-frontend-docs/${version}/api-reference`
        );
    });

    // Cleanup
    process.chdir(projectRootDir);
    fse.removeSync(gitTempDir);
}

function createRedirectFiles(playbook, docsSrcPath) {
    log.info('Creating redirect files');

    // Determine the latest version. Assumes that the script is run from the branch containing the last version.
    const lastVersionComponentDescriptor = yaml.safeLoad(fse.readFileSync(`${docsSrcPath}/doc-component-repo/antora.yml`));
    const lastVersion = lastVersionComponentDescriptor.version;

    // Create and write files
    let template = fse.readFileSync(`${docsSrcPath}/redirect-page-template.html`).toString();

    // This file redirects to the latest version of CUBA REST JS API reference. The link to it is in the CUBA REST JS README.
    const redirectLatestCubaRest = template
      .replace(/\{REDIRECT_PATH\}/g, 'cuba-frontend-docs/{DOCUMENTATION_VERSION}/api-reference/cuba-rest-js/index.html')
      .replace(/\{DOCUMENTATION_VERSION\}/g, lastVersion);

    const buildDir = playbook.output.dir;
    fse.writeFileSync(`${buildDir}/latest-cuba-rest-js.html`, redirectLatestCubaRest);
}

const docsSrcPath = process.argv[2] || 'docs-src';
const mode = process.argv[3];
generateSite(docsSrcPath, mode);
