# nuxt-i18n-import
This package provides functionality to export i18n translation snippets to a .csv file. Also, a given .csv file can be used to import snippets back into the project

---

## Important Note:
Please note that this project is currently work in progress! I tried to walk a pragmatic path when writing this functionality for a very special usecase and then realised that I could extend it and bundle the functionality as an installable package ...

---

## Todo:
- code needs some major refactoring
- add cli interface to provide generalized functionality and options
- make sure package is installable via npm
- write unit tests

---

## Feature Ideas:

When the export is triggered and we already have a (previously generated) export file
in the filesystem, we could provide the option to (instead of overwriting the old file) create a
diff file (i.e. 'snippet.lang.diff.csv') which only contains new or 'dirty' key-value pairs.

Then, whoever is responsible for the translations of the snippet export, only has to consider
the diff file.

Once the diff file has been translated, we could provide the functionality
to merge/update the 'old' translation file with the new translated diff

---

