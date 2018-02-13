import {readdir} from 'fs';
import {promisify} from "util";
import * as vfs from 'vinyl-fs';
import * as through2 from "through2";
import * as VinylFile from "vinyl";

const CLIENTS_DIR = 'clients';
const clients:ClientInfo[] = [];

interface ClientInfo {
  name: string
}

export async function getLocalClients(): Promise<ClientInfo[]> {

  const dirs = await promisify(readdir)(CLIENTS_DIR);

  return dirs.map(dirName => {
    return {name: dirName}
  });

}

export async function generate(client: ClientInfo): Promise<void> {
  vfs
    .src([`./clients/${client.name}/base/**/*`])
    .pipe(through2.obj(function (file: VinylFile, end, callback) {
      callback(null, file);
    }))
    .pipe(vfs.dest('./.tmp'))
}

