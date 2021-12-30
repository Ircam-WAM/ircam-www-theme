FROM node:16-alpine

WORKDIR /srv/app

COPY . .

RUN npm install

RUN npm install -g browserify uglify-js watchify

CMD /bin/sh /srv/app/build.sh 