FROM node:5.4.1

COPY package.json /src/package.json
RUN cd /src; npm install

COPY . /src
CMD cd /src; npm start
