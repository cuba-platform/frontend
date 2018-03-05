import * as Base from "yeoman-generator";
import * as path from "path";
import {options as availableOptions} from "../app/cli-options";
import {CommonGenerationOptions} from "../../../common/cli-common";

class Polymer2ComponentGenerator extends Base {
  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);

    Object.keys(availableOptions).forEach(optionName => {
      this.option(optionName, availableOptions[optionName]);
    });

    this.sourceRoot(path.join(__dirname, 'template'));
  }
}

export = Polymer2ComponentGenerator;