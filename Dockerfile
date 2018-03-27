FROM node:slim

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git

WORKDIR /usr/src/app

COPY . .

ENV PORT=80
ENV NODE_ENV=development

RUN npm install --quient
RUN npm run build

CMD npm start -- --port $PORT
