import * as http from "http";

const DEFAULT_INTEGRATION_PORT = 48561;

interface ProjectInfo {
  name: string;
  path: string;
  locationHash: string;
}

export async function exportProjectModel(projectLocationHash: string, dest: string, port = DEFAULT_INTEGRATION_PORT): Promise<any> {
  return get(`http://localhost:${port}/?exportModelProjectDest=${encodeURIComponent(dest)}&exportModelProjectHash=${projectLocationHash}`);
}

export async function getOpenedCubaProjects(port = DEFAULT_INTEGRATION_PORT): Promise<ProjectInfo[]> {
  return get(`http://localhost:${port}/?printCubaProjects`)
    .then(resp => JSON.parse(resp));
}

function get(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        resolve(body)
      });
      res.on("error", () => {
        reject();
      })
    });
  });
}