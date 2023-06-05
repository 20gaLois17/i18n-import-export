#!/usr/bin/env node

const chalk = require('chalk');
import * as figlet from 'figlet';
const { program } = require('commander');

import { exportToCsv , importFromCsv } from './import-export';

program
    .version('0.0.5')
    .description('i18n import-export')

const banner = figlet.textSync(program.description(), { horizontalLayout: 'full'});
console.log(chalk.white(banner));

// TODO: implement
program
    .command('export')
    .requiredOption('-f, --filepath <filepath>', 'Specify the (relative) path to the index.ts file')
    .requiredOption('-l, --lang <language> ', 'Specify the language code to export')
    .action((options: ExportOptions) => {
        const { filepath, lang } = options;
        console.log(filepath, lang);
        return;
        exportToCsv({}, lang);
    });

program
    .command('import')
    .requiredOption('-f, --filepath <filepath>', 'Specify the (relative) path to the import file')
    .requiredOption('-o, --outdir <targetdir>', 'Specify the (relative) path to the export directory')
    .requiredOption('-l, --lang <language> ', 'Specify the language code')
    .action((options: ImportOptions) => {
        const { filepath, outdir, lang } = options;
        importFromCsv(filepath, outdir, lang);
    });

program.parse(process.argv);

type ImportOptions = {
    filepath: string,
    outdir: string,
    lang: string
}

type ExportOptions = {
    filepath: string,
    lang: string,
}
