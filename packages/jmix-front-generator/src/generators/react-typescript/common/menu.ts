import * as path from "path";
import * as Generator from "yeoman-generator";
import {convertToUnixPath} from "../../../common/utils";

interface AddToMenuOpts {
  destRoot: string;
  dirShift: string | undefined;
}

interface ComponentInfo {
  componentFileName: string;
  componentClassName: string;
  menuLink: string;
  pathPattern: string;
  caption: string;
}

export function addToMenu<T>(
  fs: Generator.MemFsEditor,
  {
    destRoot,
    dirShift,
    caption,
    menuLink,
    pathPattern,
    componentFileName,
    componentClassName
  }: AddToMenuOpts & ComponentInfo,
  addRouteCallback: (
    routingContents: string,
    routeInfo: RouteInfo,
    customComponentParams?: {[param: string]: unknown}
  ) => string = addRoute,
  customComponentParams?: {[param: string]: unknown}
): boolean {

  const routingDir = path.join(destRoot, dirShift ? dirShift : '');
  const routingPath = path.join(routingDir, 'routing.ts');
  const componentPath = `./${getRelativePath(routingDir, destRoot)}/${componentFileName}`;

  if (fs.exists(routingPath)) {
    const routingContents = fs.read(routingPath);
    fs.write(
      routingPath,
      addRouteCallback(
        routingContents,
        {caption, menuLink, pathPattern, componentClassName, componentFileName, componentPath},
        customComponentParams
      ));
    return true;
  } else {
    return false;
  }
}

export type RouteInfo = ComponentInfo & {
  componentPath: string,
  pathPattern: string
}


export const addRoute = (routingContents: string,
                  {
                    caption,
                    pathPattern,
                    menuLink,
                    componentClassName,
                    componentPath
                  }: RouteInfo) => `` +
`import {${componentClassName}} from '${componentPath}';
${routingContents}

menuItems.push({
  pathPattern: '${pathPattern}',
  menuLink: '${menuLink}',
  component: ${componentClassName},
  caption: '${caption}'
});`;

function getRelativePath(routingDir: string, destRoot: string) {
  return convertToUnixPath(path.relative(routingDir, destRoot));
}
