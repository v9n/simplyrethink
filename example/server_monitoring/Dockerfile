FROM mhart/alpine-node:base

# WORKDIR /src
ADD . .

# If you have native dependencies, you'll need extra tools
RUN apk add --update make gcc g++ python

# If you need npm, don't use a base tag
# RUN npm install

# If you had native dependencies you can now remove build tools
# RUN apk del make gcc g++ python && \
#   rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

RUN apk add --update curl 

# Build RethinkDB
ADD http://download.rethinkdb.com/dist/rethinkdb-2.1.3.tgz .
RUN tar -xvf rethinkdb-2.1.3.tgz
RUN cd rethinkdb-2.1.3 && \
    ./configure --allow-fetch && \
    make


EXPOSE 3000
CMD ["node", "index.js"]
