import {
  entityManagementGeneratorParams,
} from "../entity-management/params";
import {
  ComponentOptions, componentOptionsConfig,
} from "../../../common/cli-options";
import { ReactEntityManagementGenerator } from "../entity-management";
import * as path from "path";

class ReactEntityManagementHooksGenerator extends ReactEntityManagementGenerator {
  constructor(args: string | string[], options: ComponentOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  async prompting() { await super.prompting(); }
  writing() { super.writing(); }
  end() { super.end(); }
}

const description = 'CRUD (list + editor) screens for specified entity, editor component is implemented using hooks';

export {
  ReactEntityManagementHooksGenerator as generator,
  componentOptionsConfig as options,
  entityManagementGeneratorParams as params,
  description
};
