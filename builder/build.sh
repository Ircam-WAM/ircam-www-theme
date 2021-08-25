#!/bin/bash

# WWW

## Vendors
echo "1. Vendors"
npm install --prefix /srv/app/ircam_www_theme
rm -R /srv/app/ircam_www_theme/static/vendors
cp -R /srv/app/ircam_www_theme/node_modules /srv/app/ircam_www_theme/static/vendors
rm -R /srv/app/ircam_www_theme/node_modules
echo "1.end"

## Images
echo "2. Images"
rm -R /srv/app/ircam_www_theme/static/img/
cp -R "/srv/app/ircam_www_theme/static/src/assets/img/" "/srv/app/ircam_www_theme/static/img/"
echo "2.end"

## Generate favicons
echo "3. Generate favicons"
mkdir /srv/app/ircam_www_theme/static/img/favicons/
npm run gen:favicons
echo "3.end"

## Minify img
echo "4. Minify images"
npm run min:img -- "/srv/app/ircam_www_theme/static/img"
echo "4.end"

## Bundle js
echo "5. Bundle js"
browserify --insert-globals /srv/app/ircam_www_theme/static/src/js/index.js > /tmp/index.js
echo "5.end"

## Js minify
echo "6. Minify js"
rm -R /srv/app/ircam_www_theme/static/js/
mkdir /srv/app/ircam_www_theme/static/js/
uglifyjs /tmp/index.js -o /srv/app/ircam_www_theme/static/js/index.min.js
echo "6.end"

# Sass process
echo "7. Process sass"
npm run process:sass
echo "7.end"

## Minify css
echo "8. Minify css"
rm -R /srv/app/ircam_www_theme/static/css/
mkdir /srv/app/ircam_www_theme/static/css/
npx postcss --config /srv/app /tmp/index.css --use autoprefixer > /srv/app/ircam_www_theme/static/css/index.min.css
echo "8.end"
