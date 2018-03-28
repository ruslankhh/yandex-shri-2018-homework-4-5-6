FROM node:9

WORKDIR /usr/src/app

COPY . .

RUN npm install --quient
RUN npm run build
RUN npm run clone-repo

CMD npm start
