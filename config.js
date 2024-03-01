'use strict';

const { Command, Option } = require('commander');
const pkg = require('./package.json');

const program = new Command();

// General settings
program
  .name(pkg.name)
  .version(pkg.version)
  .description(pkg.description)
  .showHelpAfterError('Use --help to list available options');

// Arguments
program.argument('<input>', 'specify the input file location');

// Options
program
  .option('-o, --out [output]', 'specify the output file location')
  .addOption(
    new Option('-f, --format [format]', 'specify the output format').choices([
      'ansi',
      'html',
    ]),
  )
  .action((_, opts) => {
    if (!opts.format) opts.format = opts.out ? 'html' : 'ansi';
  });

// Parse the command line parameters
program.parse();

module.exports = {
  args: program.args,
  opts: program.opts(),
};
