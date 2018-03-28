FROM node:9

ENV PORT=8080

WORKDIR /usr/src/app

COPY . .

RUN npm install --quient
RUN npm run build

EXPOSE ${PORT}

CMD npm start -- --port $PORT
