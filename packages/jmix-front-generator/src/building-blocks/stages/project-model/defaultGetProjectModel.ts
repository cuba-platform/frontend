import {CommonGenerationOptions} from "../../../common/cli-options";
import * as fs from "fs";
import {
  ERR_STUDIO_NOT_CONNECTED, exportProjectModel,
  getOpenedCubaProjects,
  StudioProjectInfo
} from "../../../common/studio/studio-integration";
import * as path from "path";
import {YeomanGenerator} from "../../YeomanGenerator";
import {ProjectModel} from "../../../common/model/cuba-model";
import {throwError} from "../../../common/utils";

interface ProjectInfoAnswers {
  projectInfo: StudioProjectInfo;
}

/**
 * Gets project model from option (if provided) or Studio integration.
 *
 * @param invocationDir directory from which the generator command was invoked
 * @param gen
 * @param options
 */
export const defaultGetProjectModel = async <O extends CommonGenerationOptions>(invocationDir: string, gen: YeomanGenerator, options: O): Promise<ProjectModel> => {
  const {model: providedModelFilePath} = options;

  if (providedModelFilePath != null) {
    gen.log('Skipping project model prompts since model is provided');
    const correctPath = path.isAbsolute(providedModelFilePath) ? providedModelFilePath : path.join(invocationDir, providedModelFilePath);
    return readProjectModel(correctPath);
  } else {
    // Obtain project model from Studio
    const openedCubaProjects = await getOpenedCubaProjects();
    if (!openedCubaProjects || openedCubaProjects.length < 1) {
      throwError(gen, ERR_STUDIO_NOT_CONNECTED);
    }

    const projectModelAnswers: ProjectInfoAnswers = await gen.prompt([{
      name: 'projectInfo',
      type: 'list',
      message: 'Please select CUBA project you want to use for generation',
      choices: openedCubaProjects && openedCubaProjects.map(p => ({
        name: `${p.name} [${p.path}]`,
        value: p
      }))
    }]) as ProjectInfoAnswers;

    const exportedModelFilePath = path.join(process.cwd(), 'projectModel.json');
    await exportProjectModel(projectModelAnswers.projectInfo.locationHash, exportedModelFilePath);
    return readProjectModel(exportedModelFilePath);
  }
};

export function readProjectModel(modelFilePath?: string): ProjectModel {
  if (!modelFilePath || !fs.existsSync(modelFilePath)) {
    throw new Error('Specified model file does not exist ' + modelFilePath);
  }
  return JSON.parse(fs.readFileSync(modelFilePath, "utf8"));
}