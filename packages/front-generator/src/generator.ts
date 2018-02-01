import * as fs from 'fs';
import {promisify} from "util";

const CLIENTS_DIR = '../../clients';
const clients = {};

export async function initialize(): Promise<void> {

  console.log(__dirname);

  const res = await promisify(fs.readdir)('.');
  console.log(res);
}