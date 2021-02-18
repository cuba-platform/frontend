import * as Base from "yeoman-generator";
import * as path from "path";
import {ProjectInfo, ProjectModel} from '../../../common/model/cuba-model';
import {
  ERR_STUDIO_NOT_CONNECTED, exportProjectModel,
  getOpenedCubaProjects, normalizeSecret,
  StudioProjectInfo
} from '../../../common/studio/studio-integration';
import {ownVersion} from '../../../cli';
import {SdkAllGenerator} from '../../sdk/sdk-generator';
// noinspection ES6PreferShortImport
import {CommonGenerationOptions} from '../../../common/cli-options';
// noinspection ES6PreferShortImport
import {readProjectModel} from '../../../common/base-generator';
import {throwError} from '../../../common/utils';
import {SUPPORTED_CLIENT_LOCALES} from '../common/i18n';

/**
 * @alpha
 */
export interface ReactTSAppTemplateModel {
  title: string;
  basePath: string;
  project: ProjectInfo;
  ownVersion: string;
}

/**
 * @alpha
 */
export interface ReactTSAppAnswers {
  projectInfo: StudioProjectInfo;
}

/**
 * @alpha
 */
export async function promptForProjectModel(
  gen: Pick<Base, 'log' | 'env' | 'prompt'> & {
    options: CommonGenerationOptions,
  },
  modelFilePath?: string
): Promise<{
  cubaProjectModel?: ProjectModel,
  force?: boolean,
  answers?: ReactTSAppAnswers
}> {

  // read model from path provided in options
  if (gen.options.model) {
    gen.log('Skipping prompts since model provided');
    const cubaProjectModel = readProjectModel(modelFilePath);
    return {
      cubaProjectModel,
      force: true
    };
  }

  // obtain model from Studio
  const openedCubaProjects = await getOpenedCubaProjects();
  if (!openedCubaProjects || openedCubaProjects.length < 1) {
    throwError(gen, ERR_STUDIO_NOT_CONNECTED);
  }

  const answers = await gen.prompt([{
    name: 'projectInfo',
    type: 'list',
    message: 'Please select CUBA project you want to use for generation',
    choices: openedCubaProjects && openedCubaProjects.map(p => ({
      name: `${p.name} [${p.path}]`,
      value: p
    }))
  }]) as ReactTSAppAnswers;

  return {
    answers
  };
}

/**
 * @alpha
 */
export async function prepareProjectModel(
  gen: Pick<Base, 'env'> & {
    answers?: ReactTSAppAnswers,
  },
  cubaProjectModel?: ProjectModel
): Promise<{
  model: ReactTSAppTemplateModel,
  cubaProjectModel?: ProjectModel,
  modelFilePath?: string,
}> {
  if (cubaProjectModel != null) {
    return {
      model: createModel(cubaProjectModel.project)
    };
  } else if (gen.answers != null) {
    const modelFilePath = path.join(process.cwd(), 'projectModel.json');

    await exportProjectModel(gen.answers.projectInfo.locationHash, modelFilePath);

    const cubaProjectModel = readProjectModel(modelFilePath);
    const model = createModel(cubaProjectModel.project);

    return {
      model,
      modelFilePath,
      cubaProjectModel
    }
  }
  throwError(gen, 'Failed to prepare project model');
}

/**
 * @alpha
 */
export function createModel(project: ProjectInfo): ReactTSAppTemplateModel {
  const model = {
    ownVersion,
    title: project.name,
    project,
    basePath: project.modulePrefix + '-front'
  };

  model.project.restClientId = project.restClientId ?? 'client';
  model.project.restClientSecret = project.restClientSecret ? normalizeSecret(project.restClientSecret) : 'secret';
  return model;
}

/**
 * @alpha
 */
export function writeReactTSApp(
  gen: Pick<Base, 'log' | 'fs' | 'destinationPath' | 'templatePath'> & {
    model?: ReactTSAppTemplateModel
  }
): void {
  gen.log(`Generating to ${gen.destinationPath()}`);

  if (!gen.model) {
    throw new Error('Model is not provided');
  }

  let clientLocales: string[];
  const modelHasLocalesInfo = (gen.model.project.locales != null);
  if (!modelHasLocalesInfo) {
    // Could be if using an old Studio version that doesn't export locales.
    gen.log('Project model does not contain project locales info. I18n messages will be added for all supported locales.');
    clientLocales = SUPPORTED_CLIENT_LOCALES;
  } else {
    const projectLocales = gen.model.project.locales.map(locale => locale.code);
    clientLocales = projectLocales.filter(locale => SUPPORTED_CLIENT_LOCALES.includes(locale));
    if (clientLocales.length === 0) {
      gen.log('WARNING. None of the project locales are supported by Frontend Generator.'
        + ` Project locales: ${JSON.stringify(projectLocales)}. Supported locales: ${JSON.stringify(SUPPORTED_CLIENT_LOCALES)}.`);
    }
  }
  clientLocales.forEach(locale => {
    gen.fs.copy(
      gen.templatePath() + `/i18n-message-packs/${locale}.json`,
      gen.destinationPath(`src/i18n/${locale}.json`)
    );
  });

  gen.fs.copyTpl(gen.templatePath() + '/public/**', gen.destinationPath('public'), gen.model);
  gen.fs.copyTpl(gen.templatePath() + '/src/**', gen.destinationPath('src'), {
    ...gen.model,
    isLocaleUsed: (locale: string) => {
      // If project model doesn't contain locales info (could be if old Studio is used)
      // then we add all supported locales.
      return !modelHasLocalesInfo || clientLocales.includes(locale);
    },
    clientLocales
  });
  gen.fs.copyTpl(gen.templatePath() + '/*.*', gen.destinationPath(), gen.model);
  gen.fs.copyTpl(gen.templatePath('.env.production.local'), gen.destinationPath('.env.production.local'), gen.model);
  gen.fs.copyTpl(gen.templatePath('.env.development.local'), gen.destinationPath('.env.development.local'), gen.model);
  gen.fs.copy(gen.templatePath('_gitignore'), gen.destinationPath('.gitignore'));
  gen.fs.copy(gen.templatePath('_editorconfig'), gen.destinationPath('.editorconfig'));
}

/**
 * @alpha
 */
export async function generateSdk(
  gen: Pick<Base, 'log' | 'env' | 'composeWith'>,
  sdkGeneratorPath: string,
  modelFilePath?: string
): Promise<void> {
  if (modelFilePath == null) {
    throwError(gen, 'Failed to generate SDK: unable to find model file path');
  }

  const sdkDest = 'src/jmix';
  gen.log(`Generate SDK model and services to ${sdkDest}`);

  const sdkOpts = {
    model: modelFilePath,
    dest: sdkDest
  };

  const generatorOpts = {
    Generator: SdkAllGenerator,
    path: sdkGeneratorPath
  };

  // todo type not match
  await gen.composeWith(generatorOpts as any, sdkOpts);
}

