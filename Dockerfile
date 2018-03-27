FROM node:slim

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git

WORKDIR /usr/src/app

COPY . .

ENV PORT=80
ENV REPO=https://github.com/ruslankhh/yandex-shri-2018-homework-4-5-6

RUN npm install --quient
RUN npm run build
RUN git clone ${REPO} repo
RUN echo '{\n  "port": "${PORT}",\n  "repositoryDirectory": "./repo"\n}' > app.json

EXPOSE ${PORT}

CMD npm start -- --port $PORT
