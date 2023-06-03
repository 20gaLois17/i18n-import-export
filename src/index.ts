#!/usr/bin/env node

import { exportToCsv , importFromCsv } from './import-export';

const chalk = require('chalk');
import * as figlet from 'figlet';
const { program } = require('commander');
//import * as commander from 'commander';

const banner = figlet.textSync(program.description(), { horizontalLayout: 'full'});
console.log(chalk.white(banner));

program
    .version('0.0.5')
    .description('i18n import-export cli tool')

// TODO: implement
program
    .command('export')
    .action(() => console.log('TODO: implement export'));

// TODO: implement
program
    .command('import')
    .action(() => console.log('TODO: implement import'));

program.parse();

