/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { open } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

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
  // const jwtSecret = `0x${crypto.randomBytes(32).toString('hex')}`;
  const jwtSecret =
    'bf549f5188556ce0951048ef467ec93067bc4ea21acebe46ef675cd4e8e015ff';
  // dirPaths.forEach(async (dirPath) => {
  for (const dirPath of dirPaths) {
    // open file for writing only, fails if the file exists
    // this is not expected to fail so don't catch
    const jwtSecretFilePath = path.join(dirPath, `jwtsecret`);
    console.log(`jwtsecret: file path opening.. at ${jwtSecretFilePath}`);
    const jwtSecretFileHandle = await open(jwtSecretFilePath, 'wx');
    await jwtSecretFileHandle.writeFile(jwtSecret);
    await jwtSecretFileHandle.close();
  }
  // );

  return true;
};
