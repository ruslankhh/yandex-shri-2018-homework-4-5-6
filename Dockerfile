FROM node:9

ENV PORT=80
ENV REPO=https://github.com/ruslankhh/yandex-shri-2018-homework-4-5-6
ENV REPO_DIR=repo

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git

WORKDIR /usr/src/app

COPY . .

RUN npm install --quient
RUN npm run build
RUN mkdir /usr/src/app/${REPO_DIR}
RUN git clone ${REPO} /usr/src/app/${REPO_DIR}
RUN cd /usr/src/app/${REPO_DIR} && \
    git branch -a | grep remotes | grep -v HEAD | cut -d"/" -f 3 | \
    awk '{print "git branch --track " $0}' | bash && \
    cd ..
RUN echo '{\n  "port": "'$PORT'",\n  "repoDir": "'$REPO_DIR'"\n}' > config.json

EXPOSE ${PORT}

CMD npm start -- --port $PORT
