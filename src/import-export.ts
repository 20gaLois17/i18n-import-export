import * as fs from 'fs';
import * as chalk from 'chalk';

/**
 * export a .csv file from the ./i18n/translations/de
 * folder (the output .csv file will be written into the ./i18n/ - folder
 * @param snippets The object containing all language specific i18n snippets
 * @param lang The source language to export from
 */
export const exportToCsv = (snippets: object, lang: string): void => {
    const snippetsFlat = deflateObject(snippets);
    try {
        const path = writeDeflatedObjectToCsv(lang, snippetsFlat);
        console.info('csv output has been written to ', chalk.cyanBright(`'${path}'`));
    } catch(error) {
        console.error(error);
    }
}

/**
 * This method is basically the inverse of 'exportToCsv' ...
 *
 * Read .csv and build an object from the data which will in turn be written
 * into the ./i18n/translations/{lang} folder
 * @param path The (absolute or relative) path to the .csv file
 * @param lang The target language to import to
 */
export const importFromCsv = (path: string, lang: string): void => {
    const buffer = fs.readFileSync(path, {encoding: 'utf8'});
    let snippets = {};
    for (let line of buffer.split('\n')) {
        if (line === '') {
            continue;
        }
        // sanitize strings
        const [path, value] = line.split(';')
            .map(val =>
                val.trim().replace(/"/g, '')
            );
        // skip first line of csv with header information
        if (path === 'key') {
            continue;
        }
        // obj is passed by reference and will be modified
        inflateObject(snippets, path, value);
    }
    writeInflatedObject(snippets, lang);
    console.info(('i18n translation files have been written for language key ' + chalk.cyanBright(`'${lang}'`)));
}

/////////////
// HELPERS //
/////////////

/**
 * { 'account': { 'message': { 'foo': 'bar } } } => { 'account.message.foo': 'bar' }
 */
const deflateObject = (
    obj: object = {},
    res: object = {},
    extraKey: string = ''
) => {
   for (let key of Object.keys(obj)) {
      if (typeof obj[key] !== 'object') {
         res[extraKey + key] = obj[key];
      } else {
         deflateObject(obj[key], res, `${extraKey}${key}.`);
      };
   };
   return res;
};

/**
 * inverts method deflateObject recursively
 *
 * Example:
 * const messages = {}
 * inflateObject(messages, 'account.message.foo', 'bar');
 *
 * messages ~> { account: { message: { foo: 'bar' } } }
 *
 * @param obj The object to be inflated
 * @param keyPath
 * @param value Translation
 */
const inflateObject = (
    obj: object,
    keyPath: string,
    value: string = '',
): void => {
    let keyPathSegments = keyPath.split('.');
    let key = keyPathSegments.shift();

    if (!key || key === '') {
        return;
    }

    if (keyPathSegments.length > 0) {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = {};
        }
        inflateObject(obj[key], keyPathSegments.join('.'), value);
    } else {
        obj[key] = value;
    }
}

/**
 * @param lang Input 'fr' will result in the output file: snippets.fr.csv
 * @param data The (deflated) object will be written into a .csv file with
 * the two columns 'key' and 'value'
 */
const writeDeflatedObjectToCsv = (lang: string, obj: object) => {
    const path = `./i18n/snippets.${lang}.csv`;
    if (fs.existsSync(path)) {
        fs.rmSync(path);
    };
    fs.appendFileSync(path, '"key"; "value"\n');
    for (let key of Object.keys(obj)) {
        try {
            fs.appendFileSync(path, `"${key}"; "${obj[key]}"\n`);
        } catch (error) {
            console.error(error);
        }
    }
    return path;
}

/**
 * this method is pretty biased, it assumes that the (top level) object keys
 * correspond to the filenames (because during the export the inverse is the case)
 *
 * invoking this function with the language key 'en' and targetDir './i18n/translations/'
 * and an object like
 *
 *   {
 *     account: { title: 'Account' },
 *     cart: { title: 'Cart' }
 *     messages: { error: 'Error' }
 *     ...
 *   }
 *
 * should produce the following file structure:
 *
 *  ├── i18n
 *  │   └─── translations
 *  │         ├─── en
 *  │         │    ├── account.en.ts
 *  │         │    ├── cart.en.ts
 *  │         │    ├── messages.en.ts
 *  │         │    ├── ...
 * ...       ...  ...
 *
 * @param data
 * @param lang
 * @param targetDir
 */
const writeInflatedObject = (
    data: object,
    lang: string = 'fi',
    targetDir: string = './i18n/translations/'
): void => {
    const finalDest = targetDir + lang + '/';
    const keys = Object.keys(data);

    if (!fs.existsSync(finalDest)) {
        try {
            fs.mkdirSync(finalDest);
        } catch (error) {
            throw error;
        }
    }
    for (const key of keys) {
        try {
            let targetFile = `${finalDest}${key}.${lang}.ts`;

            fs.appendFileSync(targetFile, `export const ${key} = `);
            const objJson = JSON.stringify(data[key], null, 4);
            for (let line of objJson.split('\n')) {
                // remove first two occurences of " in order to be consistent with object syntax
                // i.e { "some_key": "some_value" } ~> { some_key: "some_value" }
                line = line.replace(/"/, '').replace(/"/, '') + "\n";
                fs.appendFileSync(targetFile, line);
            }

        } catch (error) {
            console.error(error);
        }
    }
    // after all snippet files have been created we can bring it all together ...
    writeIndexTsFile(lang, finalDest, keys);
}

/**
 * @param lang
 * @param dir
 * @param keys
 */
const writeIndexTsFile = (lang: string, dir: string, keys: string[]): void => {
    const targetFile = dir + 'index.ts';
    for (let key of keys) {
        let line = `import { ${key} } from './${key}.${lang}';\n`;
        fs.appendFileSync(targetFile, line);
    }

    fs.appendFileSync(targetFile, `\nexport const ${lang} = {\n`)

    for (let key of keys) {
      let line = `    ${key},\n`;
      fs.appendFileSync(targetFile, line);
    }
    fs.appendFileSync(targetFile, '};');
}
