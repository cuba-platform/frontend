import fetch from 'node-fetch'

const DEFAULT_INTEGRATION_PORT = 48561;
export const ERR_STUDIO_NOT_CONNECTED = '' +
  'Can\'t establish connection to CUBA Studio. Please open CUBA Studio Intellij and tick \'Enable Integration\' checkbox. ' +
  'Or provide path to project model json file as cli parameter --model';

export interface StudioProjectInfo {
  name: string;
  path: string;
  locationHash: string;
}

export async function exportProjectModel(projectLocationHash: string, dest: string, port = DEFAULT_INTEGRATION_PORT): Promise<any> {
  try {
  const params = `exportModelProjectDest=${encodeURIComponent(dest)}&exportModelProjectHash=${projectLocationHash}`;
  return await fetch(`http://localhost:${port}/?${params}`);
  } catch {
    throw Error(ERR_STUDIO_NOT_CONNECTED);
  }
}

export async function getOpenedCubaProjects(port = DEFAULT_INTEGRATION_PORT): Promise<StudioProjectInfo[] | null> {
  try {
    const resp = await fetch(`http://localhost:${port}/?printCubaProjects`);
    return resp.json();
  } catch {
    return null;
  }
}

export function normalizeSecret(restClientSecret: string): string {
  return restClientSecret.replace(/{.*}/, '');
}