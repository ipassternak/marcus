'use strict';

const config = require('./config.js');
const io = require('./lib/io/index.js');
const compiler = require('./lib/core/compiler.js');

const getSrc = async (input) => {
  const src = await io.fs.read(input);
  return src;
};

const outputResult = async (dist, data) => {
  if (dist) await io.fs.write(dist, data);
  else console.log(data);
};

(async ({ args, opts }) => {
  try {
    const [input] = args;
    const src = await getSrc(input);
    const compile = compiler[opts.format];
    const res = compile(src);
    await outputResult(opts.out, res);
  } catch (err) {
    // Fatal process exit
    console.error(`error: ${err.message}`);
    process.exit(1);
  }
})(config);
