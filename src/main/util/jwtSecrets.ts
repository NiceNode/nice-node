import crypto from 'node:crypto';
import { open } from 'node:fs/promises';
import path from 'node:path';

// import { getNNDirPath } from '../files';

// const JWT_SECRETS_DIR_NAME = 'jwtsecrets';
// const jwtSecretsDirPath = path.join(getNNDirPath(), JWT_SECRETS_DIR_NAME);
/**
 * Creates a jwt secret in input dir's, named as 'jwtsecret'
 * @returns the jwt secret file path
 */
export const createJwtSecretAtDirs = async (
  dirPaths: string[],
): Promise<boolean> => {
  const jwtSecret = crypto.randomBytes(32).toString('hex');
  // dirPaths.forEach(async (dirPath) => {
  for (const dirPath of dirPaths) {
    // open file for writing only, fails if the file exists
    // this is not expected to fail so don't catch
    const jwtSecretFilePath = path.join(dirPath, 'jwtsecret');
    console.log(`jwtsecret: file path opening.. at ${jwtSecretFilePath}`);
    const jwtSecretFileHandle = await open(jwtSecretFilePath, 'wx');
    await jwtSecretFileHandle.writeFile(jwtSecret);
    await jwtSecretFileHandle.close();
  }
  // );

  return true;
};
