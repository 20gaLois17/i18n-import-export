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
    .action(() => console.log('TODO: implement export'));

// TODO: implement
program
    .command('import')
    .action(() => console.log('TODO: implement import'));

program.parse();

