// https://github.com/ivangabriele/esm-path/blob/main/src/index.ts
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export const getAbsolutePath = (importMetaUrl, ...relativePaths) => {
  const importMetaPath = fileURLToPath(importMetaUrl);
  const importMetaDirectoryPath = dirname(importMetaPath);
  const absolutePath = join(importMetaDirectoryPath, ...relativePaths);
  return absolutePath;
};

export const generateApiUrl = (
  midsection
) => `${process.env.TMDB_BASE_URL}/${midsection}?\
api_key=${process.env.TMDB_API_KEY}`;
