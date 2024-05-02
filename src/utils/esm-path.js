// https://github.com/ivangabriele/esm-path/blob/main/src/index.ts
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export const getAbsolutePath = (importMetaUrl, ...relativePaths) => {
  const importMetaPath = fileURLToPath(importMetaUrl);
  const importMetaDirectoryPath = dirname(importMetaPath);
  const absolutePath = join(importMetaDirectoryPath, ...relativePaths);
  return absolutePath;
};
