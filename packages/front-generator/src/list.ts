import {GeneratedClientInfo} from "./init";
import * as fs from "fs";
import * as path from "path";

export function exportList(clients: GeneratedClientInfo[], cmd: { save?: string | boolean }) {
  const data = JSON.stringify(clients);
  const {save} = cmd;
  if (save) {
    if (typeof save === 'string') {
      const filepath = save;
      ensureDir(filepath);
      fs.writeFileSync(filepath, data);
    }
  }
  console.log(data);
}

function ensureDir(filePath: string) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDir(dirname);
  fs.mkdirSync(dirname);
}