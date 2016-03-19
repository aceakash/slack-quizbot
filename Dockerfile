FROM aceakash/node4.2-npm3

COPY package.json /src/package.json
RUN cd /src; npm install

COPY . /src
CMD cd /src; npm start
