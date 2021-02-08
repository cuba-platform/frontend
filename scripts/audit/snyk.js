const {runCmdSync, log} = require('../common');
const fs = require('fs-extra');

/**
 *
 * @param snykExecutable - path to the Snyk executable
 * @param command - one of the allowed Snyk commands
 * @param projectName - only used in the logs
 * @param projectPath - path to the project, relative to `basePath`, for example `react-client-scr`
 * @param includeDevDependencies - whether to add `--dev` parameter to the Snyk command
 * @param savedPolicyFile - path to the stored Snyk policy file, relative to `basePath`,
 * for example `.snyk-react-client-scr`.
 * Used when applying a Snyk command to the generated client.
 * Since the generated client itself is not committed to the repository, we store its .snyk policy file separately.
 * Providing this parameter will cause Snyk to:
 * 1) use the provided policy file when performing the command on the generated client
 * 2) save the updated policy to the provided policy file
 */
const runSnykCommand = (snykExecutable, command, projectName, projectPath, includeDevDependencies, savedPolicyFile) => {
  const allowedCommands = ['test', 'monitor', 'wizard'];
  if (!allowedCommands.includes(command)) {
    throw new Error(`Unknown command ${command}`);
  }

  if (process.cwd() !== projectPath) {
    process.chdir(projectPath);
  }

  if (projectName == null) {
    projectName = 'the project';
  }

  const baseCommand = `node ${snykExecutable} ${command} -- --file=package.json --trust-policies`;
  const fullCommand = includeDevDependencies ? `${baseCommand} --dev` : baseCommand;

  log.info(`Running "snyk ${command}" for ${projectName} in ${process.cwd()}`);
  log.info(fullCommand);

  const policyFile = '.snyk';
  if (savedPolicyFile != null) {
    // Put previously created Snyk policy file into the project folder
    fs.copySync(`${savedPolicyFile}`, policyFile);
  }

  runCmdSync(fullCommand);

  if (savedPolicyFile != null) {
    // Save the modified Snyk policy file
    fs.copySync(policyFile, `${savedPolicyFile}`);
  }

}

/**
 *
 * @param command - one of the allowed Snyk commands
 * @param projectPath - relative path to the project, for example `react-client-scr`.
 * If not provided, the command will be applied to all projects.
 * @param includeDevDependencies - whether to add `--dev` parameter to the given Snyk command.
 * Only respected if `projectPath` is provided. Otherwise default per-project settings will apply.
 * @param savedPolicyFile - see {@link runSnykCommand}.
 * Only respected if `projectPath` is provided. Otherwise default per-project settings will apply.
 */
const execute = (command, projectPath, includeDevDependencies, savedPolicyFile) => {
  const basePath = process.cwd();
  const snykExecutable = `${basePath}/node_modules/.bin/snyk`;

  if (projectPath != null) {
    runSnykCommand(snykExecutable, command, undefined,
      projectPath,
      !!includeDevDependencies && includeDevDependencies !== 'false',
      savedPolicyFile != null ? `${basePath}/${savedPolicyFile}` : undefined);
    return;
  }

  runSnykCommand(snykExecutable, command,
    'the root project',
    `${basePath}`,
    false);
  runSnykCommand(snykExecutable, command,
    'React Core',
    `${basePath}/packages/jmix-react-core`,
    false);
  runSnykCommand(snykExecutable, command,
    'React UI',
    `${basePath}/packages/jmix-react-ui`,
    false);
  runSnykCommand(snykExecutable, command,
    'REST JS',
    `${basePath}/packages/jmix-rest-js`,
    false);
  runSnykCommand(snykExecutable, command,
    'Frontend Generator',
    `${basePath}/packages/jmix-front-generator`,
    false);
  //
  // react-client-scr causes Snyk to crash due to the size of the dependency tree
  // https://github.com/snyk/snyk/labels/%F0%9F%8C%B3big%20tree%20size%20%7C%20large%20project
  //
  // runSnykCommand(snykExecutable, command,
  //   'the generated frontend client',
  //   `${basePath}/react-client-scr`,
  //   true,
  //   `${basePath}/.snyk-react-client-scr`);
};

const commandParam = process.argv[2];
const projectPath = process.argv[3];
const includeDevDependencies = process.argv[4];
const savedPolicyFile = process.argv[5];
execute(commandParam, projectPath, includeDevDependencies, savedPolicyFile);
