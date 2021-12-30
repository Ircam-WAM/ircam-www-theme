#!/bin/bash

## Bundle and watch js
echo "1. Bundle and watch js"
watchify --insert-globals /srv/app/ircam_www_theme/static/src/js/index.js -v -o /srv/app/ircam_www_theme/static/js/index.min.js
