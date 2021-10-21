#!/bin/bash

ls /srv/app/ircam_www_theme/static/src/sass

# Sass process
echo "1. Process sass and watch"
npm run watch:sass
