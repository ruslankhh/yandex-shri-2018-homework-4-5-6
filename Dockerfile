FROM node:9

ENV PORT=80

WORKDIR /usr/src/app

COPY . .

RUN npm install --quient
RUN npm run build
RUN npm run clone-repo

CMD npm start -- --port $PORT
