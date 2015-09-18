FROM phusion/baseimage:0.9.17

# WORKDIR /src
ADD . .

RUN apt-get -u update

# If you have native dependencies, you'll need extra tools
RUN apt-get install -y build-essential checkinstall autoconf libtool

# RethinkDB deps
RUN apt-get install -y python wget

# Install RethinkDB
RUN add-apt-repository "deb http://download.rethinkdb.com/apt trusty main"

RUN wget -qO- http://download.rethinkdb.com/apt/pubkey.gpg | apt-key add -
RUN apt-get update -y
RUN apt-get install -y rethinkdb

RUN curl -sL https://deb.nodesource.com/setup_0.10 | bash -
RUN apt-get install -y nodejs
RUN npm install

EXPOSE 3000
CMD ["node", "index.js"]
