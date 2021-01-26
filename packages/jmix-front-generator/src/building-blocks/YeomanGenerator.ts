import * as Base from "yeoman-generator";

// Do not put anything in this class. It only exists to simplify the IDE-assisted imports and fix the typings.
export abstract class YeomanGenerator extends Base {
  conflicter!: { force: boolean }; //patch missing in typings
}