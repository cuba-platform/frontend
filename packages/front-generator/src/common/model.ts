export interface Locale {
  code: string;
  caption: string;
}

export interface ProjectInfo {
  name: string;
  namespace: string;
  modulePrefix: string;
  locales: Locale[];
}