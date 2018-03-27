FROM node:slim

WORKDIR /usr/src/app

COPY . .

ENV PORT=80
ENV NODE_ENV=development

RUN npm install --quient
RUN npm run build

CMD npm start -- --port $PORT
