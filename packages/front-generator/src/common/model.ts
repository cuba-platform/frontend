export interface Locale {
  code: string;
  caption: string;
}

export interface ProjectInfo {
  namespace: string;
  modulePrefix: string;
  locales: Locale[]
}