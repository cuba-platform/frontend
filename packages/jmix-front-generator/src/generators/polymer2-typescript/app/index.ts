import {commonGenerationOptionsConfig} from "../../../common/cli-options";
import {createPolymer2AppGenerator} from "../../polymer2/app";
import * as path from "path";

export const generator = createPolymer2AppGenerator(path.join(__dirname, 'template'));
export {commonGenerationOptionsConfig as options};
export const params = [];