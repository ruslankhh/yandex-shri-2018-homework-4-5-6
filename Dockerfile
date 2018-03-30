FROM node:9

ENV PORT=8080

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git
RUN mkdir -p /usr/src/app/

WORKDIR /usr/src/app

COPY . .

RUN npm install --quient
RUN npm run build

EXPOSE ${PORT}

CMD npm start -- --port $PORT
