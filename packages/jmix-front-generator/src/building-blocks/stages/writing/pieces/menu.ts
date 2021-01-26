import {addRoute, addToMenu, RouteInfo} from "../../../../generators/react-typescript/common/menu";
import {YeomanGenerator} from "../../../YeomanGenerator";

export function addMenuItem(
  gen: YeomanGenerator,
  dirShift: string,
  className: string,
  nameLiteral: string,
  addRouteCallback: (
    routingContents: string,
    routeInfo: RouteInfo,
    customComponentParams?: any
  ) => string = addRoute,
  customComponentParams?: any
) {
  if (!addToMenu(gen.fs, {
      componentFileName: className,
      componentClassName: className,
      caption: className,
      dirShift: dirShift,
      destRoot: gen.destinationRoot(),
      menuLink: '/' + nameLiteral,
      pathPattern: '/' + nameLiteral + '/:entityId?'
    },
    addRouteCallback,
    customComponentParams
  )) {
    gen.log('Unable to add component to menu: route registry not found');
  }
}
