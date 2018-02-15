import * as Base from "yeoman-generator";
import {Questions} from "yeoman-generator";
import * as path from "path";
import {ProjectInfo} from "../../../common/model";

export = class AppGenerator extends Base {

  private props: ProjectInfo;

  constructor(args: string | string[], options: any) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  async prompting() {
    const questions: Questions = [{
      name: 'modulePrefix',
      message: 'Module Prefix',
      type: 'input',
      'default': 'app'
    }, {
      name: 'projectNamespace',
      message: 'Project Namespace',
      type: 'input'
    }];

    this.props = await this.prompt(questions) as ProjectInfo;
  }

  writing() {
    console.log(this.sourceRoot());
    console.log(this.destinationPath());

    this.fs.copyTpl(this.templatePath() + '/**', this.destinationPath(), this.props);
  }

  end() {
    this.log('CUBA Polymer frontend has been successfully generated');
  }
}
