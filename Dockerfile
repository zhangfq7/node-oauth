FROM registry.dataos.io/datafoundry/node

COPY . /node-oauth
WORKDIR /node-oauth

RUN npm install

CMD ["node", "app.js"]
