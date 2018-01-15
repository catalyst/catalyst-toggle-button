#!/bin/bash
polymer=node_modules/polymer-cli/bin/polymer.js
gulp=node_modules/gulp/bin/gulp.js

node $polymer analyze --input src/$npm_package_name.js > analysis.json
node $gulp analysis-fixer
