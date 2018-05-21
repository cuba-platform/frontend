import {createPolymer2ComponentGenerator} from "../../polymer2/blank-component";
import {blankComponentParams} from "../../polymer2/blank-component/params";
import {polymerElementOptionsConfig} from "../../../common/cli-options";
import * as path from "path";

export const generator = createPolymer2ComponentGenerator(path.join(__dirname, 'template'));
export {
  polymerElementOptionsConfig as options,
  blankComponentParams as params
};