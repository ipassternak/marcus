'use strict';

const fsp = require('node:fs/promises');
const path = require('node:path');

const ALLOWED_EXT = ['.md', '.txt'];

const validatePath = (filePath) => {
  const ext = path.extname(filePath);
  if (filePath === '' || (ext && !ALLOWED_EXT.includes(ext)))
    throw new Error(`invalid file path: ${filePath}
    file path must be a non-empty string
    file may have one of the allowed extension:
      ${ALLOWED_EXT.join(', ')}
    Examples: '/path/to/file.md', '/path/to/file', 'file.md', 'file'`);
};

const read = async (filePath) => {
  const fp = path.resolve(filePath);
  validatePath(fp);
  const src = await fsp.readFile(fp, 'utf8');
  return src;
};

const write = async (filePath, data) => {
  const fp = path.resolve(filePath);
  await fsp.writeFile(fp, data, 'utf8');
};

module.exports = {
  read,
  write,
  validatePath,
};
