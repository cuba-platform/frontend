import {ProjectInfo} from "../../../common/model";

export interface Polymer2AppTemplateModel {
  title: string;
  baseColor: string;
  basePath: string;
  project: ProjectInfo;
  genClassName: (suffix: string) => string;
}