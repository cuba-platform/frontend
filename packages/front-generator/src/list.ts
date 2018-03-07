import {ClientInfo} from "./init";
import * as fs from "fs";

export function exportList(clients: ClientInfo[], cmd: { save?: string | boolean }) {
  const data = JSON.stringify(clients);
  const {save} = cmd;
  if (save) {
    if (typeof save === 'string') {
      fs.writeFileSync(save, data);
    }
  }
  console.log(data);
}